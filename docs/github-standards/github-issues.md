# GitHub Issues

## Overview

Issues are the primary unit of work tracking in GitHub. They capture bugs, feature requests, tasks, and technical debt — and serve as the connective tissue between planning (milestones, roadmaps) and execution (branches, PRs, commits).

For issue templates see [[issue-templates]]. For milestone management see [[github-milestones]]. For label management see [[github-labels]]. For the PR sidebar and linking see [[github-pr-sidebar]].

---

## Creating Issues

### Via GitHub UI

1. Go to the repository → **Issues** → **New issue**
2. Select the appropriate template — see `[[issue-templates]]`
3. Fill in the title, body, and sidebar fields
4. Click **Submit new issue**

### Via GitHub CLI

```bash
# Create an issue interactively
gh issue create

# Create an issue using a specific template
gh issue create --template "bug.md"

# Create an issue with title and template
gh issue create --title "<title>" --template "bug.md"

# Create an issue with all fields
gh issue create \
  --title "<title>" \
  --body "<body>" \
  --label "<label>" \
  --milestone "<milestone-title>" \
  --assignee "<username>"

# Create and assign to yourself
gh issue create --title "<title>" --assignee "@me"

# For non-interactive issue creation with a full body (recommended for scripting),
# use --body instead of --template and provide the formatted content directly.
# This is the approach used when creating issues in bulk from a script or plan.
gh issue create \
  --title "<title>" \
  --body "## Summary

  <summary>

  ## Motivation

  <motivation>

  ## Proposed Solution

  <proposed-solution>

  ## Alternatives Considered

  <alternatives>

  ## Acceptance Criteria

  - [ ] ...
  - [ ] ...
  ## Additional Context

  <context>" \
    --label "feature" \
    --milestone "<milestone-title>" \
    --assignee "@me"
```

---

## Writing Good Issues

A well-written issue reduces the back-and-forth needed before work can begin and makes the project history more useful over time.

**Title**

The title should be specific and scannable. It should make the issue's scope clear without opening it.

```
✓  Login form does not validate email format
✓  Add rate limiting to /sync endpoint
✓  Update README installation steps for Node 20

✗  Bug with login
✗  Improve API
✗  Docs
```

**Body**

Use the appropriate issue template — it structures the body for you. See `[[issue-templates]]` for the full template reference. If writing without a template, include at minimum:

- What the issue is
- Why it matters
- Enough context for someone else to act on it

**Scope**

One issue per concern. If an issue requires work across multiple unrelated areas, split it. Issues that are too broad become difficult to estimate, assign, and close cleanly.

---

## Issue Titles and Conventional Commits

Issue titles do not follow the Conventional Commits format — that convention applies to commit messages and PR titles. Issue titles should be plain, descriptive sentences written in the imperative mood:

```
✓  Add password reset flow
✓  Fix null pointer on user logout
✓  Update API documentation for v2 endpoints

✗  feat(auth): add password reset flow   ← commit format, not issue format
```

---

## Writing a Feature Request

A feature request is most useful when it focuses on the **problem** rather than the solution. Jumping straight to implementation details constrains the solution space before the problem is fully understood — and often leads to building the wrong thing correctly.

**Lead with the problem:**

Describe the situation that motivates the request. What are you trying to accomplish? What is getting in the way? What does the current experience force you to do instead?

```
✓  When I have more than 50 products to update, I have to edit each one
    individually in Squarespace's admin — a process that takes several hours
    and is prone to errors.

✗  Add a bulk edit feature to the product management page.
```

The first version opens up multiple possible solutions. The second has already decided on one.

**Separate the problem from the proposed solution:**

It is fine to include a proposed solution — it communicates intent and gives implementors a starting point. But frame it explicitly as a proposal, not a requirement:

```markdown
## Proposed Solution

One approach would be to allow users to select multiple products and apply
a price change as a percentage or fixed amount. This is a suggestion —
other implementations that solve the core problem are welcome.
```

**Define what success looks like:**

Acceptance criteria turn a vague request into something actionable and testable. A feature request without them is a wish — one with them is a specification:

```markdown
## Acceptance Criteria

- [ ] I can update prices for 50+ products without visiting each individually
- [ ] Changes are reflected in Squarespace within 2 minutes of submission
- [ ] I receive confirmation of how many products were updated successfully
```

**Be specific about scale and context:**

Vague scope leads to over-engineering or under-building. Include concrete numbers and context where relevant:

```
✓  I manage approximately 200 products across 3 store pages.
✗  I have a lot of products.
```

> [!tip]
> If you find yourself writing a feature request that is several paragraphs long and touches multiple workflows, consider splitting it into smaller, more focused requests. Each one should represent a single user need that can be built, reviewed, and shipped independently.

---

## Closing Keywords

GitHub automatically closes a linked issue when a PR is merged if the PR body or a commit message contains a closing keyword followed by the issue number.

**Supported keywords:**

```
Closes #<issue-number>
Fixes #<issue-number>
Resolves #<issue-number>
```

All three are equivalent. `Closes` is the most conventional for general use. `Fixes` is semantically appropriate for bug fixes.

**In a PR body:**

```markdown
## Related Issues/Milestones

- Closes #42
- Closes #87
```

**In a commit message:**

```
feat(auth): add password reset flow

Closes #42
```

> [!tip]
> Use closing keywords in the PR body rather than commit messages when using squash and merge — the squash commit message is generated from the PR title, so keywords in individual commits may not be preserved. Putting them in the PR body ensures reliable auto-close on merge.

> [!note]
> Closing keywords only work when the PR targets the repository's default branch (`main`). PRs merging into other branches will not auto-close the linked issue.

---

## Linking Issues to PRs

Beyond closing keywords, issues and PRs can be explicitly linked via the **Development** field in the GitHub PR sidebar. This creates a visible connection between the issue and the PR without necessarily closing the issue on merge.

See `[[github-pr-sidebar#Development]]` for the full linking workflow.

---

## Managing Issues

### Via GitHub UI

Issues are managed from the **Issues** tab. Use the filter bar to narrow by label, milestone, assignee, or state.

### Via GitHub CLI

```bash
# List open issues
gh issue list

# List issues by label
gh issue list --label "<label>"

# List issues by milestone
gh issue list --milestone "<milestone-title>"

# List issues assigned to you
gh issue list --assignee "@me"

# List closed issues
gh issue list --state closed

# View an issue
gh issue view <issue-number>

# View in browser
gh issue view <issue-number> --web

# Edit an issue — add label, milestone, assignee
gh issue edit <issue-number> --add-label "<label>"
gh issue edit <issue-number> --milestone "<milestone-title>"
gh issue edit <issue-number> --add-assignee "<username>"

# Remove a label or assignee
gh issue edit <issue-number> --remove-label "<label>"
gh issue edit <issue-number> --remove-assignee "<username>"

# Comment on an issue
gh issue comment <issue-number> --body "<comment>"

# Close an issue
gh issue close <issue-number>

# Close with a comment
gh issue close <issue-number> --comment "<comment>"

# Reopen an issue
gh issue reopen <issue-number>

# Transfer to another repository
gh issue transfer <issue-number> <destination-repo>
```

---

## Issue Numbers in Branches and Commits

Issue numbers should appear in branch names and commit footers to create a traceable thread from planning to implementation.

**Branch name:**

```
feature/42-user-authentication
fix/87-login-redirect-loop
```

**Commit footer:**

```
feat(auth): add password reset flow

Closes #42
```

**PR title:**

```
feat(auth): add password reset flow (#42)
```

This pattern means any issue number can be traced forward to its branch, commits, and PR — and any PR can be traced back to the issue that motivated it.

---

## Issue Triage

When new issues are created, apply the following before assigning or scheduling:

- [ ] Correct label applied — see `[[github-labels]]`
- [ ] Linked to the appropriate milestone if one exists — see `[[github-milestones]]`
- [ ] Assigned to a contributor if work is imminent
- [ ] Duplicate checked — close with a reference to the original if one exists
- [ ] Scope is clear — comment requesting clarification if not

> [!tip]
> Use `gh issue list --no-assignee` to surface unassigned open issues that may need triage.

---

## Out of Scope

The following topics were intentionally excluded and may be added in a future revision:

- **GitHub Projects integration** — tracking issue workflow state on a Kanban or table board
- **Issue pinning** — pinning important issues to the top of the issues list
- **Saved replies** — GitHub's templated response feature for common issue responses

---

_Related: [[issue-templates]] · [[github-labels]] · [[github-milestones]] · [[github-pr-sidebar]] · [[branching-strategy]] · [[conventional-commits]] · [[pr-conventions]]_
