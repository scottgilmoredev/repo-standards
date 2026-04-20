# Semantic Versioning

## Overview

Semantic Versioning (SemVer) is a versioning specification that assigns meaning to version number increments. It provides a shared language for communicating the nature and impact of a release to consumers of your software.

Full specification: [semver.org](https://semver.org)

---

## Format

```
MAJOR.MINOR.PATCH
```

| Segment | When to increment                                      | Example           |
| ------- | ------------------------------------------------------ | ----------------- |
| `MAJOR` | Breaking changes — incompatible with previous versions | `1.0.0` → `2.0.0` |
| `MINOR` | New features — backwards compatible                    | `1.0.0` → `1.1.0` |
| `PATCH` | Bug fixes — backwards compatible                       | `1.0.0` → `1.0.1` |

> [!important] Reset Rules
> When `MAJOR` is incremented, reset `MINOR` and `PATCH` to `0`.
> When `MINOR` is incremented, reset `PATCH` to `0`.
>
> ```
> 1.4.3 → breaking change → 2.0.0
> 1.4.3 → new feature    → 1.5.0
> 1.4.3 → bug fix        → 1.4.4
> ```

---

## Pre-release Versions

Pre-release versions are denoted by appending a hyphen and identifier after the patch version:

```
1.0.0-alpha
1.0.0-alpha.1
1.0.0-beta
1.0.0-beta.2
1.0.0-rc.1        # Release candidate
```

Pre-release versions have lower precedence than the associated normal version — `1.0.0-rc.1` < `1.0.0`.

**Common pre-release identifiers:**

| Identifier | Meaning                                                      |
| ---------- | ------------------------------------------------------------ |
| `alpha`    | Early, unstable — internal testing only                      |
| `beta`     | Feature complete but potentially unstable — external testing |
| `rc`       | Release candidate — final testing before stable release      |

---

## Build Metadata

Build metadata is appended with a `+`:

```
1.0.0+20260313
1.0.0-beta+exp.sha.5114f85
```

Build metadata is ignored when determining version precedence — `1.0.0+build.1` and `1.0.0+build.2` are equivalent in precedence.

---

## Version 0.x.x

A major version of `0` (`0.y.z`) indicates the software is in initial development. Public API should not be considered stable. Anything may change at any time.

```
0.1.0   Initial development
0.4.2   Still unstable — breaking changes possible without major bump
1.0.0   First stable public release
```

> [!tip]
> Stay on `0.x.x` until you are confident the public API is stable enough to commit to. Moving to `1.0.0` is a signal to consumers that they can rely on the API.

---

## What Constitutes a Breaking Change

Understanding what counts as a breaking change is the most important — and sometimes most subjective — part of applying SemVer correctly.

**Clear breaking changes:**

- Removing a public function, method, class, or endpoint
- Renaming a public function, method, or parameter
- Changing the return type or shape of a public function
- Changing required vs optional parameters
- Removing or renaming environment variables the consumer must set

**Not breaking changes:**

- Adding a new optional parameter to an existing function
- Adding a new function, method, or endpoint
- Bug fixes that correct documented behavior
- Internal refactoring with no public API changes
- Performance improvements with identical behavior

> [!warning]
> Fixing a bug that consumers may have been relying on as if it were a feature is technically a patch but practically a breaking change for those consumers. Use judgment — if the fix changes observable behavior that downstream code depends on, consider a minor or major bump with clear release notes.

---

## SemVer and Conventional Commits

Conventional Commits align directly with SemVer increments:

| Commit Type                                              | SemVer Impact     |
| -------------------------------------------------------- | ----------------- |
| `fix:`                                                   | `PATCH`           |
| `feat:`                                                  | `MINOR`           |
| `feat!:` or `BREAKING CHANGE:` footer                    | `MAJOR`           |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `ci:` | No version change |

This alignment is what makes automated changelog and release tooling possible — see release-drafter.

---

## Versioning in package.json

```json
{
  "version": "1.4.2"
}
```

Update the version manually or via npm's version command:

```bash
# Increment patch — 1.4.2 → 1.4.3
npm version patch

# Increment minor — 1.4.2 → 1.5.0
npm version minor

# Increment major — 1.4.2 → 2.0.0
npm version major

# Set a specific version
npm version 2.0.0

# Pre-release
npm version prerelease --preid=beta   # 1.4.2 → 1.4.3-beta.0
```

> [!tip]
> `npm version` automatically creates a git commit and tag for the version bump. To skip this:
>
> ```bash
> npm version patch --no-git-tag-version
> ```

---

## Tagging Releases in Git

Version tags in Git should be prefixed with `v`:

```bash
# Create an annotated tag
git tag -a v1.4.2 -m "Release v1.4.2"

# Push the tag to remote
git push origin v1.4.2

# Push all tags
git push origin --tags

# List all tags
git tag

# Delete a local tag
git tag -d v1.4.2

# Delete a remote tag
git push origin --delete v1.4.2
```

> [!tip]
> Annotated tags (`-a`) are preferred over lightweight tags for releases — they include the tagger, date, and message, and are treated as full objects in Git history.

---

## Creating a GitHub Release

GitHub releases attach release notes, assets, and a changelog to a git tag.

**Via GitHub CLI:**

```bash
# Create a release from an existing tag
gh release create v1.4.2 --title "v1.4.2" --notes "<release notes>"

# Create a release and auto-generate notes from commits
gh release create v1.4.2 --generate-notes

# Create a draft release
gh release create v1.4.2 --draft

# Create a pre-release
gh release create v1.4.2-beta.1 --prerelease
```

> [!tip] Automating Release Notes
> Release Drafter can generate release notes automatically from PR titles and labels. See release-drafter for setup.

---

## Release Checklist

At each release:

- [ ] All intended changes are merged to `main`
- [ ] `CHANGELOG.md` updated with the new version and release date
- [ ] Version bumped in `package.json`
- [ ] Git tag created and pushed
- [ ] GitHub release created with release notes

---

## Out of Scope

The following topics were intentionally excluded and may be added in a future revision:

- **npm publishing** — publishing and maintaining a versioned package on the npm registry
- **Monorepo versioning** — independent vs synchronized versioning across packages in a monorepo (Changesets, Lerna)
- **Calendar versioning (CalVer)** — date-based versioning as an alternative to SemVer

---

_Related: [conventional-commits](conventional-commits.md) · release-drafter · release-process · open-source-prep · git-reference_
