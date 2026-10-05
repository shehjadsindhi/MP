const fs = require("fs");
const path = require("path");

function syncDbProvider() {
  const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
  if (!fs.existsSync(schemaPath)) {
    console.warn("⚠️ prisma/schema.prisma not found.");
    return;
  }

  const dbUrl = process.env.DATABASE_URL || "";
  const dbProvider = process.env.DATABASE_PROVIDER || "";

  let targetProvider = "sqlite";
  if (dbUrl.startsWith("postgres:") || dbUrl.startsWith("postgresql:") || dbProvider.toLowerCase() === "postgresql") {
    targetProvider = "postgresql";
  } else if (dbUrl.startsWith("file:") || dbProvider.toLowerCase() === "sqlite") {
    targetProvider = "sqlite";
  }

  let schema = fs.readFileSync(schemaPath, "utf-8");
  const regex = /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"([^"]+)"[\s\S]*?\}/;
  const match = schema.match(regex);

  if (match && match[1] !== targetProvider) {
    console.log(`🔄 Syncing Prisma schema datasource provider from "${match[1]}" to "${targetProvider}"...`);
    schema = schema.replace(/provider\s*=\s*"[^"]+"/, `provider = "${targetProvider}"`);
    fs.writeFileSync(schemaPath, schema, "utf-8");
    console.log(`✅ Prisma schema updated to use provider: ${targetProvider}`);
  } else {
    console.log(`ℹ️ Prisma schema already using provider: ${targetProvider}`);
  }
}

syncDbProvider();
