# Contributing Guide

Thank you for your interest in contributing to **<project-name>**. This guide covers environment setup, development workflow, and contribution standards.

---

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run tests** to confirm setup works:
   ```bash
   npm test
   ```

---

## Development Workflow

### Branching

Create branches off `main` using the following naming convention:

```
<prefix>/<issue-number>-<short-description>
```

| Prefix      | Use For                                                  |
| ----------- | -------------------------------------------------------- |
| `feature/`  | New features or enhancements                             |
| `fix/`      | Bug fixes, corrections, broken behavior                  |
| `docs/`     | Documentation changes only                               |
| `refactor/` | Code restructuring with no behavior change               |
| `test/`     | Adding or modifying tests only                           |
| `chore/`    | Dependency updates, config changes, tooling, maintenance |
| `style/`    | Formatting, whitespace — no logic change                 |
| `perf/`     | Performance improvements                                 |
| `ci/`       | CI/CD configuration changes                              |

**Examples:**

```
feature/42-user-authentication
fix/87-login-redirect-loop
docs/update-api-readme
```

Include the issue number when one exists. Omit it for small changes with no corresponding issue.

---

### Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org) specification.

**Format:**

```
<type>(<scope>): <description>
```

The description should complete the sentence **"This commit will …"**

**Examples:**

```
feat(auth): add password reset flow
fix(api): resolve null pointer on user logout
docs: update installation steps in README
chore: upgrade dependencies to latest
```

---

### Pull Requests

- Keep PRs small and focused on a single unit of work
- Use the correct PR template for your change type — see [Pull Request Templates](.github/PULL_REQUEST_TEMPLATE/)
- Ensure all checklist items in the template are satisfied before requesting review
- PR titles should follow the Conventional Commits format:
  ```
  feat(auth): add password reset flow (#42)
  ```

#### Selecting a template via URL

```
https://github.com/<username>/<repo>/compare/main...<your-branch>?quick_pull=1&template=<template-file>
```

#### Selecting a template via GitHub CLI

```bash
gh pr create --template "feature.md"
```

---

## Code Standards

- **Language:** TypeScript
- **Module system:** ESM (`"type": "module"`)
- **Style:** Airbnb ESLint config with Prettier
- **Testing:** Vitest — this project practices TDD
- **Documentation:** All modules, functions, and types must include JSDoc comments
- **Structure:** DRY, modular, and consistent

Run checks locally before opening a PR:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run typecheck
```

---

## Testing

This project practices **test-driven development (TDD)**:

1. Write a failing test
2. Implement the minimum code to make it pass
3. Refactor while keeping tests green

```bash
# Run the full test suite
npm test

# Run in watch mode during development
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

---

## Reporting Issues

Use [GitHub Issues](../../issues) to report bugs or request features. Use the appropriate issue template:

- **[Bug report](../../issues/new?template=bug.md)** — unexpected behavior, errors, regressions
- **[Feature request](../../issues/new?template=feature.md)** — new functionality or improvements

When reporting a bug, include:

- Node.js version
- Steps to reproduce
- Expected vs actual behavior

---

## Deployment

<!-- Describe the deployment environment and process for this project. -->
<!-- Example: -->
<!-- The application is deployed to Vercel. Deployments are triggered automatically -->
<!-- via GitHub Actions when changes are merged into `main`. -->

---

## License

This project is licensed under the **<license-type>** License. By contributing, you agree that your contributions will be licensed under the same terms. See [LICENSE](./LICENSE) for details.
