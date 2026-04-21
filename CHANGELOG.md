# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.0.1] - 2026-04-21

### Fixed

- Stale `dev-standards` bundle description in README (removed environment variables reference)

### Changed

- Added npm keywords for discoverability

---

## [1.0.0] - 2026-04-21

### Added

- Interactive CLI (`npx repo-standards`) — presents a checkbox of available documentation bundles fetched from the GitHub Contents API
- `github-templates` bundle — issue templates, PR templates, default PR template
- `community-health` bundle — CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, CODEOWNERS
- `readme-templates` bundle — README templates for app, library, CLI, and API projects
- `labels-script` bundle — shell script to create standard GitHub label set via `gh` CLI
- `git-standards` bundle — branching strategy, Conventional Commits, PR conventions, semantic versioning reference docs
- `github-standards` bundle — GitHub labels, issues, milestones, PR sidebar reference docs
- `dev-standards` bundle — TDD reference and software licenses reference docs
- `.repo-standards` lockfile written on completion — records version, installed bundles, and install date
- `GITHUB_TOKEN` environment variable support — raises API rate limit from 60 to 5,000 requests/hour
- File conflict prompting — never overwrites silently
