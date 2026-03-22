# User Stories — repo-standards

## Consumer Stories

---

**Select and install documentation bundles**

As a developer starting a new project
I want to choose which documentation bundles to install from an interactive
checklist
So that I can consistently apply my repository standards without manually
locating and copying files

Acceptance Criteria:
- Given I run `npx repo-standards` in an existing project directory
- When the checklist renders
- Then I see all available bundles with descriptions
- And I can select one, many, or all bundles individually
- And a "Select All" option is available to install every bundle at once
- And only the bundles I select are fetched and installed

---

**Understand what was installed**

As a developer returning to a project
I want a record of which documentation bundles were installed and at what
version
So that I know what standards are in place and can identify if they are
out of date

Acceptance Criteria:
- Given I have run `npx repo-standards` and selected bundles
- When installation completes
- Then a `.repo-standards` file is written to the project root
- And it records the installed version, selected bundle names, and install date
- And the file is committed to version control as a record of intent

---

**Handle file conflicts safely**

As a developer running `npx repo-standards` in a project that already has
some standards files
I want to be prompted when a file I am installing already exists
So that I do not accidentally overwrite files I have already customized

Acceptance Criteria:
- Given a bundle contains a file that already exists in the project
- When the file writer encounters the conflict
- Then I am prompted to overwrite or skip that file
- And my choice is applied per file, not globally
- And files with no conflict are written without prompting

---

**Authenticate to avoid rate limiting**

As a developer who runs `npx repo-standards` frequently
I want to provide a GitHub token via environment variable
So that I am not blocked by the unauthenticated API rate limit

Acceptance Criteria:
- Given `GITHUB_TOKEN` is set in my environment
- When the GitHub Contents API client makes requests
- Then the token is included in the `Authorization` header
- And requests are made at the authenticated rate limit (5,000/hour)
- Given `GITHUB_TOKEN` is not set
- Then requests proceed unauthenticated without error

---

## System Stories

---

**Resolve directory bundle paths to individual files**

As the setup script
I want to expand bundle paths that point to directories into their full
list of individual file paths
So that directory-based bundles can be fetched and installed completely

Acceptance Criteria:
- Given a bundle path points to a directory (e.g. `.github/ISSUE_TEMPLATE`)
- When the GitHub Contents API client receives that path
- Then it lists the directory contents via the API
- And recursively resolves any nested directories
- And returns a flat list of file paths and their content

---

**Fetch file content from the GitHub Contents API**

As the setup script
I want to fetch the content of individual files from the GitHub Contents API
So that bundle files can be written into the consumer project

Acceptance Criteria:
- Given a resolved file path
- When the API client fetches the file
- Then the base64-encoded content is decoded to UTF-8
- And the decoded content is returned alongside the relative file path
- And a failed request surfaces a clear error identifying which file failed

---

**Write fetched files into the consumer project**

As the setup script
I want to write resolved file content to the correct paths in the consumer
project
So that installed bundles land in the expected locations

Acceptance Criteria:
- Given a resolved file path and decoded content
- When the file writer processes it
- Then any missing parent directories are created
- And the file is written at the correct path relative to the project root
- And existing files trigger a per-file overwrite/skip prompt
