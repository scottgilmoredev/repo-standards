# Environment Variables

## Overview

Environment variables are the standard mechanism for configuring software across environments without hardcoding values in source code. They separate configuration from code — the same codebase runs in development, staging, and production with different behavior driven entirely by the environment.

This document covers naming conventions, `.env` file structure, documentation standards, validation patterns, secrets management, and how to configure environment variables across common deployment contexts.

---

## Why Environment Variables

- **Security** — credentials, API keys, and secrets stay out of source code and version control
- **Flexibility** — the same codebase runs in multiple environments without code changes
- **Portability** — applications can be deployed anywhere the environment is configured correctly
- **Separation of concerns** — configuration is managed independently of code

> [!warning]
> A secret committed to a Git repository — even briefly, even in a private repo — should be considered compromised. Secrets in Git history persist even after deletion. Rotate any credentials that have been committed.

---

## Naming Conventions

Environment variable names should be:

- **`SCREAMING_SNAKE_CASE`** — the universal convention across all languages and platforms
- **Descriptive** — the name should make the purpose clear without context
- **Prefixed by service or scope** where helpful — prevents collisions in projects with many variables

```bash
# ✓ Clear, descriptive, scoped
SQUARESPACE_API_KEY
GOOGLE_SHEETS_CLIENT_EMAIL
DATABASE_URL
JWT_SECRET
PORT
NODE_ENV

# ✗ Vague or ambiguous
KEY
SECRET
API
TOKEN
DB
```

**Prefix conventions:**

| Prefix         | Use For                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `<SERVICE>_`   | Variables scoped to a specific external service — e.g. `STRIPE_SECRET_KEY` |
| `DB_`          | Database connection variables — e.g. `DB_HOST`, `DB_PORT`                  |
| `JWT_`         | JWT configuration — e.g. `JWT_SECRET`, `JWT_EXPIRY`                        |
| `NEXT_PUBLIC_` | Next.js public variables exposed to the browser                            |
| `VITE_`        | Vite public variables exposed to the browser                               |

> [!important] Client-Side Variables
> Variables prefixed with `NEXT_PUBLIC_` or `VITE_` are bundled into client-side code and visible to anyone who inspects the bundle. Never put secrets in these variables — only values that are safe to be public.

---

## Standard Variables

Every Node.js project should define the following:

| Variable    | Values                              | Purpose                                     |
| ----------- | ----------------------------------- | ------------------------------------------- |
| `NODE_ENV`  | `development`, `test`, `production` | Controls environment-specific behavior      |
| `PORT`      | Number                              | Server port — defaults to `3000` if not set |
| `LOG_LEVEL` | `debug`, `info`, `warn`, `error`    | Controls logging verbosity                  |

---

## `.env` Files

### File Types

| File               | Committed   | Purpose                                                     |
| ------------------ | ----------- | ----------------------------------------------------------- |
| `.env`             | ✗           | Local overrides — personal dev config, never committed      |
| `.env.example`     | ✓           | Template showing required variables with placeholder values |
| `.env.local`       | ✗           | Local machine overrides — takes precedence over `.env`      |
| `.env.development` | Situational | Shared development defaults — commit only if no secrets     |
| `.env.test`        | Situational | Test environment config — commit only if no secrets         |
| `.env.production`  | ✗           | Never commit production secrets                             |

> [!warning]
> Add `.env`, `.env.local`, and `.env.production` to `.gitignore` before creating them. The only `.env` file that should ever be committed is `.env.example`.

### `.env.example`

The `.env.example` file is the documentation contract for your environment configuration. It should list every variable the application requires, with:

- A placeholder or safe default value
- A comment explaining what the variable is and where to get it

```bash
# .env.example

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# Squarespace API
# Get this from: Squarespace → Settings → Advanced → API Keys
SQUARESPACE_API_KEY=your-api-key-here

# Google Sheets API
# Get this from: Google Cloud Console → Service Accounts
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
```

> [!tip]
> Keep `.env.example` current. Every time you add a new environment variable to the application, add it to `.env.example` immediately. A stale example file creates friction for new contributors and your future self.

### Loading `.env` Files

Use `dotenv` to load `.env` files in Node.js:

```bash
npm install dotenv
```

```typescript
// Load at the very top of your entry point — before any other imports
import 'dotenv/config'
```

Or explicitly:

```typescript
import dotenv from 'dotenv'
dotenv.config()
```

> [!note]
> Framework-specific `.env` loading (Next.js, Vite) is covered in the relevant scaffold docs — [[nextjs-scaffold 1]], [[react-scaffold]]. Those frameworks load `.env` files automatically without requiring `dotenv`.

---

## Validation

Validate all required environment variables at application startup — before the server begins handling requests. This is the **fail-fast** pattern: surface missing or invalid configuration immediately rather than failing silently at runtime when a variable is first accessed.

### Manual Validation

```typescript
// config.ts — validate and export all config at startup

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function requireEnvInt(key: string): number {
  const value = requireEnv(key)
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be an integer, got: "${value}"`)
  }
  return parsed
}

export const config = {
  port: requireEnvInt('PORT'),
  nodeEnv: requireEnv('NODE_ENV'),
  jwtSecret: requireEnv('JWT_SECRET'),
  squarespaceApiKey: requireEnv('SQUARESPACE_API_KEY'),
  database: {
    url: requireEnv('DATABASE_URL'),
  },
} as const
```

**Import `config` throughout the application — never access `process.env` directly:**

```typescript
// ✓ Use the validated config object
import { config } from './config'
const port = config.port

// ✗ Access process.env directly — bypasses validation
const port = process.env.PORT
```

### Schema Validation with Zod

For more complex validation — type coercion, optional variables with defaults, enum values — use Zod:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  SQUARESPACE_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const config = parsed.data
```

> [!tip]
> Zod validation at startup gives you type-safe config with coercion and defaults — `config.port` is typed as `number`, not `string | undefined`. This eliminates an entire class of runtime errors.

📖 [dotenv](https://github.com/motdotla/dotenv) · [Zod](https://zod.dev)

---

## Secrets Management

### What Is a Secret

A secret is any value that grants access to a system or resource and must not be exposed publicly:

- API keys and tokens
- Database credentials
- Private keys and certificates
- OAuth client secrets
- Encryption keys and salts

**Not secrets** (safe to commit if needed):

- `NODE_ENV`
- `PORT`
- `LOG_LEVEL`
- Public API endpoints or base URLs

### Local Development

Store secrets in your local `.env` file. Never commit it.

```bash
# .env — never committed
SQUARESPACE_API_KEY=sq_live_actualkey123
JWT_SECRET=a-very-long-random-string-for-local-dev
```

### GitHub Actions Secrets

Store secrets used in CI/CD workflows in GitHub repository secrets:

`Repository Settings → Secrets and variables → Actions → New repository secret`

Reference in workflows:

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: npm run deploy
```

> [!warning]
> GitHub Actions secrets are masked in logs — they appear as `***`. However, be careful not to echo or log secret values in ways that could expose them indirectly (e.g. base64 encoding, splitting across multiple log lines).

See `[[github-actions#Secrets and Environment Variables]]` for the full workflow context.

### Vercel

Set environment variables per environment (Development, Preview, Production) in the Vercel dashboard:

`Project → Settings → Environment Variables`

Or via CLI:

```bash
# Add a production secret
vercel env add SQUARESPACE_API_KEY production

# List all environment variables
vercel env ls

# Pull environment variables to local .env file
vercel env pull .env.local
```

> [!tip] `vercel env pull`
> `vercel env pull` downloads your project's environment variables from Vercel to a local `.env.local` file. This is the recommended way to keep your local environment in sync with Vercel without manually copying values.

### Other Platforms

Most deployment platforms follow the same pattern — environment variables are set in the platform dashboard or CLI and injected at runtime. Refer to the platform documentation:

- **Fly.io** — `flyctl secrets set KEY=value`
- **Railway** — Dashboard → Variables
- **Render** — Dashboard → Environment

---

## Documentation Standards

Every environment variable in `.env.example` should have a comment that answers:

1. What is it?
2. What values are valid?
3. Where do you get it (for secrets)?

```bash
# The port the server listens on.
# Default: 3000
PORT=3000

# Controls environment-specific behavior.
# Valid values: development | test | production
NODE_ENV=development

# Secret key used to sign JWT tokens.
# Must be at least 32 characters. Generate with: openssl rand -base64 32
JWT_SECRET=your-secret-here

# Squarespace API key for product sync.
# Get this from: Squarespace Dashboard → Settings → Advanced → API Keys
# Required scopes: products.read, products.write
SQUARESPACE_API_KEY=your-api-key-here
```

---

## Out of Scope

The following topics were intentionally excluded and may be added in a future revision:

- **Secret rotation** — automating the rotation of credentials on a schedule
- **Vault and secrets managers** — HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager
- **Environment variable encryption** — encrypting `.env` files at rest
- **Multi-environment promotion** — promoting config changes from dev → staging → production safely

---

_Related: `[[rest-api-conventions]]` · `[[github-actions]]` · `[[project-setup-checklist]]` · `[[tdd-reference]]`_
