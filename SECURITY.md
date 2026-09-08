# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Galaxy AI Hub, please report it responsibly:

1. **DO NOT** open a public issue on GitHub
2. Email security concerns to: **shehjadsindhi95@gmail.com**
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge within 48 hours and provide a detailed response within 7 days.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## Security Measures Implemented

### 1. Authentication & Authorization
- **JWT Tokens**: Stored in HttpOnly cookies (XSS protection)
- **Password Hashing**: bcrypt with 12 rounds
- **Cookie Security**: `SameSite: Strict`, `Secure` flag in production
- **Role-Based Access**: USER and ADMIN roles with protected routes

### 2. Input Validation
- **Zod Schemas**: All POST/PUT routes validated
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React auto-escaping + input sanitization
- **File Upload Restrictions**: Size limits, type checks

### 3. Rate Limiting
- **In-Memory Rate Limiter**: Per-endpoint limits
  - Auth: 5 requests/minute
  - AI APIs: 20 requests/minute
  - Orders: 10 requests/minute
  - Newsletter: 5 requests/minute
  - Admin mutations: 30 requests/minute

### 4. Data Protection
- **No Client-Trusted Prices**: All prices calculated server-side
- **Secure Order Numbers**: Collision-resistant generation
- **Sensitive Data Exclusion**: Passwords never returned in API responses
- **Environment Variables**: Secrets stored in `.env` (gitignored)

### 5. Git Security
- **Pre-Commit Hook**: Blocks secrets, .env files, node_modules, large files
- **Pre-Push Hook**: Runs TypeScript check, lint, Prisma validation
- **Branch Protection**: Recommended for GitHub main branch
- **.gitignore**: Comprehensive exclusion of sensitive/build files

---

## Secure Deployment Checklist

### Before Deployment:
- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Configure `DATABASE_URL` with PostgreSQL
- [ ] Set `NODE_ENV=production`
- [ ] Enable `Secure` flag on cookies (automatic in production)
- [ ] Configure CORS if needed
- [ ] Enable HTTPS only (Vercel handles this)
- [ ] Set up database backups
- [ ] Configure rate limiting for production (Redis recommended)
- [ ] Add error monitoring (Sentry, LogRocket)
- [ ] Enable security headers (CSP, X-Frame-Options)

### Environment Variables (Never Commit):
```env
JWT_SECRET=<32+ random characters>
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
OPENAI_API_KEY=...
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## Branch Protection Rules (GitHub)

Recommended settings for the `main` branch:

1. **Require pull request reviews** before merging
2. **Require status checks** to pass before merging:
   - TypeScript check
   - Lint check
   - Build check
3. **Require branches to be up to date** before merging
4. **Do not allow force pushes** to main
5. **Do not allow deletions** of main branch

---

## Incident Response

If a security incident occurs:

1. **Identify** the scope and severity
2. **Contain** the vulnerability (disable affected features if needed)
3. **Assess** the impact on users
4. **Remediate** the vulnerability
5. **Notify** affected users if data was compromised
6. **Document** the incident and lessons learned

---

## Security Best Practices for Contributors

1. **Never commit secrets** (.env, API keys, passwords)
2. **Always validate input** using Zod schemas
3. **Use parameterized queries** (Prisma handles this)
4. **Never trust client-side data** for prices/auth
5. **Run security hooks** before committing
6. **Keep dependencies updated** (`npm audit`)
7. **Follow the principle of least privilege** for admin features
8. **Log security events** (failed logins, rate limit hits)

---

## Dependencies Security

Regularly audit dependencies:
```bash
npm audit
npm audit fix
```

Update dependencies monthly:
```bash
npm outdated
npm update
```

---

## Contact

For security concerns: **shehjadsindhi95@gmail.com**
