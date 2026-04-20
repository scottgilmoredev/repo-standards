# Software Licenses

## Overview

A software license defines how others may use, copy, modify, and distribute your code. Without a license, default copyright law applies — meaning no one has the right to use your code for any purpose, even if it is publicly visible on GitHub. Every repository intended for any form of use or contribution should include a `LICENSE` file.

This document covers the most common licenses used in software projects, how to choose one, how to apply it, and license compatibility considerations.

---

## How GitHub Handles Licenses

GitHub automatically detects a `LICENSE` file at the root of a repository and displays the license type prominently on the repository page. This detection is based on the file contents matching known license templates — using the exact text from [choosealicense.com](https://choosealicense.com) ensures correct detection.

The `LICENSE` file should:

- Be named `LICENSE` or `LICENSE.md` at the repo root
- Contain the full license text
- Include the copyright year and your name where the template requires it

---

## License Types

### MIT

The most permissive and widely used open source license. It allows anyone to use, copy, modify, merge, publish, distribute, sublicense, and sell the software with minimal restrictions. The only requirement is that the original license and copyright notice are included in any distribution.

**Permissions:** Use, copy, modify, distribute, sublicense, sell
**Conditions:** Include original license and copyright notice
**Limitations:** No warranty or liability

**When to use it:**

- Open source libraries or tools you want widely adopted
- Portfolio projects you want others to be able to learn from and use freely
- Projects where maximum adoption is more important than controlling downstream use

📖 [MIT License text](https://choosealicense.com/licenses/mit/)

---

### Apache 2.0

Similar to MIT in permissiveness but adds explicit patent grants — contributors grant users a license to any patents they hold that are applicable to the software. Also requires that changes to the source be documented.

**Permissions:** Use, copy, modify, distribute, sublicense, sell, patent use
**Conditions:** Include license and copyright notice, document changes, patent grant
**Limitations:** No warranty, trademark rights, or liability

**When to use it:**

- Projects where patent protection for contributors and users is a concern
- Corporate or professionally oriented open source projects
- When you want MIT-level permissiveness with additional legal clarity

📖 [Apache 2.0 License text](https://choosealicense.com/licenses/apache-2.0/)

---

### GPL (GNU General Public License)

A copyleft license — anyone who distributes GPL-licensed software or a derivative work must release the source code under the GPL as well. This ensures that the software and all derivatives remain open source.

**Permissions:** Use, copy, modify, distribute
**Conditions:** Derivatives must also be GPL-licensed and source must be made available
**Limitations:** No warranty or liability

#### Variants

| Variant               | Key Distinction                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **GPLv2**             | Original version. Does not address software-as-a-service (SaaS) loophole                                                                     |
| **GPLv3**             | Current standard. Adds anti-tivoization clause, patent protection, and compatibility with Apache 2.0                                         |
| **LGPL (Lesser GPL)** | Weaker copyleft — allows linking from proprietary software without triggering GPL requirements. Used for libraries                           |
| **AGPL (Affero GPL)** | Strongest copyleft — closes the SaaS loophole by requiring source disclosure even when the software is only run on a server, not distributed |

**When to use it:**

- You want to ensure your software and all derivatives remain open source
- You are building a tool or library for the open source ecosystem and want to prevent proprietary forks
- Use LGPL for libraries you want proprietary software to be able to link against
- Use AGPL if your software runs as a service and you want to require source disclosure from hosted derivatives

📖 [GPLv3 License text](https://choosealicense.com/licenses/gpl-3.0/) · [LGPL](https://choosealicense.com/licenses/lgpl-3.0/) · [AGPL](https://choosealicense.com/licenses/agpl-3.0/)

---

### ISC

Functionally equivalent to MIT but with simpler, more concise language. Preferred by some projects for its brevity. Common in the Node.js ecosystem — npm itself uses ISC.

**Permissions:** Use, copy, modify, distribute
**Conditions:** Include original license and copyright notice
**Limitations:** No warranty or liability

**When to use it:**

- Anywhere you would use MIT — a matter of stylistic preference
- Node.js packages where ISC is conventional

📖 [ISC License text](https://choosealicense.com/licenses/isc/)

---

### Unlicense

A dedication to the public domain. Effectively waives all copyright and related rights — anyone can do anything with the software without any conditions.

**Permissions:** Unrestricted
**Conditions:** None
**Limitations:** No warranty or liability

**When to use it:**

- Code you want completely free of any restrictions — reference implementations, educational examples, trivial utilities
- When you genuinely do not care what anyone does with the code

> [!note]
> Public domain dedication is not recognized in all jurisdictions. If legal certainty matters, MIT is a safer alternative that achieves a similar result with broader legal standing.

📖 [The Unlicense text](https://choosealicense.com/licenses/unlicense/)

---

### Proprietary / All Rights Reserved

Not a formal license — a copyright notice asserting that no rights are granted to others. The code may be publicly visible (e.g. on GitHub) but cannot legally be used, copied, modified, or distributed without explicit permission from the copyright holder.

**When to use it:**

- Portfolio projects you want visible for review but do not want others to reuse
- Private tools or applications you are not ready to open source
- Client work where you retain ownership but want to host publicly

**Applying it:**

Add a `LICENSE` file containing:

```
Copyright (c) <year> <Your Name>. All rights reserved.

This software and its source code are proprietary and confidential.
No part of this software may be reproduced, distributed, or transmitted
in any form or by any means without the prior written permission of the
copyright holder.
```

> [!note]
> GitHub will not detect this as a known license type and will not display a license badge. That is expected behavior for proprietary code.

---

### No License

A public repository with no `LICENSE` file is **not** free to use. Under default copyright law, all rights are reserved by the author — the same as proprietary/all rights reserved — but without even a notice making that explicit. This creates ambiguity for potential contributors and users.

> [!warning]
> If your repository is public and has no `LICENSE` file, others cannot legally use, copy, modify, or contribute to it — even if that was not your intent. Always include a license. If you are unsure which to choose, MIT is a safe default for most open source work.

---

## License Comparison

| License     | Permissive | Copyleft    | Patent Grant | Conditions                                    |
| ----------- | ---------- | ----------- | ------------ | --------------------------------------------- |
| MIT         | ✓          | ✗           | ✗            | Attribution only                              |
| Apache 2.0  | ✓          | ✗           | ✓            | Attribution + document changes                |
| GPLv3       | ✗          | ✓ Strong    | ✓            | Derivatives must be GPL                       |
| LGPL        | ✗          | ✓ Weak      | ✓            | Libraries may be linked from proprietary code |
| AGPL        | ✗          | ✓ Strongest | ✓            | Derivatives + SaaS deployments must be AGPL   |
| ISC         | ✓          | ✗           | ✗            | Attribution only                              |
| Unlicense   | ✓          | ✗           | ✗            | None                                          |
| Proprietary | ✗          | ✗           | ✗            | All rights reserved                           |

---

## Decision Guide

```
Is this project intended to be open source?
│
├── No
│   └── Do you want the code publicly visible (e.g. portfolio)?
│       ├── Yes → Proprietary / All Rights Reserved
│       └── No  → Keep the repo private — no license needed
│
└── Yes
    └── Do you want derivatives to also be open source?
        │
        ├── No (permissive)
        │   └── Is patent protection important?
        │       ├── Yes → Apache 2.0
        │       └── No  → MIT or ISC
        │
        └── Yes (copyleft)
            └── Is this a library?
                ├── Yes → LGPL
                └── No
                    └── Will it be deployed as a service?
                        ├── Yes → AGPL
                        └── No  → GPLv3
```

---

## Applying a License

### Adding the `LICENSE` file

1. Create a `LICENSE` file at the repo root
2. Copy the full license text from [choosealicense.com](https://choosealicense.com)
3. Replace `[year]` and `[fullname]` placeholders where present
4. Commit the file — ideally as part of the initial commit

```bash
touch LICENSE
# paste license text, then
git add LICENSE
git commit -m "chore: add MIT license"
```

### Source file headers

Some licenses — particularly Apache 2.0 and GPL — recommend or require a short copyright notice at the top of each source file. MIT and ISC do not require this but it is sometimes done for clarity.

**Example header (Apache 2.0):**

```
Copyright (c) <year> <Your Name>

Licensed under the Apache License, Version 2.0. You may not use
this file except in compliance with the License. You may obtain
a copy at http://www.apache.org/licenses/LICENSE-2.0
```

> [!note]
> For most solo and small team projects, a root-level `LICENSE` file without per-file headers is sufficient and conventional.

---

## License Compatibility

License compatibility determines whether code under different licenses can be combined in the same project.

| Combining with →          | MIT                   | Apache 2.0            | GPLv3                | AGPL |
| ------------------------- | --------------------- | --------------------- | -------------------- | ---- |
| **MIT dependency**        | ✓                     | ✓                     | ✓                    | ✓    |
| **Apache 2.0 dependency** | ✓                     | ✓                     | ✓ (GPLv3 only)       | ✓    |
| **GPLv3 dependency**      | Project must be GPLv3 | Project must be GPLv3 | ✓                    | ✓    |
| **AGPL dependency**       | Project must be AGPL  | Project must be AGPL  | Project must be AGPL | ✓    |

> [!warning] GPL and AGPL are Viral
> If your project includes a GPLv3 dependency, your project must also be licensed under GPLv3 (or a compatible license). If it includes an AGPL dependency, your project must be AGPL. This is the copyleft mechanism in practice — it propagates upstream. If you are building proprietary software, avoid GPL and AGPL dependencies entirely.

> [!tip]
> MIT and Apache 2.0 dependencies can be used in almost any project without license complications. When in doubt, prefer dependencies with permissive licenses.

---

## Out of Scope

The following topics were intentionally excluded from this document and may be added in a future revision:

- **Dual licensing** — releasing software under two licenses simultaneously (e.g. GPL for open source use, commercial license for proprietary use)
- **Formal commercial licenses** — custom or third-party commercial license agreements for proprietary software distribution
- **Creative Commons licenses** — relevant for documentation, media, and non-software content rather than source code

---

_Related: `[[git-github-setup]]`_
