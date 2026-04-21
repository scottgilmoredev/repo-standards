# Postmortem — CLI entry point not invoked

**Date:** 2026-04-21
**Severity:** P3
**Status:** Complete
**Author(s):** Solo

---

## Summary

`src/setup.js` was implemented, tested, and merged in `#19` without ever calling `run()`. The file exported all functions correctly and all unit tests passed, but executing the file as a CLI did nothing. The bug was caught during manual local testing after `npm pack` and before `npm publish`. Fixed in `#39`.

---

## Timeline

| Time  | Event                                                                                  |
| ----- | -------------------------------------------------------------------------------------- |
| Day 1 | `#19` implemented and merged — `setup.js` CLI orchestrator                             |
| Day 2 | `#20` merged — `bin` field and shebang added to configure npx execution                |
| Day 2 | `#21` merged — version bumped to 1.0.0, CHANGELOG updated                              |
| Day 2 | `git tag v1.0.0` created and pushed                                                    |
| Day 2 | Local `npm pack` + install — running `node src/setup.js` produced no output            |
| Day 2 | Root cause identified: `run()` exported but never called                               |
| Day 2 | `#39` opened and merged — entry point guard added, `run()` invoked on direct execution |
| Day 2 | `npm publish` run — published package includes the fix                                 |

---

## Root Cause

The acceptance criteria for `#19` covered the behavior of exported functions (`loadComponents`, `buildChoices`, `fetchBundlePaths`, `writeLockfile`, `run`) but not the executable behavior of the file itself. Unit tests import `setup.js` as a module — they never ask "does running this file do anything?" The gap between module behavior and CLI behavior was not part of the test strategy or definition of done.

---

## Contributing Factors

- No e2e test existed at the time `#19` merged — the e2e test was added in `#34`, after this gap was already present
- The `#20` issue (bin field + shebang) was treated as infrastructure — it configured how the file would be invoked but did not verify that invocation produced the expected behavior
- No pre-publish checklist existed to require a manual smoke test before tagging

---

## Impact

- The bug was caught before `npm publish` ran — no consumer was affected
- The git tag `v1.0.0` points to a commit without the fix; the published `v1.0.0` package includes it (publish used HEAD, not the tag)
- Required an unplanned fix PR during the release phase

---

## Action Items

| Action                                                                             | Owner            | Due                   |
| ---------------------------------------------------------------------------------- | ---------------- | --------------------- |
| Add "running the file produces expected behavior" to CLI issue acceptance criteria | @scottgilmoredev | Before next CLI issue |
| Add pre-publish manual smoke test to release checklist                             | @scottgilmoredev | Before next release   |

---

## Lessons Learned

A CLI that exports functions correctly and passes all unit tests can still do nothing when executed. Executable behavior must be verified as a distinct step — separate from module behavior. For any CLI issue, the definition of done is not complete until someone has run the file and seen the expected output.
