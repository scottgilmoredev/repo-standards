/**
 * File Writer Tests
 *
 * @module
 * @description Unit tests for the file writer module.
 * Covers directory creation, file writing, existence checks, and overwrite prompting.
 */

import { mkdir, writeFile as fsWriteFile, access } from 'node:fs/promises'
import { join } from 'node:path'

import inquirer from 'inquirer'

import { writeFile } from '../src/writer.js'

vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  access: vi.fn(),
}))

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}))

// ============================================================================
// FIXTURES
// ============================================================================

const mockFile = {
  path: 'docs/contributing.md',
  content: '# Contributing',
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Simulate a file that does not exist
 *
 * @returns {void}
 */
// access throws on a missing file — rejection mirrors real fs behavior
const mockFileNotExists = () => access.mockRejectedValueOnce(new Error('ENOENT'))

/**
 * Simulate a file that already exists
 *
 * @returns {void}
 */
const mockFileExists = () => access.mockResolvedValueOnce(undefined)

// ============================================================================
// TESTS
// ============================================================================

beforeEach(() => {
  vi.spyOn(process, 'cwd').mockReturnValue('/mock/project')
  // resetAllMocks in afterEach clears these — re-apply defaults each test
  mkdir.mockResolvedValue(undefined)
  fsWriteFile.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

/**
 * @description Tests for the writeFile function
 */
describe('writeFile', () => {
  /**
   * @test
   * @description Confirms parent directories are created before writing
   */
  it('creates parent directories before writing', async () => {
    // Arrange
    mockFileNotExists()

    // Act
    await writeFile(mockFile)

    // Assert
    expect(mkdir).toHaveBeenCalledWith(join('/mock/project', 'docs'), { recursive: true })
  })

  /**
   * @test
   * @description Confirms the file is written at the correct path relative to cwd
   */
  it('writes the file at the correct path relative to cwd', async () => {
    // Arrange
    mockFileNotExists()

    // Act
    await writeFile(mockFile)

    // Assert
    expect(fsWriteFile).toHaveBeenCalledWith(
      join('/mock/project', 'docs/contributing.md'),
      '# Contributing',
      'utf-8'
    )
  })

  /**
   * @test
   * @description Confirms new files are written without prompting the user
   */
  it('writes new files without prompting', async () => {
    // Arrange
    mockFileNotExists()

    // Act
    await writeFile(mockFile)

    // Assert
    expect(inquirer.prompt).not.toHaveBeenCalled()
  })

  /**
   * @test
   * @description Confirms the user is prompted before an existing file is overwritten
   */
  it('prompts before overwriting an existing file', async () => {
    // Arrange
    mockFileExists()
    inquirer.prompt.mockResolvedValueOnce({ overwrite: false })

    // Act
    await writeFile(mockFile)

    // Assert
    expect(inquirer.prompt).toHaveBeenCalled()
  })

  /**
   * @test
   * @description Confirms the file is written when the user confirms the overwrite
   */
  it('overwrites the file when the user confirms', async () => {
    // Arrange
    mockFileExists()
    inquirer.prompt.mockResolvedValueOnce({ overwrite: true })

    // Act
    await writeFile(mockFile)

    // Assert
    expect(fsWriteFile).toHaveBeenCalled()
  })

  /**
   * @test
   * @description Confirms the file is skipped when the user declines to overwrite
   */
  it('skips writing when the user declines to overwrite', async () => {
    // Arrange
    mockFileExists()
    inquirer.prompt.mockResolvedValueOnce({ overwrite: false })

    // Act
    await writeFile(mockFile)

    // Assert
    expect(fsWriteFile).not.toHaveBeenCalled()
  })

  /**
   * @test
   * @description Confirms paths that escape the project root are rejected
   */
  it('throws when path resolves outside the project root', async () => {
    // Arrange — .. segments escape cwd after resolve normalizes them
    const traversalFile = { path: '../../etc/passwd', content: 'x' }

    // Act + Assert
    await expect(writeFile(traversalFile)).rejects.toThrow('outside project root')
  })
})
