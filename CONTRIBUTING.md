# Contributing to Galaxy AI Hub

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

---

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

---

## How to Contribute

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/shehjadsindhi/MP.git
cd galaxy-ai-hub

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Initialize database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

### 2. Security Setup (REQUIRED)

**Before making any commits, you MUST run the security hooks setup:**

```bash
setup-hooks.bat
```

This installs:
- **pre-commit hook**: Blocks secrets, .env files, node_modules, large files
- **pre-push hook**: Runs TypeScript, lint, and Prisma validation

**DO NOT bypass hooks** (`--no-verify`) unless absolutely necessary and approved.

### 3. Create a Branch

```bash
# Always create a new branch for your work
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `security/` - Security improvements
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### 4. Make Changes

- Follow the existing code style (TypeScript, ESLint)
- Write clean, readable, and maintainable code
- Add comments for complex logic
- Update documentation if needed
- Ensure all tests pass

### 5. Commit Guidelines

**Commit message format:**
```
type(scope): description

[optional body]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `security` - Security improvement
- `refactor` - Code refactoring
- `docs` - Documentation
- `chore` - Maintenance tasks

**Examples:**
```
feat(ai): add photo editing demo
fix(auth): resolve JWT token expiry issue
security(api): add rate limiting to orders
docs(readme): update deployment instructions
```

### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Link to related issues
- Screenshots for UI changes
- Test plan/verification steps

---

## Security Requirements

### ⚠️ NEVER Commit:
- `.env` files or any files containing secrets
- API keys, tokens, passwords, private keys
- `node_modules/` or build artifacts
- Database files (`*.db`, `*.sqlite`)
- Large files (>10MB)

### ✅ Always:
- Use environment variables for secrets
- Validate all user inputs with Zod
- Use Prisma for database queries (no raw SQL)
- Calculate prices server-side only
- Log security events (failed logins, rate limits)
- Run security hooks before committing

### 🔒 Authentication & Authorization:
- All protected routes must use `getSessionUser()` or `requireAdmin()`
- Admin routes must check `user.role === "ADMIN"`
- Passwords must be hashed with bcrypt (12 rounds)
- JWT tokens stored in HttpOnly cookies

### 🛡️ Input Validation:
- All POST/PUT routes must have Zod schemas
- Validate file uploads (size, type)
- Sanitize user inputs
- Use parameterized queries (Prisma)

---

## Code Review Process

1. **Automated Checks** (run on every PR):
   - TypeScript compilation
   - ESLint
   - Prisma schema validation

2. **Manual Review**:
   - Code quality and style
   - Security considerations
   - Performance impact
   - Test coverage

3. **Approval Required**:
   - At least 1 maintainer approval
   - All automated checks passing
   - No unresolved security concerns

---

## Testing

Before submitting a PR, verify:

```bash
# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint

# Build check
npm run build

# Test the application
npm run dev
```

---

## Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: **shehjadsindhi95@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

---

## License

This project is private and confidential. All rights reserved.
