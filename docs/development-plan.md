# Development Plan — repo-standards

## Project Overview

### Description

A Node.js CLI tool published to npm. Run via `npx repo-standards` inside an
existing project to interactively install a curated set of repository
documentation — GitHub templates, community health files, reference docs,
and README templates — fetched from a GitHub repository and written into
the current project directory.

For user stories derived from this plan see [User Stories](user-stories.md).

### Problem

Starting a new project requires manually locating, copying, and adapting the
same set of repository documentation across repos: issue templates, PR
templates, community health files, git and GitHub standards reference docs.
This is repetitive, inconsistent, and easy to skip under time pressure.

### Solution

A single `npx` command presents an interactive checklist of available
documentation bundles. Selected bundles are fetched from the GitHub
repository via the GitHub Contents API and written into the current project
directory. A `.repo-standards` lockfile records what was installed and at
what version.

### Non-Goals

- Does not generate new projects from scratch — assumes `git init` and
  `npm init` have already run
- Does not install configuration files, modify `package.json`, or install
  dependencies in the consumer project. Some installed files contain
  metadata or front matter required for GitHub to recognize them (e.g.
  issue template front matter) — this is documented in the README
- Does not enforce or automate updates — reinstalling is a manual,
  opt-in action
- Does not support private source repositories without a `GITHUB_TOKEN`
  environment variable

---

## Architecture

### Components

- **`setup.js`** — CLI entry point. Reads `components.json`, renders the
  interactive checklist via `inquirer`, orchestrates fetching and writing
  files, and writes the `.repo-standards` lockfile on completion.
- **`components.json`** — bundle manifest. Defines available bundles, their
  descriptions, and the file/directory paths to fetch. Versioned
  independently of the npm package.
- **GitHub Contents API client** — responsible for fetching file content
  and resolving directory paths recursively. Respects `GITHUB_TOKEN` if
  present; falls back to unauthenticated requests.
- **File writer** — receives resolved file paths and decoded content,
  creates directories as needed, and writes files into the consumer project.
  Prompts on conflict — does not overwrite silently.
- **`.repo-standards`** — lockfile written to the consumer project root on
  completion. Records installed version, selected bundles, and install date.
  Should be committed — it is a record of intent, visible in version history
  and reviewable in PRs.

### Data Flow

```text
components.json
      ↓
  setup.js (inquirer checklist)
      ↓
  selected bundles → GitHub Contents API
      ↓
  resolved files (path + content)
      ↓
  file writer → consumer project directory
      ↓
  .repo-standards (lockfile)
```

### Key Decisions

- **GitHub Contents API over raw URLs** — bundle paths include directories
  (e.g. `.github/ISSUE_TEMPLATE`). Raw URLs cannot resolve directory
  contents; the API handles both files and directories natively.
- **Optional `GITHUB_TOKEN` via env var** — unauthenticated requests are
  rate limited to 60/hour by IP. A token raises this to 5,000/hour. The
  token is optional — personal use is unlikely to hit the unauthenticated
  limit, but the escape hatch costs nothing to implement.
- **Prompt on file conflict** — silent overwrite is destructive; silent skip
  is confusing. The file writer prompts with overwrite/skip options when a
  file already exists.
- **`config.yml` excluded from `github-templates`** — `config.yml`
  configures GitHub's issue template chooser UI behavior. It is the one
  file in the bundle that is configuration rather than documentation and
  is excluded on that basis.
- **No TypeScript** — `setup.js` is a single-file CLI script. The overhead
  of a build step is not justified at this scope. Plain ES modules.
- **`inquirer` for the interactive checklist** — de facto standard for
  interactive Node.js CLIs.

---

## Technical Stack

| Layer       | Technology                                                             | Notes                                                 |
| ----------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| Runtime     | Node.js 24                                                             | Current LTS                                           |
| Language    | JavaScript (ESM)                                                       | No build step required at this scope                  |
| CLI prompts | inquirer                                                               | Interactive checklist                                 |
| HTTP        | Native `fetch`                                                         | Available since Node 18 — no additional dependency    |
| Testing     | Vitest                                                                 | Consistent with project standards                     |
| Linting     | ESLint + Prettier, `@eslint/js` recommended + `eslint-plugin-import-x` | Airbnb config incompatible with ESLint v9 flat config |
| Git hooks   | Husky + lint-staged + commitlint                                       | Consistent with project standards                     |
| CI          | GitHub Actions                                                         | Lint, test on PR and push to `main`                   |
| Registry    | npm                                                                    | Published as `repo-standards`                         |

---

## Project Scope

### In Scope

- Interactive CLI checklist presenting available bundles from `components.json`
- Fetch selected bundles from the GitHub Contents API
- Recursive directory resolution — bundle paths pointing to directories are
  expanded to their full file list before fetching
- Write fetched files into the consumer project, creating directories as needed
- Prompt on file conflict — overwrite or skip per file
- Write `.repo-standards` lockfile on completion
- Optional `GITHUB_TOKEN` support via environment variable
- `components.json` containing the full initial bundle set:
  `github-templates`, `community-health`, `readme-templates`,
  `labels-script`, `git-standards`, `github-standards`, `dev-standards`

### Out of Scope

- Updating or diffing previously installed files
- Removing installed files
- Installing configuration files or project tooling
- Supporting bundle sources other than this GitHub repository
- A `--dry-run` flag (deferred to a future version)

### Constraints

- Minimal dependencies — `inquirer` only. Native `fetch` for HTTP,
  native `fs` for file writing
- Must work on macOS, Linux, and Windows (WSL)

---

## Milestones

### Milestone 0 — Project Setup

Complete project planning, documentation, repository configuration, and
local environment setup. Project ready for implementation.

### Milestone 1 — Core Implementation

`setup.js` built incrementally via TDD. All bundles fetchable and
installable end-to-end.

### Milestone 2 — Release

Package prepared, versioned, and published to npm. Includes `bin` field
and shebang configuration required for `npx` execution without a global
install.
