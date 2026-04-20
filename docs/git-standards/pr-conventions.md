# PR Conventions

## Overview

This document covers pull request conventions — titles, draft PRs, the template system, review etiquette, GitHub review tools, and CodeRabbit integration. Consistent PR practices make code review faster, history more readable, and collaboration smoother regardless of team size.

For branch naming conventions see [branching-strategy](branching-strategy.md). For commit message conventions see [conventional-commits](conventional-commits.md).

---

## PR Titles

PR titles should follow the Conventional Commits format. When using squash and merge, the PR title becomes the squash commit message on `main` — a well-formed title means a clean, readable commit history without any extra effort at merge time.

**Format:**

```
<type>(<scope>): <description> (#<issue-number>)
```

**Examples:**

```
feat(auth): add password reset flow (#42)
fix(api): resolve null pointer on user logout (#87)
refactor(components): extract button into shared component (#14)
docs: update installation steps in README
chore: upgrade dependencies to latest
```

> [!tip] Description Convention
> PR title descriptions follow the same convention as commit message descriptions — they should complete the sentence "This commit will …". See [conventional-commits](conventional-commits.md).

> [!note] Issue Number
> Include the issue number when one exists. Omit it for changes that do not have a corresponding issue — e.g. small documentation fixes or minor chores.

---

## Draft PRs

A draft PR signals that work is in progress and not yet ready for review. It is useful for sharing early context, getting feedback on direction, or keeping a branch visible without implying it is mergeable.

**When to open a draft PR:**

- The branch is in progress but you want visibility into the work early
- You want feedback on approach before implementation is complete
- The branch is blocked and you want to signal that without closing it

**When to mark ready for review:**

- All checklist items in the template are satisfied
- CI is passing
- You have self-reviewed the diff

**Opening a draft PR via GitHub CLI:**

```bash
gh pr create --draft
```

**Converting a draft to ready for review:**

```bash
gh pr ready
```

> [!tip]
> A draft PR is preferable to a WIP commit on a shared branch. It keeps `main` clean while still making the work visible and discussable.

---

## Template System

PR templates live in `.github/PULL_REQUEST_TEMPLATE/` at the root of the repository. GitHub does not automatically present a template picker — templates are selected via a URL query parameter.

**URL pattern for selecting a template:**

```
https://github.com/<username>/<repo>/compare/main...<branch>?quick_pull=1&template=<template-filename>
```

**Example:**

```
https://github.com/<username>/<repo>/compare/main...feature/42-user-auth?quick_pull=1&template=feature.md
```

> [!tip] Document Template URLs in `pull_request_template.md`
> Add a root-level `pull_request_template.md` at `.github/pull_request_template.md` that lists all available templates with their pre-filled URLs. This file is shown by default when a PR is opened without a template query parameter, acting as a picker and directing contributors to the correct template.

**Repository template structure:**

```
.github/
├── pull_request_template.md         # Default — lists available templates with URLs
└── PULL_REQUEST_TEMPLATE/
    ├── feature.md
    ├── fix.md
    ├── refactor.md
    ├── test.md
    ├── chore.md
    ├── docs.md
    ├── style.md
    ├── perf.md
    └── ci.md
```

### Available Templates

| Template      | Branch Prefix | Use For                                          |
| ------------- | ------------- | ------------------------------------------------ |
| `feature.md`  | `feature/`    | New features or enhancements                     |
| `fix.md`      | `fix/`        | Bug fixes, corrections, broken behavior          |
| `refactor.md` | `refactor/`   | Code restructuring with no behavior change       |
| `test.md`     | `test/`       | Adding or modifying tests only                   |
| `chore.md`    | `chore/`      | Dependency updates, config, tooling, maintenance |
| `docs.md`     | `docs/`       | Documentation changes only                       |
| `style.md`    | `style/`      | Formatting, whitespace — no logic change         |
| `perf.md`     | `perf/`       | Performance improvements                         |
| `ci.md`       | `ci/`         | CI/CD configuration changes                      |

> [!note] Template Files
> Template content and creation instructions are covered in pr-templates.

---

## Review Etiquette

### Author Responsibilities

Before marking a PR ready for review:

- [ ] Self-review the diff — read your own code as a reviewer would
- [ ] Ensure the PR title follows the Conventional Commits format
- [ ] Confirm the correct template was used and all checklist items are satisfied
- [ ] Verify CI is passing
- [ ] Keep the PR focused — one unit of work per PR. If scope has grown, consider splitting

When responding to review feedback:

- Resolve conversations only after the concern has been addressed — not to dismiss
- If you disagree with feedback, discuss it in the thread rather than silently ignoring it
- Leave a comment when pushing changes in response to feedback so reviewers know what changed

### Reviewer Responsibilities

- Review the PR description before the diff — understanding intent makes the code easier to evaluate
- Distinguish between blocking concerns and non-blocking suggestions. Use prefixes to make this clear:
  - `blocking:` — must be addressed before merge
  - `nit:` — minor, non-blocking suggestion
  - `question:` — seeking understanding, not requesting a change
- Approve when the code is good enough to merge — not only when it matches exactly what you would have written
- If requesting changes, be specific about what needs to change and why

> [!tip] Reviewing Your Own PRs
> On solo projects, treat self-review seriously — step away from the code before reviewing, read it as if someone else wrote it, and use the PR checklist as a forcing function. This habit translates directly to professional team settings.

---

## GitHub Review Tools

### Suggesting Changes

Reviewers can propose specific code changes inline that the author can accept with a single click — no back-and-forth required for small corrections.

To suggest a change, click the **+** icon on a diff line, then click the **Insert a suggestion** icon in the comment toolbar:

````
```suggestion
const userId = user.id;
```
````

The author can accept individual suggestions or batch-accept multiple suggestions in a single commit.

> [!tip]
> Use suggestions for small, unambiguous corrections — typos, naming, formatting. For larger changes, a comment explaining the concern is more appropriate than a suggestion.

### Resolving Conversations

Conversations on a PR should be resolved by the **author** after the concern has been addressed — not by the reviewer, and not to dismiss feedback without action. Resolving a conversation signals to the reviewer that their point has been handled and they can re-check.

> [!warning]
> GitHub allows anyone to resolve a conversation. By convention, resolution is the author's responsibility. Reviewers resolving their own threads can obscure whether feedback was actually addressed.

### Re-requesting Review

After pushing changes in response to review feedback, re-request review from the original reviewer:

```bash
gh pr edit <pr-number> --add-reviewer <username>
```

Or via the GitHub UI — click the refresh icon next to the reviewer's name in the **Reviewers** panel.

> [!note]
> Re-requesting review signals that the PR is ready for another pass. Without it, reviewers have no way of knowing the changes have been addressed.

---

## CodeRabbit

CodeRabbit is an AI-powered code review tool that automatically reviews PRs and provides inline feedback, summaries, and suggestions. It operates as a GitHub App and posts comments directly in the PR timeline.

### How it works

When a PR is opened or updated, CodeRabbit automatically:

- Generates a summary of the changes
- Reviews the diff for bugs, logic issues, style inconsistencies, and potential improvements
- Posts inline comments on specific lines where it identifies concerns
- Provides a walkthrough at the PR level summarizing what changed and why

### Interacting with CodeRabbit

CodeRabbit responds to commands posted as PR comments:

| Command                 | Action                                   |
| ----------------------- | ---------------------------------------- |
| `@coderabbitai review`  | Trigger a full review on demand          |
| `@coderabbitai summary` | Regenerate the PR summary                |
| `@coderabbitai resolve` | Mark all CodeRabbit comments as resolved |
| `@coderabbitai help`    | List available commands                  |

> [!tip] Treating CodeRabbit Feedback
> Treat CodeRabbit's comments the same way you would a human reviewer's — evaluate each one, address what is valid, and dismiss what is not applicable. Do not merge with unreviewed CodeRabbit feedback outstanding.

> [!note] Installation
> CodeRabbit is configured per repository via a `.coderabbit.yaml` file at the repo root, or through the CodeRabbit dashboard at [coderabbit.ai](https://coderabbit.ai). The free tier covers public repositories.

---

## PR Size

A PR should represent a single, reviewable unit of work. Large PRs are harder to review thoroughly, more likely to introduce conflicts, and more difficult to revert if something goes wrong.

**Guidelines:**

- Aim for PRs that can be reviewed meaningfully in a single session
- If a feature requires many changes, break it into sequential PRs — each building on the last
- Refactors and feature work should be in separate PRs where possible — mixing them makes the diff harder to reason about
- If a PR has grown beyond its original scope, consider splitting before opening for review

> [!tip]
> If you find yourself writing a long PR description to explain all the things the PR does, that is a signal the PR is doing too much.

---

_Related: [branching-strategy](branching-strategy.md) · [conventional-commits](conventional-commits.md) · pr-templates · git-reference_
