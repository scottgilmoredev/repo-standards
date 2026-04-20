/**
 * E2E smoke test — real GitHub API, real filesystem writes.
 *
 * Covers two fetch paths:
 *   - directory path: github-templates bundle (fetchDirectory)
 *   - file path: labels-script bundle (fetchFile fallback)
 *
 * Not part of the unit test suite. Run manually: npm run e2e
 */

import { existsSync, readFileSync, rmSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadComponents, fetchBundlePaths, writeLockfile } from '../src/setup.js'
import { writeFile } from '../src/writer.js'

const dir = mkdtempSync(join(tmpdir(), 'repo-standards-e2e-'))
const originalCwd = process.cwd
process.cwd = () => dir

let passed = 0
let failed = 0

async function test(label, fn) {
  try {
    await fn()
    console.log(`  ✓ ${label}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${label}`)
    console.error(`    ${err.message}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

console.log(`\n=== repo-standards e2e ===`)
console.log(`tmp: ${dir}\n`)

try {
  const { version, bundles } = await loadComponents()

  // --- directory paths: github-templates ---
  console.log('github-templates bundle (contains directory paths):')
  const templateFiles = await fetchBundlePaths(bundles['github-templates'].paths)

  await test('resolves multiple files from directory paths', async () => {
    assert(templateFiles.length > 1, `expected >1 files, got ${templateFiles.length}`)
  })

  for (const file of templateFiles) {
    await writeFile(file)
  }

  await test('writes all template files to disk', async () => {
    for (const file of templateFiles) {
      assert(existsSync(join(dir, file.path)), `missing: ${file.path}`)
    }
  })

  // --- file path: labels-script ---
  console.log('\nlabels-script bundle (single file path):')
  const labelFiles = await fetchBundlePaths(bundles['labels-script'].paths)

  await test('resolves single file', async () => {
    assert(labelFiles.length === 1, `expected 1 file, got ${labelFiles.length}`)
  })

  await writeFile(labelFiles[0])

  await test('writes file to disk', async () => {
    assert(existsSync(join(dir, labelFiles[0].path)), `missing: ${labelFiles[0].path}`)
  })

  // --- lockfile ---
  console.log('\nlockfile:')
  await writeLockfile(version, ['github-templates', 'labels-script'])

  await test('written at cwd with correct shape', async () => {
    const lockPath = join(dir, '.repo-standards')
    assert(existsSync(lockPath), 'lockfile missing')
    const lock = JSON.parse(readFileSync(lockPath, 'utf-8'))
    assert(lock.version === version, 'version mismatch')
    assert(Array.isArray(lock.installedBundles), 'installedBundles not array')
    assert(typeof lock.installedAt === 'string', 'installedAt missing')
  })
} finally {
  process.cwd = originalCwd
  rmSync(dir, { recursive: true, force: true })
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
