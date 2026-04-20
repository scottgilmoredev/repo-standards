# Conventional Commits

## Overview

Conventional Commits is a specification for writing structured, machine-readable commit messages. It provides a consistent format that makes commit history scannable, supports automated changelog generation, and communicates the intent of a change at a glance.

Full specification: [conventionalcommits.org](https://www.conventionalcommits.org)

---

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Components

| Component     | Required | Description                                                                                |
| ------------- | -------- | ------------------------------------------------------------------------------------------ |
| `type`        | Yes      | Category of change — see type reference below                                              |
| `scope`       | No       | The area of the codebase affected, in parentheses — e.g. `(auth)`, `(api)`                 |
| `description` | Yes      | Short summary completing the sentence "This commit will …" — lowercase, no trailing period |
| `body`        | No       | Longer explanation of what changed and why — separated from description by a blank line    |
| `footer`      | No       | Breaking change notices, issue references — separated from body by a blank line            |

---

## Description Convention

The description should complete the following sentence:

> **"This commit will …"**

This naturally enforces the correct tense and phrasing without ambiguity.

```
✓  add password reset flow
✓  resolve null pointer on logout
✓  update installation steps in README
✓  extract auth logic into service layer

✗  added password reset flow
✗  fixes null pointer on logout
✗  updating installation steps
✗  auth refactor
```

> [!tip]
> If you cannot complete the sentence clearly and concisely, the commit is likely doing too much. Consider splitting it into smaller, focused commits.

---

## Type Reference

| Type       | Use For                                                  | Branch Prefix |
| ---------- | -------------------------------------------------------- | ------------- |
| `feat`     | A new feature                                            | `feature/`    |
| `fix`      | A bug fix                                                | `fix/`        |
| `docs`     | Documentation changes only                               | `docs/`       |
| `refactor` | Code restructuring with no behavior change               | `refactor/`   |
| `test`     | Adding or modifying tests only                           | `test/`       |
| `chore`    | Dependency updates, config changes, tooling, maintenance | `chore/`      |
| `style`    | Formatting, whitespace, semicolons — no logic change     | `style/`      |
| `perf`     | Performance improvements                                 | `perf/`       |
| `ci`       | CI/CD configuration changes                              | `ci/`         |
| `revert`   | Reverts a previous commit                                | —             |

> [!note] Branch Prefix Alignment
> Commit types align directly with branch naming prefixes defined in [branching-strategy](branching-strategy.md). `revert` is the only type without a corresponding branch prefix — reverts are typically committed directly on an existing branch rather than a dedicated one.

---

## Examples

### Minimal — type and description only

```
feat: add password reset flow
fix: resolve null pointer on logout
docs: update installation steps in README
chore: upgrade dependencies to latest
```

### With scope

```
feat(auth): add password reset flow
fix(api): resolve null pointer on user logout
refactor(components): extract button into shared component
test(auth): add unit tests for password reset service
```

### With body

```
feat(auth): add password reset flow

Implements email-based password reset. Users receive a tokenized
link valid for 24 hours. Token is invalidated on use or expiry.
```

### With footer — issue reference

```
fix(api): resolve null pointer on user logout

Closes #87
```

### With footer — breaking change

```
feat(api): replace user ID format with UUID

BREAKING CHANGE: user IDs are now UUIDs. Existing integer IDs
are no longer valid. Clients must migrate to the new format.
```

> [!important] Breaking Changes
> A breaking change must be indicated either by adding `BREAKING CHANGE:` in the footer, or by appending `!` after the type/scope:
>
> ```
> feat(api)!: replace user ID format with UUID
> ```
>
> Both forms are valid. The `!` form is more visible at a glance; the footer form allows an explanatory message.

---

## Full Example

```
feat(auth): add multi-factor authentication support

Adds TOTP-based MFA as an optional account security feature.
Users can enable MFA from account settings. Backup codes are
generated on enrollment and can be regenerated at any time.

Closes #112
```

---

## Quick Reference

```
feat:              add a new feature
fix:               resolve a bug
docs:              update documentation
refactor:          restructure code without behavior change
test:              add or update tests
chore:             update dependencies, tooling, config
style:             formatting only — no logic change
perf:              improve performance
ci:                update CI/CD configuration
revert:            revert a previous commit
```

---

_Related: [branching-strategy](branching-strategy.md) · [pr-conventions](pr-conventions.md) · git-reference_
