# GitHub Milestones

## Overview

Milestones group related issues and pull requests around a shared goal — a feature release, a sprint, a project phase. They provide a progress view showing how many open and closed issues remain, making them useful for both planning and stakeholder communication.

For linking issues to milestones and the full issue workflow see [github-issues](github-issues.md). For roadmap planning see milestones-and-roadmap.

---

## Creating Milestones

### Via GitHub UI

1. Go to the repository → **Issues** → **Milestones**
2. Click **New milestone**
3. Enter:
   - **Title** — a clear, descriptive name (e.g. `v1.0.0`, `Phase 2 — Authentication`, `Sprint 4`)
   - **Due date** — optional but recommended for time-boxed work
   - **Description** — brief summary of the goal this milestone represents
4. Click **Create milestone**

### Via GitHub CLI

```bash
# Create a milestone
gh api \
  --method POST \
  repos/<username>/<repo>/milestones \
  -f title="<title>" \
  -f description="<description>" \
  -f due_on="<YYYY-MM-DDT00:00:00Z>"

# List all milestones
gh api repos/<username>/<repo>/milestones

# View a specific milestone
gh api repos/<username>/<repo>/milestones/<milestone-number>

# Close a milestone
gh api \
  --method PATCH \
  repos/<username>/<repo>/milestones/<milestone-number> \
  -f state="closed"

# Delete a milestone
gh api \
  --method DELETE \
  repos/<username>/<repo>/milestones/<milestone-number>
```

> [!note]
> The GitHub CLI does not have a dedicated `gh milestone` command — milestone operations use `gh api` to call the REST API directly.

> [!tip] gh-milestone Extension
> The `gh-milestone` extension provides a cleaner interface for milestone management than raw `gh api` calls:
>
> ```bash
> # Install
> gh extension install valeriobelli/gh-milestone
>
> # Create a milestone
> gh milestone create --title "v1.0.0" --description "<description>" --due-date 2026-06-01
>
> # List milestones
> gh milestone list
>
> # Edit a milestone
> gh milestone edit <milestone-number> --title "v1.1.0"
> ```

---

## Milestone Conventions

### Naming

Use consistent naming that makes the milestone's scope immediately clear:

| Type              | Format                      | Example                    |
| ----------------- | --------------------------- | -------------------------- |
| Versioned release | `v<MAJOR>.<MINOR>.<PATCH>`  | `v1.0.0`                   |
| Project phase     | `Phase <n> — <description>` | `Phase 2 — Authentication` |
| Sprint            | `Sprint <n>`                | `Sprint 4`                 |
| Time-boxed        | `<Month> <Year>`            | `March 2026`               |

### Due Dates

Set due dates when the milestone represents a time-boxed deliverable. Leave the due date blank for open-ended phases where completion is goal-driven rather than date-driven.

### Descriptions

Write the description as a single sentence stating the goal:

```
Deliver a working authentication system with login, logout, and password reset.
```

---

## Linking Issues and PRs

Issues and PRs are linked to a milestone via the **Milestone** field in the GitHub sidebar — covered in detail in [github-pr-sidebar](github-pr-sidebar.md).

Via CLI:

```bash
# Assign a milestone to an issue
gh issue edit <issue-number> --milestone "<milestone-title>"

# Assign a milestone to a PR
gh pr edit <pr-number> --milestone "<milestone-title>"

# List issues for a specific milestone
gh issue list --milestone "<milestone-title>"

# List PRs for a specific milestone
gh pr list --milestone "<milestone-title>"
```

> [!tip]
> Every issue and PR should be linked to a milestone if one exists for the work. This keeps milestone progress accurate and makes the roadmap meaningful.

---

## Tracking Progress

Milestone progress is visible on the **Milestones** page (`Issues → Milestones`). GitHub shows:

- Percentage complete — based on closed vs open issues
- Number of open and closed issues
- Due date and time remaining

> [!tip]
> A milestone at 100% with no open issues is not automatically closed — close it manually when the work is shipped to keep the milestones list clean.

---

## Closing a Milestone

When all issues are resolved and the work is shipped:

1. Go to **Issues** → **Milestones**
2. Click **Close** next to the milestone

Or via CLI:

```bash
gh api \
  --method PATCH \
  repos/<username>/<repo>/milestones/<milestone-number> \
  -f state="closed"
```

> [!note]
> Closing a milestone does not close its issues. Issues must be closed individually or via PR merge with closing keywords — see [github-issues](github-issues.md).

---

## Milestone vs Label vs Project

These three tools overlap in purpose and are easy to conflate:

| Tool          | Purpose                                      | Scope                                             |
| ------------- | -------------------------------------------- | ------------------------------------------------- |
| **Milestone** | Groups work around a shared delivery goal    | Time-bound or goal-bound set of issues            |
| **Label**     | Categorizes the type or priority of an issue | Individual issue or PR                            |
| **Project**   | Tracks workflow state across issues and PRs  | Board or table view across the entire repo or org |

Use all three together — a label describes what an issue is, a milestone describes when and why it is being worked on, and a project board tracks where it is in the workflow.

---

## Out of Scope

The following topics were intentionally excluded and may be added in a future revision:

- **GitHub Projects** — Kanban/table views for tracking workflow state across issues
- **Cross-repository milestones** — organization-level milestone tracking across multiple repos

---

_Related: [github-issues](github-issues.md) · [github-labels](github-labels.md) · [github-pr-sidebar](github-pr-sidebar.md) · milestones-and-roadmap · project-setup-checklist_
