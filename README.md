# repo-standards

[![CI](https://github.com/<username>/repo-standards/actions/workflows/ci.yml/badge.svg)](https://github.com/<username>/repo-standards/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/repo-standards.svg)](https://www.npmjs.com/package/repo-standards)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Node.js CLI tool that installs repository documentation into an existing
project. Run once after `git init` and `npm init` to drop in GitHub templates,
community health files, and reference documentation from a curated bundle set.

---

## Demo

_GIF coming soon._

---

## Features

- Interactive checklist — select individual bundles or install all at once
- Fetches files directly from GitHub via the Contents API
- Prompts on file conflict — never overwrites silently
- Writes a `.repo-standards` lockfile recording what was installed and at
  what version
- Optional `GITHUB_TOKEN` support for authenticated API requests

---

## Tech Stack

|             |                                                    |
| ----------- | -------------------------------------------------- |
| Runtime     | Node.js 24                                         |
| Language    | JavaScript (ESM)                                   |
| CLI prompts | [inquirer](https://www.npmjs.com/package/inquirer) |
| HTTP        | Native `fetch`                                     |

---

## Prerequisites

- Node.js `>=22`
- An existing project with `git init` and `npm init` already run

---

## Installation

**Recommended — run without installing:**

```bash
npx repo-standards
```

**Global install:**

```bash
pnpm install -g repo-standards
repo-standards
```

---

## Usage

Run in the root of an existing project:

```bash
npx repo-standards
```

An interactive checklist will present the available bundles. Select the ones
you want to install, or choose **Select All** to install everything. Selected
bundles are fetched from GitHub and written into the current directory.

On completion, a `.repo-standards` file is written to the project root.
Commit this file — it records what was installed and at what version.

### Available Bundles

| Bundle             | Description                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `github-templates` | Issue templates, PR templates, and default PR template                                      |
| `community-health` | CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, CODEOWNERS                              |
| `readme-templates` | README templates for app, library, CLI, and API project types                               |
| `labels-script`    | Shell script to create the standard GitHub label set via the GitHub CLI                     |
| `git-standards`    | Reference docs for branching, Conventional Commits, PR conventions, and semantic versioning |
| `github-standards` | Reference docs for GitHub labels, issues, milestones, and PR sidebar usage                  |
| `dev-standards`    | Reference docs for environment variables, TDD, and software licenses                        |

### File Conflicts

If a file being installed already exists in your project, you will be prompted
to overwrite or skip it. The choice is applied per file — no blanket overwrite.

### Lockfile

On completion, `repo-standards` writes a `.repo-standards` file to your
project root:

```json
{
  "version": "1.0.0",
  "installed": ["github-templates", "community-health"],
  "date": "2026-03-22"
}
```

Commit this file. It is a record of which standards are in place and at what
version — useful when the bundles evolve and you want to know where a project
stands.

---

## Configuration

### `GITHUB_TOKEN`

By default, `repo-standards` makes unauthenticated requests to the GitHub
Contents API (60 requests/hour per IP). For typical use this is sufficient.

If you need a higher rate limit, set a GitHub personal access token:

```bash
export GITHUB_TOKEN=your_token_here
npx repo-standards
```

The token requires no specific scopes for public repository access.

---

## A Note on Installed Files

`repo-standards` is a documentation tool. It does not install configuration
files or modify your project's `package.json`, dependencies, or tooling.

Some installed files contain front matter or metadata required for GitHub to
recognize them — for example, issue template front matter that sets the
template name and default labels. This metadata is presentational, not
behavioral, and is included intentionally.

The one exception: `.github/ISSUE_TEMPLATE/config.yml` is excluded from the
`github-templates` bundle. That file controls GitHub's issue template chooser
UI behavior and is configuration rather than documentation. Add it manually
if your project requires it.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md)
before opening a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
