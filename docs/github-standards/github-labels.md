# GitHub Labels

## Overview

Labels categorize issues and pull requests, making them filterable, searchable, and easier to triage. This document covers creating and managing labels, a recommended default label set, and how to apply that set to a new repository via script.

For label automation via GitHub Actions see [[github-actions]].

---

## Label Anatomy

Each label has three properties:

| Property        | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| **Name**        | The label identifier — displayed on issues and PRs             |
| **Color**       | A hex color — use consistently by category for visual scanning |
| **Description** | A short explanation of when to apply the label                 |

---

## Recommended Default Label Set

Labels are organized into three tiers — type, priority, and status. Using a consistent color family per tier makes label category identifiable at a glance without reading the name.

### Type Labels

Aligned with branch prefix and Conventional Commits conventions — see [[branching-strategy]] and [[conventional-commits]].

| Label        | Color     | Description                                      |
| ------------ | --------- | ------------------------------------------------ |
| `feat`       | `#0075ca` | New feature or enhancement                       |
| `fix`        | `#d73a4a` | Bug fix, correction, or broken behavior          |
| `refactor`   | `#e4e669` | Code restructuring with no behavior change       |
| `test`       | `#0e8a16` | Adding or modifying tests only                   |
| `chore`      | `#e8e8e8` | Dependency updates, config, tooling, maintenance |
| `docs`       | `#0075ca` | Documentation changes only                       |
| `style`      | `#cfd3d7` | Formatting, whitespace — no logic change         |
| `perf`       | `#f9d0c4` | Performance improvements                         |
| `ci`         | `#1d76db` | CI/CD configuration changes                      |
| `user-story` | `#5319e7` | Feature described from the user's perspective    |

### Priority Labels

| Label              | Color     | Description                                    |
| ------------------ | --------- | ---------------------------------------------- |
| `priority: high`   | `#b60205` | Urgent — blocks progress or affects many users |
| `priority: medium` | `#fbca04` | Important but not blocking                     |
| `priority: low`    | `#0e8a16` | Nice to have — address when bandwidth allows   |

Most issues do not need a priority label. Milestone and project context communicate priority sufficiently. Reserve priority labels for cases where the ordering is genuinely non-obvious or needs explicit communication.

| Label              | When to use                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `priority: high`   | Blocking other work, time-sensitive, or significant impact if unresolved. Needs attention now. |
| `priority: medium` | Order relative to other work needs to be communicated. Not urgent but not deferrable.          |
| `priority: low`    | Explicitly deprioritized. Worth keeping open but not scheduled.                                |

### Status Labels

| Label                  | Color     | Description                                     |
| ---------------------- | --------- | ----------------------------------------------- |
| `status: blocked`      | `#d93f0b` | Cannot proceed — waiting on external dependency |
| `status: in progress`  | `#0075ca` | Actively being worked on                        |
| `status: needs review` | `#e4e669` | Ready for review                                |
| `status: wont fix`     | `#ffffff` | Acknowledged but will not be addressed          |

---

## Managing Labels

### Via GitHub UI

**Create a label:**

1. Go to the repository → **Issues** → **Labels**
2. Click **New label**
3. Enter name, color, and description
4. Click **Create label**

**Edit a label:**

1. Go to **Issues** → **Labels**
2. Click **Edit** next to the label
3. Update fields and click **Save changes**

**Delete a label:**

1. Go to **Issues** → **Labels**
2. Click **Delete** next to the label

> [!warning]
> Deleting a label removes it from all issues and PRs it was applied to. This cannot be undone.

### Via GitHub CLI

```bash
# Create a label
gh label create "<name>" --color "<hex>" --description "<description>"

# Example
gh label create "feat" --color "0075ca" --description "New feature or enhancement"

# List all labels in the current repo
gh label list

# Edit a label
gh label edit "<name>" --color "<hex>" --description "<description>"

# Delete a label
gh label delete "<name>"

# Clone labels from another repository
gh label clone <username>/<source-repo>
```

> [!tip] Cloning Labels
> `gh label clone` copies all labels from an existing repository into the current one. Once you have a repo set up with your default label set, use this command to replicate it instantly on new repos rather than recreating labels manually.

---

## Setup Script

The following script creates the full recommended label set in the current repository using the GitHub CLI. Run it from within the repo directory after `gh auth login`.

```bash
#!/bin/bash
# create-labels.sh
# Creates the recommended default label set in the current repository.
# Usage: bash create-labels.sh

set -e

echo "Creating type labels..."
gh label create "feat"             --color "0075ca" --description "New feature or enhancement" --force
gh label create "fix"              --color "d73a4a" --description "Bug fix, correction, or broken behavior" --force
gh label create "refactor"         --color "e4e669" --description "Code restructuring with no behavior change" --force
gh label create "test"             --color "0e8a16" --description "Adding or modifying tests only" --force
gh label create "chore"            --color "e8e8e8" --description "Dependency updates, config, tooling, maintenance" --force
gh label create "docs"             --color "0075ca" --description "Documentation changes only" --force
gh label create "style"            --color "cfd3d7" --description "Formatting, whitespace — no logic change" --force
gh label create "perf"             --color "f9d0c4" --description "Performance improvements" --force
gh label create "ci"               --color "1d76db" --description "CI/CD configuration changes" --force
gh label create "user-story"       --color "5319e7" --description "Feature described from the user's perspective" --force

echo "Creating priority labels..."
gh label create "priority: high"   --color "b60205" --description "Urgent — blocks progress or affects many users" --force
gh label create "priority: medium" --color "fbca04" --description "Important but not blocking" --force
gh label create "priority: low"    --color "0e8a16" --description "Nice to have — address when bandwidth allows" --force

echo "Creating status labels..."
gh label create "status: blocked"       --color "d93f0b" --description "Cannot proceed — waiting on external dependency" --force
gh label create "status: in progress"   --color "0075ca" --description "Actively being worked on" --force
gh label create "status: needs review"  --color "e4e669" --description "Ready for review" --force
gh label create "status: wont fix"      --color "ffffff" --description "Acknowledged but will not be addressed" --force

echo "✓ Labels created successfully."
```

> [!tip]
> The `--force` flag updates the label if it already exists rather than throwing an error. This makes the script safe to re-run on repos that already have some labels.

> [!note]
> Save this script to your `community/` templates directory so it is available for every new project. Run it immediately after creating a new repository.

---

## Applying Labels

Labels can be applied to issues and PRs via the GitHub UI sidebar, or via the CLI:

```bash
# Add a label to an issue
gh issue edit <issue-number> --add-label "<label>"

# Add a label to a PR
gh pr edit <pr-number> --add-label "<label>"

# Remove a label
gh issue edit <issue-number> --remove-label "<label>"

# Create an issue with a label
gh issue create --label "<label>"

# Create a PR with a label
gh pr create --label "<label>"
```

> [!tip] Multiple Labels
> Pass `--add-label` multiple times or comma-separate values to apply multiple labels at once:
>
> ```bash
> gh issue edit 42 --add-label "feature" --add-label "priority: high"
> ```

---

## Maintaining Labels

- When adding a new branch prefix or commit type to your conventions, add a corresponding type label and update `create-labels.sh`
- Use `gh label clone` when setting up new repositories to replicate your standard set instantly
- Avoid creating one-off labels for individual issues — prefer applying existing labels and adding context in the issue body

---

_Related: [[github-issues]] · [[github-milestones]] · [[github-pr-sidebar]] · [[branching-strategy]] · [[conventional-commits]] · [[github-actions]]_
