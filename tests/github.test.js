/**
 * GitHub Contents API Client Tests
 *
 * @module
 * @description Unit tests for the GitHub Contents API client.
 * Covers file fetching, directory resolution, authentication, and error handling.
 */

import { OWNER, REPO } from '../src/constants.js'
import { fetchFile, fetchDirectory } from '../src/github.js'

// ============================================================================
// FIXTURES
// ============================================================================

const mockFileResponse = {
  type: 'file',
  path: 'docs/git-standards/branching-strategy.md',
  content: Buffer.from('# Branching Strategy').toString('base64'),
  encoding: 'base64',
}

const mockNestedDirectoryResponse = [
  {
    type: 'dir',
    path: '.github/ISSUE_TEMPLATE/nested',
    url: `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github/ISSUE_TEMPLATE/nested`,
  },
]

const mockNestedDirContents = [
  {
    type: 'file',
    path: '.github/ISSUE_TEMPLATE/nested/example.md',
    url: `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github/ISSUE_TEMPLATE/nested/example.md`,
  },
]

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Create a mock fetch response
 *
 * @param {object} data - Response data to return from json()
 * @returns {object} Mock fetch response object
 */
const mockFetchResponse = data => ({
  ok: true,
  json: async () => data,
})

// ============================================================================
// TESTS
// ============================================================================

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
  delete process.env.GITHUB_TOKEN
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/**
 * @description Tests for the fetchFile function
 */
describe('fetchFile', () => {
  /**
   * @test
   * @description Confirms decoded file content is returned with the correct path
   */
  it('returns decoded file content with the correct path', async () => {
    // Arrange
    fetch.mockResolvedValueOnce(mockFetchResponse(mockFileResponse))

    // Act
    const result = await fetchFile('docs/git-standards/branching-strategy.md')

    // Assert
    expect(result).toEqual({
      path: 'docs/git-standards/branching-strategy.md',
      content: '# Branching Strategy',
    })
  })

  /**
   * @test
   * @description Confirms Authorization header is included when GITHUB_TOKEN is set
   */
  it('includes Authorization header when GITHUB_TOKEN is set', async () => {
    // Arrange
    process.env.GITHUB_TOKEN = 'test-token'
    fetch.mockResolvedValueOnce(mockFetchResponse(mockFileResponse))

    // Act
    await fetchFile('docs/git-standards/branching-strategy.md')

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })

  /**
   * @test
   * @description Confirms requests proceed without Authorization header when GITHUB_TOKEN is absent
   */
  it('makes unauthenticated requests when GITHUB_TOKEN is absent', async () => {
    // Arrange
    fetch.mockResolvedValueOnce(mockFetchResponse(mockFileResponse))

    // Act
    await fetchFile('docs/git-standards/branching-strategy.md')

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    )
  })

  /**
   * @test
   * @description Confirms a failed request throws an error identifying the file path
   */
  it('throws an error identifying the file path on a failed request', async () => {
    // Arrange
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    // Act + Assert
    await expect(fetchFile('docs/git-standards/branching-strategy.md')).rejects.toThrow(
      'docs/git-standards/branching-strategy.md'
    )
  })
})

/**
 * @description Tests for the fetchDirectory function
 */
describe('fetchDirectory', () => {
  /**
   * @test
   * @description Confirms a flat list of resolved files is returned for a directory
   */
  it('returns a flat list of resolved files from a directory', async () => {
    const mockBugFileResponse = {
      ...mockFileResponse,
      path: '.github/ISSUE_TEMPLATE/bug.md',
      content: Buffer.from('# Bug').toString('base64'),
    }

    const mockDirectoryResponse = [
      {
        type: 'file',
        path: '.github/ISSUE_TEMPLATE/bug.md',
        url: `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github/ISSUE_TEMPLATE/bug.md`,
      },
      {
        type: 'file',
        path: '.github/ISSUE_TEMPLATE/feature.md',
        url: `https://api.github.com/repos/${OWNER}/${REPO}/contents/.github/ISSUE_TEMPLATE/feature.md`,
      },
    ]

    const mockFeatureFileResponse = {
      ...mockFileResponse,
      path: '.github/ISSUE_TEMPLATE/feature.md',
      content: Buffer.from('# Feature').toString('base64'),
    }

    // Arrange
    fetch
      .mockResolvedValueOnce(mockFetchResponse(mockDirectoryResponse))
      .mockResolvedValueOnce(mockFetchResponse(mockBugFileResponse))
      .mockResolvedValueOnce(mockFetchResponse(mockFeatureFileResponse))

    // Act
    const results = await fetchDirectory('.github/ISSUE_TEMPLATE')

    // Assert
    expect(results).toHaveLength(2)
    expect(results).toEqual([
      { path: '.github/ISSUE_TEMPLATE/bug.md', content: '# Bug' },
      { path: '.github/ISSUE_TEMPLATE/feature.md', content: '# Feature' },
    ])
  })

  /**
   * @test
   * @description Confirms nested directories are recursively resolved into a flat list
   */
  it('recursively resolves nested directories into a flat list', async () => {
    const mockNestedExampleFileResponse = {
      ...mockFileResponse,
      path: '.github/ISSUE_TEMPLATE/nested/example.md',
      content: Buffer.from('# Nested Example').toString('base64'),
    }

    // Arrange
    fetch
      .mockResolvedValueOnce(mockFetchResponse(mockNestedDirectoryResponse))
      .mockResolvedValueOnce(mockFetchResponse(mockNestedDirContents))
      .mockResolvedValueOnce(mockFetchResponse(mockNestedExampleFileResponse))

    // Act
    const results = await fetchDirectory('.github/ISSUE_TEMPLATE')

    // Assert
    expect(results).toHaveLength(1)
    expect(results).toContainEqual({
      path: '.github/ISSUE_TEMPLATE/nested/example.md',
      content: '# Nested Example',
    })
  })

  /**
   * @test
   * @description Confirms a failed request throws an error identifying the directory path
   */
  it('throws an error identifying the directory path on a failed request', async () => {
    // Arrange
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    // Act + Assert
    await expect(fetchDirectory('.github/ISSUE_TEMPLATE')).rejects.toThrow('.github/ISSUE_TEMPLATE')
  })
})
