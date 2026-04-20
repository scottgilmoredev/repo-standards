# Test-Driven Development

## Overview

Test-Driven Development (TDD) is a software development practice in which tests are written before the code they validate. Rather than writing code and then verifying it works, TDD inverts the process — you define the expected behavior first, watch it fail, then write the minimum code to make it pass.

The result is not just a test suite. TDD shapes how you design software — it encourages small, focused, testable units of code and produces a living specification of what the software is supposed to do.

This document covers the TDD philosophy, the development cycle, testing patterns, test organization, mocking, and coverage. Examples use Vitest syntax — the principles apply to any test runner. Framework-specific testing patterns are covered in the framework standards docs.

---

## Why TDD

**It forces you to think before you code.** Writing a test first requires you to define what a function should do, what it accepts, and what it returns — before you have written a single line of implementation. This surfaces design problems early, when they are cheap to fix.

**It produces better APIs.** Code written test-first tends to be more modular and loosely coupled, because tightly coupled code is hard to test. If your code is difficult to test, that is a signal your design needs attention.

**It creates a safety net.** A comprehensive test suite lets you refactor confidently. When you change code, the tests tell you immediately whether the behavior you expected is still intact.

**It documents behavior.** Tests are executable specifications. A well-written test suite tells the next developer — or your future self — exactly what the code is supposed to do and why.

**It reduces debugging time.** Bugs caught by tests at the unit level are far cheaper to fix than bugs discovered in integration, staging, or production.

---

## The TDD Cycle

TDD follows a tight, repeating loop known as **Red → Green → Refactor**.

```
┌─────────────────────────────────────────────┐
│                                             │
│   RED        Write a failing test           │
│    ↓         The test defines expected      │
│              behavior that does not yet     │
│              exist                          │
│                                             │
│   GREEN      Write the minimum code         │
│    ↓         to make the test pass          │
│              Do not over-engineer —         │
│              just make it pass              │
│                                             │
│   REFACTOR   Clean up the code              │
│    ↓         Improve structure, naming,     │
│              and clarity without            │
│              changing behavior              │
│                                             │
│   repeat ────────────────────────────────► │
└─────────────────────────────────────────────┘
```

### Red

Write a test that describes a specific piece of behavior. Run it — it should fail. If it passes without any implementation, either the test is wrong or the behavior already exists.

```typescript
// RED — this test will fail because parsePrice does not exist yet
it('parses a valid price string to a number', () => {
  expect(parsePrice('19.99')).toBe(19.99)
})
```

### Green

Write the simplest possible code that makes the test pass. Resist the urge to build more than the test requires.

```typescript
// GREEN — minimum implementation to pass the test
export function parsePrice(value: string): number {
  return parseFloat(value)
}
```

### Refactor

With the test green, improve the code. Extract duplication, improve naming, simplify logic. The test protects you — if you break something, it will tell you.

```typescript
// REFACTOR — same behavior, clearer implementation
export function parsePrice(value: string): number {
  const parsed = Number(value)
  if (isNaN(parsed)) throw new Error(`Invalid price: "${value}"`)
  return parsed
}
```

Then add the next test for the new behavior introduced in the refactor, and repeat.

> [!tip]
> Keep the cycle short. Each loop should take minutes, not hours. If a single Red → Green → Refactor cycle is taking a long time, the scope of the test is too large — break it down.

---

## Unit Testing

A unit test validates a single, isolated unit of behavior — typically a function, method, or class. It tests one thing at a time and has no side effects on external systems (database, network, filesystem).

### What to Test

**Test behavior, not implementation.**

A test should describe what a function does, not how it does it. Tests tied to implementation details break when you refactor, even when the behavior is unchanged.

```typescript
// ✓ Tests behavior — what the function returns
it('returns null for an empty string', () => {
  expect(parsePrice('')).toBeNull()
})

// ✗ Tests implementation — how the function works internally
it('calls parseFloat with the input', () => {
  const spy = vi.spyOn(global, 'parseFloat')
  parsePrice('19.99')
  expect(spy).toHaveBeenCalledWith('19.99')
})
```

**Test the contract, not the internals.** Public functions, public methods, module exports — these are the surface area that matters. Private implementation details should not be tested directly.

**Always test:**

- Happy path — expected input produces expected output
- Edge cases — empty values, zero, null, undefined, boundary values
- Error conditions — invalid input, missing required fields, out-of-range values

### Anatomy of a Good Test

A well-structured test follows the **Arrange → Act → Assert** pattern:

```typescript
it('returns the discounted price when a valid discount is applied', () => {
  // Arrange — set up the inputs and context
  const price = 100
  const discountPercent = 20

  // Act — call the function under test
  const result = applyDiscount(price, discountPercent)

  // Assert — verify the outcome
  expect(result).toBe(80)
})
```

### What Makes a Good Test

- **One assertion of intent per test** — a test that checks five things at once is hard to read and hard to debug when it fails
- **Descriptive names** — the test name should read as a specification: `it('returns null when the input is an empty string')`
- **No logic in tests** — conditionals, loops, and complex setup in tests obscure what is being tested. If setup is complex, extract it to a helper
- **Fast** — unit tests should run in milliseconds. Slow tests discourage running them frequently
- **Isolated** — tests should not depend on each other or share state. Each test should set up its own context

### Common Matchers

The following matchers are available in most test runners including Vitest and Jest:

| Matcher                         | Use                                            |
| ------------------------------- | ---------------------------------------------- |
| `toBe(value)`                   | Strict equality (`===`)                        |
| `toEqual(value)`                | Deep equality for objects and arrays           |
| `toBeNull()`                    | Value is `null`                                |
| `toBeUndefined()`               | Value is `undefined`                           |
| `toBeTruthy()` / `toBeFalsy()`  | Truthy/falsy check                             |
| `toThrow(message?)`             | Function throws an error                       |
| `toContain(item)`               | Array contains item, string contains substring |
| `toHaveLength(n)`               | Array or string has length n                   |
| `toHaveBeenCalled()`            | Mock/spy was called                            |
| `toHaveBeenCalledWith(...args)` | Mock/spy was called with specific arguments    |

📖 [Vitest expect API](https://vitest.dev/api/expect.html) · [Jest expect API](https://jestjs.io/docs/expect)

---

## Vitest Configuration

Vitest is configured in `vite.config.ts` under the `test` key. The following covers the options most relevant to day-to-day project setup.

### Full Configuration Example

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['src/test/setup.ts'],
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.test.ts'],
      thresholds: {
        lines: 90,
        functions: 95,
        branches: 85,
        statements: 90,
      },
    },
  },
})
```

### Options Reference

**`globals`**

When `true`, Vitest's test functions — `describe`, `it`, `test`, `expect`, `beforeEach`, `afterEach`, etc. — are available globally without importing them.

```typescript
// globals: false (default) — explicit imports required
import { describe, it, expect } from 'vitest'

// globals: true — no imports needed
describe('myFunction', () => {
  it('does something', () => {
    expect(true).toBe(true)
  })
})
```

> [!note] If using `globals: true` with TypeScript, add `"types": ["vitest/globals"]` to `tsconfig.json` to prevent type errors on the global functions:
>
> json
>
> ```json
> {
>   "compilerOptions": {
>     "types": ["vitest/globals"]
>   }
> }
> ```

**`environment`**

Defines the environment that simulates where the code runs. This affects what global APIs are available during tests.

| Value       | Simulates             | Use for                               |
| ----------- | --------------------- | ------------------------------------- |
| `node`      | Node.js (default)     | Server-side code, APIs, utilities     |
| `jsdom`     | Browser DOM           | React, Angular, Vue components        |
| `happy-dom` | Browser DOM (lighter) | Component testing — faster than jsdom |

```typescript
environment: 'node' // default — no DOM APIs available
environment: 'jsdom' // document, window, etc. available
```

> [!warning] Using the wrong environment causes confusing failures. A Node.js project with `environment: 'jsdom'` may pass tests that would fail at runtime because DOM globals mask missing Node.js behavior. Always set `environment` explicitly to match your runtime.

**`include`**

Glob patterns defining which files Vitest treats as test files. Defaults to `**/*.{test,spec}.{js,ts,jsx,tsx}`.

```typescript
include: ['src/**/*.test.ts'] // Only TypeScript test files in src/
```

**`exclude`**

Glob patterns for files to exclude from test discovery.

```typescript
exclude: ['node_modules', 'dist', 'src/**/*.integration.test.ts']
```

**`setupFiles`**

Files to run before each test file. Used for global test setup — configuring mocks, extending matchers, setting environment variables.

```typescript
setupFiles: ['src/test/setup.ts']
```

```typescript
// src/test/setup.ts
import { vi } from 'vitest'

// Reset all mocks after each test
afterEach(() => {
  vi.restoreAllMocks()
})
```

**`testTimeout`**

Maximum time in milliseconds a single test can run before it is considered failed. Default is 5000ms (5 seconds).

```typescript
testTimeout: 10000 // 10 seconds — appropriate for tests involving network calls
```

> [!tip] Increase `testTimeout` for integration tests that make real network requests or interact with external services. Keep it at the default or lower for unit tests — a slow unit test is usually a sign of a missing mock.

**`reporters`**

Controls test output format.

```typescript
reporters: ['verbose'] // Shows each test name as it runs
reporters: ['default'] // Summary only (default)
reporters: ['verbose', 'html'] // Terminal output + HTML report
```

## 📖 [Vitest configuration reference](https://vitest.dev/config/)

## Integration Testing

An integration test validates that multiple units work correctly together. Where a unit test isolates a single function, an integration test exercises a real interaction between components — a service calling a database, a module parsing and transforming data end-to-end, an API handler processing a full request.

### Unit vs Integration

|                       | Unit Test                    | Integration Test                                 |
| --------------------- | ---------------------------- | ------------------------------------------------ |
| **Scope**             | Single function or class     | Multiple components working together             |
| **Dependencies**      | Mocked                       | Real (or partially real)                         |
| **Speed**             | Milliseconds                 | Slower — may involve I/O                         |
| **Isolation**         | Complete                     | Partial                                          |
| **Failure diagnosis** | Precise — points to one unit | Less precise — failure could be in any component |

### When to Write Integration Tests

- When the interaction between two modules is complex and the unit tests do not give you enough confidence
- When testing data transformation pipelines end-to-end
- When testing API handlers with real request/response cycles
- When unit tests would require so many mocks that the test no longer reflects reality

> [!tip]
> A useful heuristic: if you find yourself mocking so much that the test barely resembles real usage, consider whether an integration test would give you more confidence with less setup.

### Integration Test Example

```typescript
// Integration test — exercises the full parsing pipeline
describe('product sync pipeline', () => {
  it('transforms a raw sheet row into a valid API payload', async () => {
    // Arrange — real input data, no mocks
    const rawRow = {
      'Product URL': '/products/widget',
      Title: 'Widget',
      Stock: '10',
    }

    // Act — runs through the full transformation pipeline
    const payload = await buildSyncPayload(rawRow)

    // Assert — validates the output shape
    expect(payload).toEqual({
      urlSlug: '/products/widget',
      name: 'Widget',
      inventory: { quantity: 10 },
    })
  })
})
```

---

## Test Organization

### File Naming and Location

Co-locate test files with the source files they test. This keeps tests discoverable and makes it clear which tests cover which code.

```
src/
├── parser/
│   ├── parser.ts
│   └── parser.test.ts           # Unit tests for parser.ts
├── sync/
│   ├── sync.ts
│   └── sync.test.ts
└── __tests__/
    └── integration/
        └── sync-pipeline.test.ts   # Integration tests
```

> [!note]
> Integration tests often live in a separate `__tests__/integration/` directory since they may require different setup, teardown, or configuration than unit tests.

**Naming convention:**

- Unit test files: `<filename>.test.ts`
- Integration test files: `<filename>.integration.test.ts` or in `__tests__/integration/`

### describe / it Conventions

Use `describe` blocks to group related tests. The `describe` name should identify the unit under test. The `it` name should complete the sentence "it \_\_\_":

```typescript
describe('parsePrice', () => {
  it('returns a number for a valid price string', () => { ... })
  it('returns null for an empty string', () => { ... })
  it('throws for a non-numeric string', () => { ... })
})
```

Nested `describe` blocks are appropriate when a function has meaningfully distinct behaviors worth grouping:

```typescript
describe('applyDiscount', () => {
  describe('when the discount is valid', () => {
    it('returns the discounted price', () => { ... })
    it('rounds to two decimal places', () => { ... })
  })

  describe('when the discount is invalid', () => {
    it('throws for a negative discount', () => { ... })
    it('throws for a discount over 100%', () => { ... })
  })
})
```

> [!tip]
> If you find yourself writing more than 5–7 tests in a single `describe` block without natural groupings, consider whether the unit under test is doing too much.

### Setup and Teardown

```typescript
describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    // Runs before each test — set up fresh state
    service = new UserService()
  })

  afterEach(() => {
    // Runs after each test — clean up side effects
    vi.restoreAllMocks()   // Vitest — use jest.restoreAllMocks() in Jest
  })

  it('...', () => { ... })
})
```

> [!warning]
> Avoid `beforeAll` / `afterAll` for state that tests mutate. Shared mutable state between tests causes order-dependent failures — one of the hardest categories of test bugs to diagnose. Prefer `beforeEach` to ensure each test starts clean.

---

## Mocking and Stubbing

Mocking replaces a real dependency with a controlled substitute. This isolates the unit under test from its dependencies — making tests faster, more predictable, and easier to reason about.

### When to Mock

**Mock:**

- External services — APIs, databases, email providers
- The filesystem, timers, random values
- Dependencies that are slow, non-deterministic, or have side effects
- Modules that are tested separately and can be trusted

**Do not mock:**

- The unit under test itself
- Pure utility functions with no side effects — test them directly
- Dependencies you are trying to validate the interaction with — use integration tests instead

> [!tip]
> Over-mocking is as problematic as under-mocking. If every dependency in a test is mocked, the test may pass in isolation but fail in real usage because the mocks do not accurately reflect real behavior. Mock at the boundaries of your system, not throughout it.

### Mock Types

**Spy** — wraps a real function and records calls without changing behavior:

```typescript
// Vitest
const spy = vi.spyOn(console, 'warn')
// Jest
const spy = jest.spyOn(console, 'warn')

doSomething()
expect(spy).toHaveBeenCalledWith('expected warning')
```

**Mock function** — replaces a function entirely with a controlled substitute:

```typescript
// Vitest
const mockFetch = vi.fn().mockResolvedValue({ status: 200, data: {} })
// Jest
const mockFetch = jest.fn().mockResolvedValue({ status: 200, data: {} })
```

**Module mock** — replaces an entire module:

```typescript
// Vitest
vi.mock('../api/client', () => ({
  fetchProducts: vi.fn().mockResolvedValue([]),
}))
// Jest
jest.mock('../api/client', () => ({
  fetchProducts: jest.fn().mockResolvedValue([]),
}))
```

### Mock Patterns

**Mocking a resolved promise:**

```typescript
const mockSync = vi.fn().mockResolvedValue({ created: 5, failed: 0 })
```

**Mocking a rejected promise:**

```typescript
const mockSync = vi.fn().mockRejectedValue(new Error('Network error'))
```

**Mocking different responses on sequential calls:**

```typescript
const mockFetch = vi
  .fn()
  .mockResolvedValueOnce({ status: 200 })
  .mockResolvedValueOnce({ status: 429 })
```

**Restoring mocks after tests:**

```typescript
afterEach(() => {
  vi.restoreAllMocks() // Vitest
  // jest.restoreAllMocks()   // Jest
})
```

📖 [Vitest mocking API](https://vitest.dev/api/vi.html) · [Jest mock functions](https://jestjs.io/docs/mock-functions)

---

## Coverage

Test coverage measures what percentage of your code is executed by your test suite. It is a useful signal but an incomplete one.

### What Coverage Tells You

- Which code paths are exercised by tests
- Which branches (if/else, switch cases) are covered
- Where obvious gaps exist

### What Coverage Does Not Tell You

- Whether the tests are meaningful — 100% coverage with weak assertions proves nothing
- Whether edge cases are covered — a test can execute a line without testing its failure mode
- Whether the system behaves correctly end to end

> [!warning]
> Coverage is a floor, not a ceiling. A line being covered means a test executed it — not that the test verified it behaves correctly. Do not treat a coverage percentage as a proxy for test quality.

### Running Coverage

Most test runners support coverage reporting out of the box:

```bash
# Vitest
npm run test:coverage

# Jest
npx jest --coverage
```

**Example Vitest coverage config in `vite.config.ts`:**

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
})
```

📖 [Vitest coverage](https://vitest.dev/guide/coverage.html) · [Jest coverage](https://jestjs.io/docs/configuration#collectcoverage-boolean)

### Coverage Targets

There is no universally correct coverage target. A pragmatic approach:

- **Core business logic** — aim high (90%+). This is where bugs are most costly
- **Utility functions** — full coverage is usually achievable and worthwhile
- **Configuration and setup files** — lower priority, harder to test meaningfully
- **UI components** — integration and e2e tests often provide more value than unit coverage

> [!tip]
> Rather than chasing a global percentage, focus on covering the code that matters most — the paths where bugs have real consequences. A well-tested core with lower coverage on peripheral code is better than uniform shallow coverage everywhere.

---

## Out of Scope

The following topics were intentionally excluded and may be added in a future revision:

- **End-to-end testing** — browser-based tests simulating real user interactions (Playwright, Cypress)
- **Snapshot testing** — asserting that rendered output matches a stored snapshot
- **Performance testing** — benchmarking and load testing
- **Property-based testing** — generating random inputs to find edge cases (fast-check)
- **Component testing** — testing UI components in isolation (React Testing Library, Angular Testing Library)
- **Framework-specific testing patterns** — React, Angular, Vue, Express testing conventions

---

_Related: `[[jsdoc-guidelines]]` · `[[typescript-reference]]` · `[[project-setup-checklist]]` · `[[node-npm-reference#Scripts Convention]]`_
