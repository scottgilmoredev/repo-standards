# Contributing to repo-standards

## Prerequisites

- Node.js 24
- pnpm
- git
- GitHub CLI (`gh`)

---

## Development Setup
```bash
git clone git@github.com:scottgilmoredev/repo-standards.git
cd repo-standards
pnpm install
```

---

## Branching

Branches follow the format `<prefix>/<issue-number>-<description>`:
```
feature/42-add-new-bundle
fix/87-directory-resolution
chore/12-update-dependencies
```

**Prefixes:** `feature/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`, `style/`, `perf/`, `ci/`

Always branch from `main`. Open an issue before starting work on anything substantial.

---

## Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org). Every commit message must complete the sentence **"This commit will…"**:
```
feat: add select all option to checklist
fix: resolve directory resolution for nested paths
chore: update inquirer to v10
```

Commits are validated by commitlint on every commit.

---

## Pull Requests

- One PR per issue
- PR title follows Conventional Commits format
- Use the appropriate PR template
- Squash and merge only — no merge commits

---

## Testing

This project uses TDD. Write tests before implementation.
```bash
pnpm run test          # Run tests
pnpm run coverage      # Run tests with coverage report
```

All PRs must have passing tests before merge.

---

## Code Style

ESLint and Prettier are enforced via pre-commit hooks. To run manually:
```bash
pnpm run lint          # Lint
pnpm run lint:fix      # Lint and fix
pnpm run format        # Format
```

---

## Reporting Issues

Use the appropriate issue template. For security vulnerabilities, do not
open a public issue — see [SECURITY.md](SECURITY.md).
