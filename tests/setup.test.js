/**
 * CLI Setup Tests
 *
 * @module
 * @description Unit tests for the CLI entry point.
 * Covers component loading, bundle selection, file fetching, and lockfile writing.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import inquirer from 'inquirer'

import { fetchFile, fetchDirectory } from '../src/github.js'
import { writeFile as writeLocalFile } from '../src/writer.js'
import {
  run,
  loadComponents,
  buildChoices,
  fetchBundlePaths,
  writeLockfile,
  SELECT_ALL,
} from '../src/setup.js'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}))

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}))

vi.mock('../src/github.js', () => ({
  fetchFile: vi.fn(),
  fetchDirectory: vi.fn(),
}))

vi.mock('../src/writer.js', () => ({
  writeFile: vi.fn(),
}))

const mockBundles = {
  'git-standards': {
    description: 'Git reference docs',
    paths: ['docs/git-standards/branching-strategy.md'],
  },
  'github-templates': {
    description: 'GitHub templates',
    paths: ['.github/ISSUE_TEMPLATE', '.github/pull_request_template.md'],
  },
}

const mockComponents = {
  version: '1.0.0',
  bundles: mockBundles,
}

const mockFile = {
  path: 'docs/git-standards/branching-strategy.md',
  content: '# Branching Strategy',
}

/**
 * Mock a successful components.json load
 *
 * @returns {void}
 */
const mockComponentsLoad = () => readFile.mockResolvedValueOnce(JSON.stringify(mockComponents))

beforeEach(() => {
  vi.spyOn(process, 'cwd').mockReturnValue('/mock/project')
  // resetAllMocks in afterEach clears these — re-apply defaults each test
  writeFile.mockResolvedValue(undefined)
  writeLocalFile.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

/**
 * @description Tests for the loadComponents function
 */
describe('loadComponents', () => {
  /**
   * @test
   * @description Confirms components.json is read and parsed into version and bundles
   */
  it('returns parsed version and bundles from components.json', async () => {
    // Arrange
    readFile.mockResolvedValueOnce(JSON.stringify(mockComponents))

    // Act
    const result = await loadComponents()

    // Assert
    expect(result).toEqual(mockComponents)
  })
})

/**
 * @description Tests for the buildChoices function
 */
describe('buildChoices', () => {
  /**
   * @test
   * @description Confirms Select All is the first choice in the list
   */
  it('includes Select All as the first choice', () => {
    // Arrange + Act
    const choices = buildChoices(mockBundles)

    // Assert
    expect(choices[0]).toMatchObject({ value: SELECT_ALL })
  })

  /**
   * @test
   * @description Confirms each bundle appears as a choice with its name and description
   */
  it('includes a choice for each bundle with name and description', () => {
    // Arrange + Act
    const choices = buildChoices(mockBundles)
    const values = choices.map(c => c.value)
    const names = choices.map(c => c.name)

    // Assert
    expect(values).toContain('git-standards')
    expect(values).toContain('github-templates')
    expect(names.some(n => n.includes('Git reference docs'))).toBe(true)
    expect(names.some(n => n.includes('GitHub templates'))).toBe(true)
  })
})

/**
 * @description Tests for the fetchBundlePaths function
 */
describe('fetchBundlePaths', () => {
  /**
   * @test
   * @description Confirms directory paths are resolved via fetchDirectory
   */
  it('resolves directory paths via fetchDirectory', async () => {
    // Arrange
    fetchDirectory.mockResolvedValueOnce([mockFile])

    // Act
    const result = await fetchBundlePaths(['.github/ISSUE_TEMPLATE'])

    // Assert
    expect(fetchDirectory).toHaveBeenCalledWith('.github/ISSUE_TEMPLATE')
    expect(result).toEqual([mockFile])
  })

  /**
   * @test
   * @description Confirms plain file paths fall back to fetchFile when fetchDirectory throws
   */
  it('falls back to fetchFile when fetchDirectory throws', async () => {
    // Arrange — fetchDirectory throws for plain files (response has no .map)
    fetchDirectory.mockRejectedValueOnce(new Error('not a directory'))
    fetchFile.mockResolvedValueOnce(mockFile)

    // Act
    const result = await fetchBundlePaths(['docs/git-standards/branching-strategy.md'])

    // Assert
    expect(fetchFile).toHaveBeenCalledWith('docs/git-standards/branching-strategy.md')
    expect(result).toEqual([mockFile])
  })

  /**
   * @test
   * @description Confirms results across multiple paths are returned as a flat list
   */
  it('returns a flat list across multiple paths', async () => {
    // Arrange
    const fileA = { path: 'a.md', content: 'A' }
    const fileB = { path: 'b.md', content: 'B' }
    fetchDirectory.mockRejectedValueOnce(new Error())
    fetchFile.mockResolvedValueOnce(fileA)
    fetchDirectory.mockRejectedValueOnce(new Error())
    fetchFile.mockResolvedValueOnce(fileB)

    // Act
    const result = await fetchBundlePaths(['a.md', 'b.md'])

    // Assert
    expect(result).toEqual([fileA, fileB])
  })
})

/**
 * @description Tests for the writeLockfile function
 */
describe('writeLockfile', () => {
  /**
   * @test
   * @description Confirms lockfile is written at cwd with correct version, bundles, and date
   */
  it('writes .repo-standards at cwd with version, bundles, and date', async () => {
    // Arrange
    const bundles = ['git-standards']

    // Act
    await writeLockfile('1.0.0', bundles)

    // Assert
    expect(writeFile).toHaveBeenCalledWith(
      join('/mock/project', '.repo-standards'),
      expect.any(String),
      'utf-8'
    )
    const written = JSON.parse(writeFile.mock.calls[0][1])
    expect(written).toMatchObject({
      version: '1.0.0',
      installedBundles: ['git-standards'],
      installedAt: expect.any(String),
    })
  })
})

/**
 * @description Tests for the run function
 */
describe('run', () => {
  /**
   * @test
   * @description Confirms nothing is fetched or written when no bundles are selected
   */
  it('does nothing when no bundles are selected', async () => {
    // Arrange
    mockComponentsLoad()
    inquirer.prompt.mockResolvedValueOnce({ selected: [] })

    // Act
    await run()

    // Assert
    expect(fetchDirectory).not.toHaveBeenCalled()
    expect(fetchFile).not.toHaveBeenCalled()
    expect(writeLocalFile).not.toHaveBeenCalled()
  })

  /**
   * @test
   * @description Confirms only selected bundles are fetched and written
   */
  it('fetches and writes only the selected bundles', async () => {
    // Arrange
    mockComponentsLoad()
    inquirer.prompt.mockResolvedValueOnce({ selected: ['git-standards'] })
    fetchDirectory.mockRejectedValueOnce(new Error())
    fetchFile.mockResolvedValueOnce(mockFile)

    // Act
    await run()

    // Assert
    expect(fetchFile).toHaveBeenCalledWith('docs/git-standards/branching-strategy.md')
    expect(writeLocalFile).toHaveBeenCalledWith(mockFile)
    expect(fetchFile).toHaveBeenCalledTimes(1)
  })

  /**
   * @test
   * @description Confirms the lockfile is written after all selected bundles are installed
   */
  it('writes the lockfile after installation completes', async () => {
    // Arrange
    mockComponentsLoad()
    inquirer.prompt.mockResolvedValueOnce({ selected: ['git-standards'] })
    fetchDirectory.mockRejectedValueOnce(new Error())
    fetchFile.mockResolvedValueOnce(mockFile)

    // Act
    await run()

    // Assert
    expect(writeFile).toHaveBeenCalledWith(
      join('/mock/project', '.repo-standards'),
      expect.any(String),
      'utf-8'
    )
  })

  /**
   * @test
   * @description Confirms Select All installs every bundle in the manifest
   */
  it('installs every bundle when Select All is chosen', async () => {
    // Arrange
    mockComponentsLoad()
    inquirer.prompt.mockResolvedValueOnce({ selected: [SELECT_ALL] })
    // all paths fall back to fetchFile — 3 total across both mock bundles
    fetchDirectory.mockRejectedValue(new Error())
    fetchFile.mockResolvedValue(mockFile)

    // Act
    await run()

    // Assert — git-standards (1 path) + github-templates (2 paths) = 3 calls
    expect(fetchFile).toHaveBeenCalledTimes(3)
  })
})
