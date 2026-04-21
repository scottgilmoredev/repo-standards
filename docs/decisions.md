# Decision Log — repo-standards

---

## Use realpathSync to resolve bin symlink in entry point guard — 2026-04-21

**Decision:** Use `realpathSync(process.argv[1])` rather than `process.argv[1]` directly when comparing against `fileURLToPath(import.meta.url)` to determine if `setup.js` is the CLI entry point.

**Context:** The initial entry point guard (`process.argv[1] === fileURLToPath(import.meta.url)`) worked when running the file directly with `node` but silently failed when invoked via `npx`. npm installs a symlink in `node_modules/.bin/` pointing to the actual file. `process.argv[1]` resolves to the symlink path, not the real file path, causing the comparison to fail and `run()` to never be called.

**Alternatives considered:**

- Check if `process.argv[1]` ends with `setup.js` — fragile, breaks if the file is renamed or nested differently
- Call `run()` unconditionally — fires on import, disrupts unit tests unless mocked precisely at load time
- Use `import.meta.main` — not available in Node.js (Deno only)

**Rationale:** `realpathSync` resolves symlinks before comparison, making the check reliable regardless of how the file is invoked. One import, no fragility.

**Consequences:** Requires importing `realpathSync` from `node:fs`. The guard is reliable across direct execution, `npx`, and local `npm install` scenarios.

**Status:** Decided

---

## Remove environment-variables.md from dev-standards bundle — 2026-04-21

**Decision:** Remove `docs/dev-standards/environment-variables.md` from the `dev-standards` bundle and delete the file.

**Context:** During bundle content review, the file was found to contain Next.js and Vite scaffold references — framework-specific content incompatible with a tool intended to serve any project regardless of stack.

**Alternatives considered:**

- Genericize the file — stripping the framework-specific sections would leave a doc too thin to be worth installing

**Rationale:** The test for inclusion is "would this file be useful to any project regardless of stack?" The file failed that test. Cutting it is cleaner than shipping a stripped-down version with diminishing value.

**Consequences:** `dev-standards` bundle now contains only `tdd-reference.md` and `software-licenses.md`. The `environment-variables.md` file no longer exists in the repository.

**Status:** Decided

---

## Load components.json relative to module file, not process.cwd() — 2026-04-21

**Decision:** In `loadComponents()`, resolve the path to `components.json` using `dirname(fileURLToPath(import.meta.url))` rather than `process.cwd()`.

**Context:** `components.json` ships with the npm package — it is a package artifact, not a project file. When a consumer runs `npx repo-standards` in their project directory, `process.cwd()` points to their project root, not the installed package. The manifest would not be found.

**Alternatives considered:**

- Pass the path as a parameter — adds unnecessary complexity to the public API; `loadComponents` has no reason to accept an external path
- Use `__dirname` — not available in ESM modules

**Rationale:** `import.meta.url` gives the URL of the current module file. Resolving relative to it ensures `components.json` is always found alongside `setup.js`, regardless of where the consumer runs the tool.

**Consequences:** `components.json` must always be distributed at the package root (one level up from `src/`). This is enforced by the `files` field in `package.json` if one is added, or implicitly by the default npm publish behavior.

**Status:** Decided

---

## Use fetchDirectory with fetchFile fallback for path resolution — 2026-04-21

**Decision:** In `fetchBundlePaths()`, attempt `fetchDirectory()` first for every path; catch the error and fall back to `fetchFile()` rather than detecting path type upfront.

**Context:** Bundle paths in `components.json` can be either files (`community/create-labels.sh`) or directories (`.github/ISSUE_TEMPLATE`). The GitHub Contents API returns an array for directories and an object for files. `fetchDirectory()` calls `.map()` on the response — if the response is an object (a file), it throws because objects don't have `.map`.

**Alternatives considered:**

- Inspect the path string for a file extension — fragile; extensionless files and directories with dots in their names would be misclassified
- Add a `type` field to each bundle path in `components.json` — adds authoring overhead and a new convention to maintain for every future bundle path
- Make a HEAD request first to determine type — an extra API call per path with no other benefit

**Rationale:** The try/catch approach exploits a predictable API behavior (directory response is array, file response is object) without any upfront type information. Zero extra API calls, zero additional schema.

**Consequences:** `fetchDirectory()` will be called even for known file paths, incurring one failed API call per file path. At bundle install scale this is negligible. The pattern is unintuitive without context — documented in the function's JSDoc.

**Status:** Decided

---

## Bundle-level selection only — no file-level granularity — 2026-04-21

**Decision:** The CLI presents bundles as the atomic unit of selection. Users choose which bundles to install; all files within a selected bundle are installed.

**Context:** During implementation of `setup.js`, the question arose of whether users should be able to select individual files within a bundle rather than the entire bundle.

**Alternatives considered:**

- File-level selection — presents every file as a checkbox option; gives maximum flexibility but creates a long, overwhelming prompt for large bundles and requires users to understand the file structure before installing

**Rationale:** Bundles are curated sets of related files that work together. Installing half a bundle (e.g., PR templates without the issue templates) produces an inconsistent result. The bundle is the meaningful unit of installation. Users who want a subset can install the bundle and delete what they don't need.

**Consequences:** No mechanism exists to install a single file from a bundle. This is a deliberate constraint, not a gap. Issue `#38` (bulk conflict resolution) should be addressed before this decision is revisited.

**Status:** Decided
