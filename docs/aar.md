# After Action Review — repo-standards v1.0.1

**Date:** 2026-04-21
**Scope:** Full project — from initial setup through v1.0.1 npm publish
**Participants:** Solo

---

## What Was Planned

Three milestones defined upfront in `docs/development-plan.md`:

**Milestone 0 — Project Setup**
Repository configuration, local development environment, CI workflow, planning documentation, and community health files. Project ready for implementation before a line of feature code was written.

**Milestone 1 — Core Implementation**
Four implementation issues, each developed via TDD:

- `#17` — GitHub Contents API client (`src/github.js`)
- `#18` — File writer (`src/writer.js`)
- `#19` — CLI orchestrator (`src/setup.js`)
- `#12` — `components.json` bundle manifest

All bundles fetchable and installable end-to-end on completion.

**Milestone 2 — Release**

- `#20` — `bin` field and shebang for `npx` execution
- `#21` — Publish to npm as `repo-standards@1.0.0`

---

## What Actually Happened

Milestone 0 delivered as planned.

Milestone 1 largely delivered, but with significant divergence:

- **GitHub API bugs surfaced post-merge** — URL encoding (`#28`) and large file handling (`#29`) were not caught during the original implementation of `#17`. Required a dedicated fix PR after `#17` had already merged.
- **Bundle content files were untracked scope** — `components.json` was authored (`#12`) but the actual files it referenced were never tracked as implementation work. The gap was identified before e2e testing, not by it. Required opening `#32` mid-milestone.
- **`environment-variables.md` removed from scope** — identified during bundle content review as too stack-specific. Removed from `components.json` and deleted.
- **e2e smoke test added** — not planned. Added in `#34` to validate the full install flow against the real GitHub API and filesystem.

Milestone 2 delivered with one notable pre-publish fix and one post-publish cleanup:

- **Entry point not invoked** — `setup.js` exported `run()` but never called it. Found during manual local testing before `npm publish` ran. The git tag `v1.0.0` preceded the fix; the published package included it. Fixed in `#39`.
- **Patch release 1.0.1** — stale `README.md` content and missing npm keywords addressed post-publish. Required a second publish cycle (`#40`, `#41`).

---

## Why the Difference

**GitHub API bugs not caught in original implementation**
The unit tests for `#17` used mocked `fetch` responses and did not exercise real API behavior. URL encoding and large file edge cases were outside the mock surface. The bugs were latent until real API calls were made during integration testing.

**Bundle content files were invisible scope**
The development plan described the CLI fetching bundles from the repo, but the work of populating those paths was never translated into a tracked issue. `components.json` was treated as complete once the manifest schema was defined — without verifying that the referenced paths existed. A missing acceptance criterion ("all paths in `components.json` resolve successfully") would have caught this before `#19` closed.

**Entry point not invoked**
The acceptance criteria for `#19` covered the exported functions but not the executable behavior of the file. Unit tests import `setup.js` as a module — they never exercise it as a CLI entry point. The gap between module behavior and executable behavior was not part of the test strategy or definition of done.

**`environment-variables.md` scope drift**
The dev-standards bundle was defined early without evaluating each doc against the tool's intended consumer. The file contained framework-specific content incompatible with a generic tool. The evaluation should have happened at bundle-definition time, not after the files were committed.

**README stale post-publish**
The README was not audited against `components.json` before publishing. No pre-publish checklist existed to catch this kind of drift.

---

## Sustains

**TDD discipline held throughout**
Every feature was built RED → GREEN → REFACTOR. Tests were written before implementation on every issue. The test suite caught regressions when bugs were fixed in `#28`/`#29` and remained stable through all subsequent changes.

**Small, focused PRs**
No PR tried to do too much. Each addressed a single issue. CodeRabbit review feedback was actionable, and the focused PR structure made it easy to isolate bugs and review changes.

**CodeRabbit caught real issues**
Automated review surfaced shell script hardening (`set -euo pipefail`, `gh` availability check), stale Obsidian wiki link artifacts in docs, and unhandled promise rejection on the entry point guard — all legitimate issues that warranted fixing.

**e2e testing validated what unit tests could not**
The smoke test in `tests/e2e.mjs` hit the real GitHub API, wrote to a real temp directory, and validated the full install flow end-to-end. Unit tests, however comprehensive, cannot substitute for this.

**`.github/` files serve dual purpose without duplication**
The project's own issue and PR templates are the same files installable via the `github-templates` bundle. One set of files, two purposes — no maintenance burden.

---

## Improvements

**Bundle content must be tracked scope from the start**
Any path in `components.json` that does not exist in the repo at the time of authoring is unfinished work. Acceptance criteria for the bundle manifest issue should include: all referenced paths exist and resolve successfully. This should be a checklist item on the PR.

**Entry point behavior belongs in acceptance criteria**
For any CLI issue, "executing the file runs the intended behavior" is an acceptance criterion, not an assumption. The `#19` issue and PR should have included a manual smoke test step: "running `node src/setup.js` presents the bundle selection prompt." An e2e test or explicit manual check should be part of the definition of done.

**Define a pre-publish checklist**
Before any publish, verify:

- `README.md` accurately reflects `components.json`
- `npm pack` + local install + manual run completes successfully
- Unit tests green
- e2e green

**Evaluate bundle content at definition time**
Each file added to a bundle should be evaluated for generic applicability when the bundle is first defined. A simple question — "would this file be useful to any project regardless of stack?" — would have flagged `environment-variables.md` before it was written and committed.

**Community files duplication is a known tradeoff**
The root-level community files (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, etc.) and the installable templates in `community/` are maintained separately. This is intentional — the installable versions are generic, the project-level versions are specific — but it creates a maintenance surface. Any change to the generic template requires a conscious decision about whether the project-level version should also change. Worth documenting as an explicit convention rather than leaving implicit.

**Conflict UX is a known gap**
Issue `#38` (bulk conflict resolution) was opened after observing the experience of installing all bundles into a repo that already had most files — 30+ individual prompts. The current per-file behavior is technically correct but practically unusable at scale. Should be addressed before the tool is promoted for active use.

---

## Actions

| Action                                                                | Owner            | By When                              |
| --------------------------------------------------------------------- | ---------------- | ------------------------------------ |
| Add "all bundle paths resolve" to bundle manifest acceptance criteria | @scottgilmoredev | Next bundle change                   |
| Add entry point execution to CLI issue acceptance criteria            | @scottgilmoredev | Before next CLI issue                |
| Document pre-publish checklist                                        | @scottgilmoredev | Before next release                  |
| Implement bulk conflict resolution (`#38`)                            | @scottgilmoredev | Before promoting tool for active use |
| Document community files duplication as an explicit convention        | @scottgilmoredev | Next `CONTRIBUTING.md` update        |
