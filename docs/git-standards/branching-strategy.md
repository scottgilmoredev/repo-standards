# Branching Strategy

## Overview

This document covers branching workflows, branch naming conventions, and merge strategies. The goal is a consistent, professional approach that works across solo projects, small teams, and larger collaborative environments.

For commit message conventions see [[conventional-commits]]. For pull request conventions see [[pr-conventions]].

---

## Workflows

### GitHub Flow (Recommended Default)

GitHub Flow is a lightweight, branch-based workflow built around a single rule: **`main` is always deployable**. All work happens on short-lived branches that are merged back to `main` via pull request.

**When to use it:**

- Solo projects and portfolio work
- Small to large teams with continuous deployment
- Most web application and frontend projects

**The workflow:**

```
main ──────────────────────────────────────────► (always deployable)
       │                          ▲
       └── feature/<name> ────────┘
               (PR + review + merge)
```

1. Branch off `main`
2. Do your work in small, focused commits
3. Open a pull request
4. Review, discuss, iterate
5. Merge into `main`
6. Delete the branch

> [!important] Keep Branches Short-lived
> Branches should represent a single unit of work and be merged as soon as that work is complete and reviewed. Long-lived branches accumulate conflicts and become difficult to merge. If a feature is too large to merge quickly, break it into smaller incremental branches.

---

### GitFlow

GitFlow introduces a permanent `develop` branch as the integration target, with structured `feature/`, `release/`, and `hotfix/` branches and strict rules about what merges where.

**When to use it:**

- Software with scheduled versioned releases (e.g. `v1.0`, `v2.0`)
- Libraries or packages with formal release cycles
- Teams that require a staging integration branch before release

**Branch structure:**

```
main ─────────────────────────────────────────► (production releases only)
        ▲                              ▲
hotfix/ │                              │ release/
        │                              │
develop ──────────────────────────────────────► (integration branch)
       │                   ▲
       └── feature/<name> ─┘
```

| Branch              | Purpose                                                                          |
| ------------------- | -------------------------------------------------------------------------------- |
| `main`              | Production-ready code only — tagged releases                                     |
| `develop`           | Integration branch — all features merge here                                     |
| `feature/<name>`    | New features — branch from and merge back to `develop`                           |
| `release/<version>` | Release preparation — branch from `develop`, merge to both `main` and `develop`  |
| `hotfix/<name>`     | Urgent production fixes — branch from `main`, merge to both `main` and `develop` |

> [!note]
> GitFlow adds meaningful overhead. For most web projects — including portfolio work and continuous deployment setups — GitHub Flow is simpler and more appropriate. Use GitFlow only when a structured release cycle is a genuine requirement.

---

### Trunk-Based Development

All developers commit directly to `main` (the trunk), or use extremely short-lived branches measured in hours rather than days. Incomplete features are hidden behind feature flags rather than long-lived branches.

**When to use it:**

- Large engineering teams with strong CI/CD pipelines and high test coverage
- Organizations practicing continuous integration at scale

> [!warning]
> Trunk-based development requires robust automated testing and deployment infrastructure to work safely. Without it, committing directly to `main` is high risk. It is not recommended without that foundation in place.

---

## Branch Naming Conventions

Consistent branch naming makes the purpose of a branch immediately clear in logs, PR lists, and repository views.

### Format

```
<prefix>/<issue-number>-<short-description>
```

- **Prefix** — the category of work (see table below)
- **Issue number** — include when an issue exists, omit when it does not
- **Short description** — brief, kebab-case summary of the work

**Examples:**

```
feature/42-user-authentication
fix/87-login-redirect-loop
docs/update-api-readme
refactor/14-extract-auth-service
test/add-unit-tests-for-auth
chore/upgrade-dependencies
```

### Prefixes

| Prefix      | Use For                                                  |
| ----------- | -------------------------------------------------------- |
| `feature/`  | New features or enhancements                             |
| `fix/`      | Bug fixes, corrections, broken behavior                  |
| `docs/`     | Documentation changes only                               |
| `refactor/` | Code restructuring with no behavior change               |
| `test/`     | Adding or modifying tests only                           |
| `chore/`    | Dependency updates, config changes, tooling, maintenance |
| `style/`    | Formatting, whitespace, semicolons — no logic change     |
| `perf/`     | Performance improvements                                 |
| `ci/`       | CI/CD configuration changes                              |

> [!note]
> `revert` is a valid Conventional Commits type but does not have a corresponding branch prefix — reverts are typically committed directly on an existing branch rather than a dedicated one. See [[conventional-commits]] for usage.

> [!tip] When There Is No Issue Number
> Not every branch needs a corresponding issue. For small changes, the short description alone is sufficient — e.g. `docs/update-readme`. For anything substantial, opening an issue first is good practice as it creates a record of the intent and discussion before the work begins.

> [!note] Commit Message Prefixes
> Branch prefixes align intentionally with Conventional Commits type conventions — `fix/` branches typically contain `fix:` commits, `feature/` branches typically contain `feat:` commits, and so on. See [[conventional-commits]] for the full commit message convention.

---

## Merge Strategies

When merging a pull request on GitHub, three strategies are available. The right choice depends on the nature of the branch and whether its commit history is worth preserving.

### Squash and Merge (Recommended Default)

Collapses all commits from the branch into a single commit on `main`. The squashed commit message should follow the Conventional Commits format.

**Best for:** Most feature and fix branches, especially when branch commits are informal WIP messages that do not add value to `main`'s history.

```
Before:                          After merge to main:
feature/42-user-auth             main
├── wip: start auth              └── feat(auth): add user authentication (#42)
├── wip: add tests
└── fix typo
```

> [!tip]
> Configure GitHub to default to squash and merge in `Repository Settings → General → Pull Requests → Allow squash merging` and deselect the other options if you want to enforce it across the repo.

---

### Merge Commit

Creates a merge commit on `main` that preserves the full branch history. All individual commits from the branch remain visible in `git log`.

**Best for:** Long-running branches with well-structured, meaningful commit histories that are worth preserving — e.g. a significant feature where the incremental commits tell a useful story.

```
Before:                          After merge to main:
feature/auth                     main
├── feat: add auth model    ──►  ├── Merge pull request #42
├── feat: add auth routes        ├── feat: add auth routes
└── test: add auth tests         ├── feat: add auth model
                                 └── test: add auth tests
```

> [!warning]
> On active repos, frequent merge commits accumulate quickly and make `git log` difficult to read. Use squash and merge as the default and reserve merge commits for branches where history genuinely matters.

---

### Rebase and Merge

Replays each commit from the branch onto `main` individually, without creating a merge commit. Produces a clean linear history.

**Best for:** When you want linear history without a merge commit and your branch commits are already clean and well-structured.

> [!warning] Rewrites Commit SHAs
> Rebase and merge rewrites the SHA of every commit from the branch. This is generally fine for the GitHub Flow model where branches are deleted after merge, but can cause confusion if someone else is working from the same branch.

---

## Branch Protection (GitHub)

For any shared or professional repository, configure branch protection rules on `main` to prevent accidental direct pushes and enforce review.

`Repository Settings → Branches → Add branch protection rule`

**Recommended rules for `main`:**

| Rule                                                             | Recommended Setting         |
| ---------------------------------------------------------------- | --------------------------- |
| Require a pull request before merging                            | Enabled                     |
| Require approvals                                                | 1 (solo projects: optional) |
| Dismiss stale pull request approvals when new commits are pushed | Enabled                     |
| Require status checks to pass before merging                     | Enabled if CI is configured |
| Require branches to be up to date before merging                 | Enabled                     |
| Do not allow bypassing the above settings                        | Enabled                     |
| Allow force pushes                                               | Disabled                    |
| Allow deletions                                                  | Disabled                    |

> [!tip] Solo Projects
> Even for solo work, requiring a pull request before merging to `main` enforces the habit of reviewing your own changes before they land. It also keeps your portfolio repos looking professionally managed.

---

## Quick Reference

| Scenario                  | Action                                                                          |
| ------------------------- | ------------------------------------------------------------------------------- |
| Starting new work         | `git switch -c feature/<issue>-<description>`                                   |
| Keeping branch up to date | `git fetch && git rebase origin/main`                                           |
| Ready to merge            | Open PR → squash and merge → delete branch                                      |
| Urgent production fix     | `git switch -c fix/<issue>-<description>` from `main` → expedited PR            |
| Branch has conflicts      | `git fetch && git rebase origin/main` → resolve → `git push --force-with-lease` |

---

_Related: [[git-reference]] · [[conventional-commits]] · [[pr-conventions]] · [[git-github-setup]]_
