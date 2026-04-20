# GitHub PR Sidebar

## Overview

The GitHub PR sidebar contains fields that connect a pull request to the broader project context — who is involved, what category the work falls into, which project it belongs to, and what issue it resolves. Filling these out consistently makes PRs easier to triage, filter, and trace through project history.

For PR title and description conventions see `[[pr-conventions]]`. For label management see `[[github-labels]]`. For milestone management see `[[github-milestones]]`. For issue linking see `[[github-issues]]`.

---

## Sidebar Fields

### Reviewers

Designates who should review the PR before it can be merged. GitHub notifies assigned reviewers and tracks their review status.

**When to assign:**

- Assign at least one reviewer before marking a PR ready for review
- On solo projects, self-review is still valuable — use the PR checklist as a forcing function even without a formal reviewer

**Via GitHub UI:** Click the gear icon next to **Reviewers** and search for a collaborator.

**Via CLI:**

```bash
# Add a reviewer when creating a PR
gh pr create --reviewer <username>

# Add a reviewer to an existing PR
gh pr edit <pr-number> --add-reviewer <username>

# Remove a reviewer
gh pr edit <pr-number> --remove-reviewer <username>

# Request review from a team
gh pr edit <pr-number> --add-reviewer <org>/<team-name>
```

> [!tip] Re-requesting Review
> After addressing feedback, re-request review from the original reviewer — click the refresh icon next to their name in the sidebar, or via CLI:
>
> ```bash
> gh pr edit <pr-number> --add-reviewer <username>
> ```
>
> See `[[pr-conventions#Re-requesting Review]]` for the full workflow.

---

### Assignees

Designates who is responsible for the PR — typically the author. Unlike reviewers, assignees are not asked to review; they are identified as the owner of the work.

**When to assign:**

- Assign yourself as the author when opening a PR
- Reassign if ownership of the PR changes mid-review

**Via CLI:**

```bash
# Assign yourself when creating a PR
gh pr create --assignee "@me"

# Add an assignee to an existing PR
gh pr edit <pr-number> --add-assignee <username>

# Remove an assignee
gh pr edit <pr-number> --remove-assignee <username>
```

---

### Labels

Categorizes the PR by type, priority, or status — the same label set used on issues. Applying labels to PRs makes them filterable and gives reviewers immediate context about the nature of the change.

**When to apply:**

- Apply the type label matching the branch prefix — e.g. a `feature/` branch gets the `feature` label
- Apply a priority label if the PR is blocking other work
- Apply `status: needs review` when ready for review

**Via CLI:**

```bash
# Add a label when creating a PR
gh pr create --label "<label>"

# Add a label to an existing PR
gh pr edit <pr-number> --add-label "<label>"

# Remove a label
gh pr edit <pr-number> --remove-label "<label>"
```

> [!note]
> Label conventions and the recommended default label set are covered in `[[github-labels]]`.

---

### Projects

Links the PR to a GitHub Project board. This allows the PR to appear in project views and have its workflow state tracked (e.g. In Progress, In Review, Done).

**When to assign:**

- Assign to the relevant project if your repository uses GitHub Projects for workflow tracking
- Leave blank for repositories that track work through milestones and issues only

**Via CLI:**

```bash
# Add a PR to a project
gh pr edit <pr-number> --add-project "<project-name>"

# Remove from a project
gh pr edit <pr-number> --remove-project "<project-name>"
```

> [!note]
> GitHub Projects setup and board configuration are out of scope for this document. This field is documented here for completeness.

---

### Milestone

Links the PR to a milestone, contributing to milestone progress tracking. When the PR is merged, it counts toward the milestone's closed items.

**When to assign:**

- Assign the same milestone as the issue the PR resolves
- If no linked issue exists, assign the milestone that represents the release or phase this PR contributes to

**Via CLI:**

```bash
# Set a milestone when creating a PR
gh pr create --milestone "<milestone-title>"

# Set a milestone on an existing PR
gh pr edit <pr-number> --milestone "<milestone-title>"

# Remove a milestone
gh pr edit <pr-number> --remove-milestone
```

> [!note]
> Milestone conventions and management are covered in `[[github-milestones]]`.

---

### Development

The Development field explicitly links a PR to one or more issues. This is distinct from closing keywords in the PR body — a Development link creates a visible, navigable connection in the GitHub UI between the PR and the issue regardless of whether the issue will be auto-closed on merge.

**When to use:**

- Link to the issue that motivated the PR in all cases where one exists
- Use closing keywords (`Closes #<n>`) in the PR body to auto-close the issue on merge — see `[[github-issues#Closing Keywords]]`
- Use the Development field without a closing keyword when the PR partially addresses an issue but should not close it

**Via GitHub UI:**

1. In the PR sidebar, click the gear icon next to **Development**
2. Search for and select the issue to link

> [!note]
> The Development field cannot be set via the GitHub CLI directly. Use closing keywords in the PR body as the CLI equivalent — they create the same link and trigger auto-close on merge.

**Combining both:**

```markdown
## Related Issues/Milestones

- Closes #42
- Relates to #38
```

`Closes #42` — auto-closes issue 42 on merge and creates a Development link
`Relates to #38` — does not close issue 38 but provides context in the PR body

---

## PR Sidebar Checklist

Before marking a PR ready for review, confirm the following sidebar fields are populated:

- [ ] **Reviewers** — at least one reviewer assigned
- [ ] **Assignees** — yourself assigned as author
- [ ] **Labels** — type label applied, priority label if blocking
- [ ] **Milestone** — linked to the relevant milestone
- [ ] **Development** — linked to the issue being resolved

> [!tip]
> The sidebar fields complement the PR template checklist — the template covers the body content, the sidebar covers the metadata. Both should be complete before requesting review.

---

## Setting Sidebar Fields via CLI at PR Creation

All sidebar fields can be set in a single `gh pr create` command:

```bash
gh pr create \
  --title "feat(auth): add password reset flow (#42)" \
  --template "feature.md" \
  --reviewer <username> \
  --assignee "@me" \
  --label "feature" \
  --milestone "v1.0.0"
```

> [!note]
> The Development (issue link) field cannot be set via CLI at creation time. Add closing keywords to the PR body template instead — `Closes #42` in the PR description creates the equivalent link.

---

_Related: `[[pr-conventions]]` · `[[github-labels]]` · `[[github-milestones]]` · `[[github-issues]]` · `[[pr-templates]]`_
