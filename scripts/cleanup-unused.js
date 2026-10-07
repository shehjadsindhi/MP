#!/usr/bin/env node
/**
 * Project Cleanup Script - Identifies and safely removes unused files
 * Run with: node scripts/cleanup-unused.js [--dry-run] [--delete]
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const EXTENSIONS_TO_ANALYZE = ['.ts', '.tsx', '.js', '.jsx', '.json'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.nyc_output', '.kilo'];
const IGNORE_FILES = ['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.tsbuildinfo', 'next.config.mjs', 'next.config.js', 'tailwind.config.js', 'postcss.config.js', 'jest.config.js', 'jest.config.ts', '.eslintrc.js', '.eslintrc.json', 'README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'LICENSE', '.env', '.env.example', '.env.local', '.gitignore', '.dockerignore', 'Dockerfile', 'docker-compose.yml', 'render.yaml', 'prisma/schema.prisma', 'prisma/seed.js', 'prisma/dev.db'];

const DRY_RUN = process.argv.includes('--dry-run') || !process.argv.includes('--delete');
const VERBOSE = process.argv.includes('--verbose');

function log(...args) {
  if (VERBOSE || !DRY_RUN) console.log(...args);
}

function logDryRun(...args) {
  if (DRY_RUN) console.log('[DRY-RUN]', ...args);
  else console.log('[DELETE]', ...args);
}

function shouldIgnoreDir(dir) {
  return IGNORE_DIRS.some(ignored => dir.includes(path.sep + ignored + path.sep) || dir.endsWith(path.sep + ignored));
}

function shouldIgnoreFile(filePath) {
  const relative = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
  return IGNORE_FILES.some(ignored => relative === ignored || relative.startsWith(ignored + '/'));
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (shouldIgnoreDir(fullPath)) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function extractImports(content, filePath) {
  const imports = new Set();
  
  // ES6 imports
  const importRegex = /import\s+(?:[^'"\n]+\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  // CommonJS requires
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  // Dynamic imports
  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  return imports;
}

function resolveImport(importPath, fromFile) {
  if (importPath.startsWith('.')) {
    // Relative import
    const dir = path.dirname(fromFile);
    let resolved = path.resolve(dir, importPath);
    
    // Try with extensions
    for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx']) {
      const tryPath = resolved + ext;
      if (fs.existsSync(tryPath)) return path.relative(PROJECT_ROOT, tryPath).replace(/\\/g, '/');
    }
    
    // Try directory with index
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      for (const ext of ['index.ts', 'index.tsx', 'index.js', 'index.jsx']) {
        const tryPath = path.join(resolved, ext);
        if (fs.existsSync(tryPath)) return path.relative(PROJECT_ROOT, tryPath).replace(/\\/g, '/');
      }
    }
    
    return path.relative(PROJECT_ROOT, resolved).replace(/\\/g, '/');
  }
  
  if (importPath.startsWith('@/')) {
    // Path alias @/* -> src/*
    return importPath.replace('@/', 'src/');
  }
  
  // Package import - ignore
  return null;
}

function isNextJsSpecialFile(relative) {
  // Next.js App Router special files (accessed via filesystem routing, not imports)
  const specialNames = [
    'page.tsx', 'page.ts', 'page.jsx', 'page.js',
    'layout.tsx', 'layout.ts', 'layout.jsx', 'layout.js',
    'loading.tsx', 'loading.ts', 'loading.jsx', 'loading.js',
    'error.tsx', 'error.ts', 'error.jsx', 'error.js',
    'not-found.tsx', 'not-found.ts', 'not-found.jsx', 'not-found.js',
    'global-error.tsx', 'global-error.ts',
    'route.ts', 'route.js',
    'middleware.ts', 'middleware.js',
    'template.tsx', 'template.ts',
    'default.tsx', 'default.ts',
    'robots.ts', 'robots.js',
    'sitemap.ts', 'sitemap.js',
    'opengraph-image.tsx', 'opengraph-image.ts',
    'twitter-image.tsx', 'twitter-image.ts',
    'icon.tsx', 'icon.ts',
    'apple-icon.tsx', 'apple-icon.ts',
    'favicon.ico',
  ];
  
  const fileName = path.basename(relative);
  return specialNames.includes(fileName);
}

function isNextJsRouteFile(relative) {
  // Files under src/app/ that are part of the routing system
  if (!relative.startsWith('src/app/')) return false;
  return isNextJsSpecialFile(relative);
}

function analyzeProject() {
  log('Scanning project files...');
  const allFiles = getAllFiles(PROJECT_ROOT);
  
  const sourceFiles = allFiles.filter(f => 
    EXTENSIONS_TO_ANALYZE.some(ext => f.endsWith(ext)) && !shouldIgnoreFile(f)
  );
  
  log(`Found ${sourceFiles.length} source files to analyze`);
  
  const importedFiles = new Set();
  const fileImports = new Map();
  
  for (const file of sourceFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const imports = extractImports(content, file);
      const resolvedImports = new Set();
      
      for (const imp of imports) {
        const resolved = resolveImport(imp, file);
        if (resolved) resolvedImports.add(resolved);
      }
      
      fileImports.set(path.relative(PROJECT_ROOT, file).replace(/\\/g, '/'), resolvedImports);
      for (const imp of resolvedImports) {
        importedFiles.add(imp);
      }
    } catch (e) {
      log(`Warning: Could not read ${file}:`, e.message);
    }
  }
  
  // Also check for files referenced in config files
  const configFiles = allFiles.filter(f => 
    f.endsWith('tsconfig.json') || f.endsWith('jest.config.js') || f.endsWith('jest.config.ts') ||
    f.endsWith('next.config.mjs') || f.endsWith('next.config.js') ||
    f.endsWith('tailwind.config.js') || f.endsWith('swagger.ts')
  );
  
  for (const file of configFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      // Look for file paths in configs
      const pathMatches = content.match(/['"]([^'"]*\.(?:ts|tsx|js|jsx|json|css|scss))['"]/g) || [];
      for (const match of pathMatches) {
        const p = match.slice(1, -1);
        if (p.startsWith('./') || p.startsWith('../') || p.startsWith('src/') || p.startsWith('@/')) {
          const resolved = p.startsWith('@/') ? p.replace('@/', 'src/') : path.resolve(path.dirname(file), p).replace(/\\/g, '/');
          importedFiles.add(path.relative(PROJECT_ROOT, resolved).replace(/\\/g, '/'));
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  
  return { allFiles, sourceFiles, importedFiles, fileImports };
}

function findUnusedFiles(allFiles, importedFiles) {
  const unused = [];
  
  for (const file of allFiles) {
    if (shouldIgnoreFile(file)) continue;
    if (shouldIgnoreDir(file)) continue;
    
    const relative = path.relative(PROJECT_ROOT, file).replace(/\\/g, '/');
    
    // Check if file is imported
    let isImported = importedFiles.has(relative);
    
    // Also check without extension
    if (!isImported) {
      for (const ext of EXTENSIONS_TO_ANALYZE) {
        if (importedFiles.has(relative.replace(new RegExp(ext.replace('.', '\\.') + '$'), ''))) {
          isImported = true;
          break;
        }
      }
    }
    
    // Check index files for directory imports
    if (!isImported && relative.endsWith('/index.ts')) {
      const dirPath = relative.replace('/index.ts', '');
      if (importedFiles.has(dirPath) || importedFiles.has(dirPath + '/')) {
        isImported = true;
      }
    }
    
    // Special cases: entry points, public assets, etc.
    const isPublicAsset = relative.startsWith('public/');
    const isPrismaFile = relative.startsWith('prisma/');
    const isTestFile = relative.includes('__tests__') || relative.endsWith('.test.ts') || relative.endsWith('.test.tsx') || relative.endsWith('.spec.ts') || relative.endsWith('.spec.tsx');
    const isConfigFile = ['package.json', 'tsconfig.json', 'tailwind.config.js', 'postcss.config.js', 'jest.config.js', 'jest.config.ts', '.eslintrc.js', '.eslintrc.json', 'README.md', 'CONTRIBUTING.md', 'SECURITY.md', '.gitignore', '.dockerignore', 'Dockerfile', 'docker-compose.yml', 'render.yaml'].includes(relative);
    const isScriptFile = relative.startsWith('scripts/');
    const isNextJsRoute = isNextJsRouteFile(relative);
    const isMiddleware = relative === 'src/middleware.ts' || relative === 'src/middleware.js';
    const isPrismaClient = relative === 'src/lib/prisma.ts';
    const isNextConfig = relative === 'next.config.mjs' || relative === 'next.config.js';
    const isNextEnv = relative === 'next-env.d.ts';
    const isSentryConfig = relative === 'sentry.client.config.ts' || relative === 'sentry.server.config.ts' || relative === 'sentry.edge.config.ts';
    const isJestSetup = relative === 'jest.setup.ts' || relative === 'jest.setup.js';
    const isVscodeConfig = relative.startsWith('.vscode/');
    const isGithubWorkflow = relative.startsWith('.github/workflows/');
    const isSetupScript = relative === 'setup-hooks.bat' || relative === 'setup-hooks.sh';
    const isDocFile = relative === 'implementation_plan.md' || relative === 'task.md';
    
    const isProtected = isPublicAsset || isPrismaFile || isTestFile || isConfigFile || isScriptFile || isNextJsRoute || isMiddleware || isPrismaClient || isNextConfig || isNextEnv || isSentryConfig || isJestSetup || isVscodeConfig || isGithubWorkflow || isSetupScript || isDocFile;
    
    if (!isImported && !isProtected) {
      unused.push(relative);
    }
  }
  
  return unused;
}

function findEmptyDirs(allFiles) {
  const dirs = new Set();
  for (const file of allFiles) {
    if (shouldIgnoreDir(file)) continue;
    let dir = path.dirname(file);
    while (dir !== PROJECT_ROOT && !shouldIgnoreDir(dir)) {
      dirs.add(dir);
      dir = path.dirname(dir);
    }
  }
  
  const emptyDirs = [];
  for (const dir of dirs) {
    try {
      const entries = fs.readdirSync(dir).filter(e => !shouldIgnoreDir(path.join(dir, e)));
      if (entries.length === 0) {
        emptyDirs.push(path.relative(PROJECT_ROOT, dir).replace(/\\/g, '/'));
      }
    } catch (e) {
      // Ignore
    }
  }
  
  return emptyDirs.sort((a, b) => b.length - a.length); // Delete deepest first
}

function findLargeUnusedFiles(allFiles, unusedFiles, minSizeKB = 100) {
  const largeFiles = [];
  for (const file of unusedFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    try {
      const stats = fs.statSync(fullPath);
      const sizeKB = stats.size / 1024;
      if (sizeKB >= minSizeKB) {
        largeFiles.push({ file, sizeKB: Math.round(sizeKB) });
      }
    } catch (e) {
      // Ignore
    }
  }
  return largeFiles.sort((a, b) => b.sizeKB - a.sizeKB);
}

async function main() {
  console.log('=== Galaxy AI Hub - Project Cleanup Analysis ===\n');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (use --delete to actually delete)' : 'DELETE MODE'}\n`);
  
  const { allFiles, sourceFiles, importedFiles, fileImports } = analyzeProject();
  
  const unusedFiles = findUnusedFiles(allFiles, importedFiles);
  const emptyDirs = findEmptyDirs(allFiles);
  const largeUnused = findLargeUnusedFiles(allFiles, unusedFiles);
  
  console.log(`\n=== Summary ===`);
  console.log(`Total files scanned: ${allFiles.length}`);
  console.log(`Source files analyzed: ${sourceFiles.length}`);
  console.log(`Files imported/referenced: ${importedFiles.size}`);
  console.log(`Potentially unused files: ${unusedFiles.length}`);
  console.log(`Empty directories: ${emptyDirs.length}`);
  console.log(`Large unused files (>100KB): ${largeUnused.length}`);
  
  if (unusedFiles.length > 0) {
    console.log(`\n=== Potentially Unused Files ===`);
    for (const file of unusedFiles) {
      const fullPath = path.join(PROJECT_ROOT, file);
      let size = '';
      try {
        const stats = fs.statSync(fullPath);
        size = ` (${Math.round(stats.size / 1024)} KB)`;
      } catch {}
      logDryRun(`  ${file}${size}`);
    }
  }
  
  if (largeUnused.length > 0) {
    console.log(`\n=== Large Unused Files (candidates for removal) ===`);
    for (const { file, sizeKB } of largeUnused) {
      logDryRun(`  ${file} (${sizeKB} KB)`);
    }
  }
  
  if (emptyDirs.length > 0) {
    console.log(`\n=== Empty Directories ===`);
    for (const dir of emptyDirs) {
      logDryRun(`  ${dir}/`);
    }
  }
  
  // Check for duplicate/backup files
  const backupFiles = allFiles.filter(f => 
    f.endsWith('.bak') || f.endsWith('.backup') || f.endsWith('.tmp') || f.endsWith('.temp') ||
    f.includes('.db.bak') || f.includes('.db.backup')
  ).map(f => path.relative(PROJECT_ROOT, f).replace(/\\/g, '/'));
  
  if (backupFiles.length > 0) {
    console.log(`\n=== Backup/Temp Files ===`);
    for (const file of backupFiles) {
      const fullPath = path.join(PROJECT_ROOT, file);
      let size = '';
      try {
        const stats = fs.statSync(fullPath);
        size = ` (${Math.round(stats.size / 1024)} KB)`;
      } catch {}
      logDryRun(`  ${file}${size}`);
    }
  }
  
  if (DRY_RUN) {
    console.log(`\n=== Next Steps ===`);
    console.log(`Run with --delete to remove the above files:`);
    console.log(`  node scripts/cleanup-unused.js --delete`);
    console.log(`\nOr run with --dry-run --verbose for more details:`);
    console.log(`  node scripts/cleanup-unused.js --dry-run --verbose`);
    return;
  }
  
  // Actual deletion
  console.log('\n=== Deleting Files ===');
  let deletedCount = 0;
  let deletedSize = 0;
  
  for (const file of unusedFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    try {
      const stats = fs.statSync(fullPath);
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${file} (${Math.round(stats.size / 1024)} KB)`);
      deletedCount++;
      deletedSize += stats.size;
    } catch (e) {
      console.log(`Failed to delete ${file}: ${e.message}`);
    }
  }
  
  for (const file of backupFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    try {
      const stats = fs.statSync(fullPath);
      fs.unlinkSync(fullPath);
      console.log(`Deleted backup: ${file} (${Math.round(stats.size / 1024)} KB)`);
      deletedCount++;
      deletedSize += stats.size;
    } catch (e) {
      console.log(`Failed to delete ${file}: ${e.message}`);
    }
  }
  
  for (const dir of emptyDirs) {
    const fullPath = path.join(PROJECT_ROOT, dir);
    try {
      fs.rmdirSync(fullPath);
      console.log(`Deleted empty dir: ${dir}/`);
    } catch (e) {
      // Directory might not be empty anymore
    }
  }
  
  console.log(`\n=== Done ===`);
  console.log(`Deleted ${deletedCount} files (${Math.round(deletedSize / 1024)} KB freed)`);
}

main().catch(console.error);