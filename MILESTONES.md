# Milestones — repo-standards

This document mirrors the milestones defined in GitHub and serves as a
planning reference. Each milestone is created in GitHub and linked to the
issues and PRs that implement it.

For full project background, architecture decisions, and scope see
[Development Plan](docs/development-plan.md).

---

## Milestone 0 — Project Setup

**Goal:** Complete project planning, documentation, repository configuration,
and local environment setup. Project ready for implementation.

**Planned issues:**
- Draft development plan
- Draft user stories
- Write README
- Initialize CHANGELOG
- Configure GitHub repository — branch protection, labels, milestones
- Initialize npm package
- Add .node-version and .gitignore
- Configure ESLint and Prettier
- Configure Husky, lint-staged, and commitlint
- Configure Vitest
- Add CI workflow
- Author components.json

---

## Milestone 1 — Core Implementation

**Goal:** `setup.js` built incrementally via TDD. All bundles fetchable
and installable end-to-end.

**Planned issues:**
- Select and install documentation bundles (user story)
- Understand what was installed (user story)
- Handle file conflicts safely (user story)
- Authenticate to avoid rate limiting (user story)
- Implement GitHub Contents API client
- Implement file writer
- Implement setup.js CLI

---

## Milestone 2 — Release

**Goal:** Package prepared, versioned, and published to npm.

**Planned issues:**
- Configure package for npx execution
- Publish to npm

---

## Notes

- This document should always reflect the milestones defined in GitHub
- Use it for planning and reference — use GitHub milestones for execution
  tracking
- See the [Development Plan](docs/development-plan.md) for architecture
  decisions, scope boundaries, and open questions
