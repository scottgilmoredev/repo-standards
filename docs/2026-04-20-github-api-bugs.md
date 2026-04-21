# Postmortem — GitHub API bugs shipped in initial implementation

**Date:** 2026-04-20
**Severity:** P3
**Status:** Complete
**Author(s):** Solo

---

## Summary

Two bugs in `src/github.js` merged to `main` as part of the initial implementation (`#17`) and required a dedicated fix PR (`#30`) after the fact. Bug 1: path segments were not URL-encoded, causing requests for paths containing special characters to fail. Bug 2: files larger than 1MB returned by the API with `encoding: 'none'` were not detected, causing a `Buffer.from` call on empty content rather than a clear error.

---

## Timeline

| Time  | Event                                                                                                                         |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| Day 1 | `#17` implemented and merged — GitHub Contents API client                                                                     |
| Day 2 | Integration testing exposed URL encoding failure on paths with spaces/special characters                                      |
| Day 2 | Large file edge case identified — API returns `encoding: 'none'` and empty `content` for files >1MB; code did not handle this |
| Day 2 | Issues `#28` and `#29` opened                                                                                                 |
| Day 2 | `#30` opened, reviewed, and merged — both bugs fixed together                                                                 |

---

## Root Cause

Unit tests for `#17` mocked `fetch` with controlled responses that never exercised real API behavior. URL encoding and large file handling are edge cases that only surface against the actual GitHub Contents API. The test surface did not extend to these conditions.

---

## Contributing Factors

- No integration or e2e test existed at the time of `#17` — the e2e test was added later in `#34`
- Acceptance criteria for `#17` did not include testing against real API paths containing special characters or large files

---

## Impact

- Both bugs were caught before any consumer use of the tool
- No published version was affected
- Required an unplanned fix PR, adding scope to Milestone 1

---

## Action Items

| Action                                                                        | Owner            | Due                                  |
| ----------------------------------------------------------------------------- | ---------------- | ------------------------------------ |
| Add e2e test covering real API calls before merging any GitHub client changes | @scottgilmoredev | Ongoing — `tests/e2e.mjs` now exists |
| Include real-path smoke test in acceptance criteria for API client issues     | @scottgilmoredev | Before next API client change        |

---

## Lessons Learned

Mocked unit tests verify logic, not integration. Any module that wraps an external API needs at least one test path that exercises the real API before merge — or explicit acceptance criteria that surface edge cases the mock cannot reach.
