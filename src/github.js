/**
 * GitHub Contents API Client
 *
 * @module
 * @description Fetches file content and resolves directory paths from the
 * GitHub Contents API. Respects GITHUB_TOKEN if present in the environment.
 */

import { BASE_URL } from './constants.js'

/**
 * Build a GitHub Contents API URL
 *
 * @param {string} path - Path relative to the repository root
 * @returns {string} Full API URL
 * @private
 */
const buildUrl = path => `${BASE_URL}/${path}`

/**
 * Build request headers
 *
 * @returns {Record<string, string>} Headers object
 * @private
 */
const buildHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

/**
 * Make a request to the GitHub Contents API
 *
 * @param {string} path - Path relative to the repository root
 * @returns {Promise<object|Array>} Parsed JSON response
 * @throws {Error} If the request fails, with the path identified in the message
 * @private
 */
const fetchFromApi = async path => {
  let response

  try {
    response = await fetch(buildUrl(path), {
      headers: buildHeaders(),
    })
  } catch (err) {
    throw new Error(`Failed to fetch: ${path}`, { cause: err })
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${path} (status ${response.status})`)
  }

  return response.json()
}

/**
 * Fetch a single file from the GitHub Contents API
 *
 * @param {string} path - File path relative to the repository root
 * @returns {Promise<{path: string, content: string}>} Resolved file path and decoded content
 * @throws {Error} If the request fails, with the file path identified in the message
 */
export const fetchFile = async path => {
  const response = await fetchFromApi(path)

  return {
    path: response.path,
    content: Buffer.from(response.content, 'base64').toString('utf-8'),
  }
}

/**
 * Fetch and recursively resolve a directory from the GitHub Contents API
 *
 * @param {string} path - Directory path relative to the repository root
 * @returns {Promise<Array<{path: string, content: string}>>} Flat array of resolved files
 * @throws {Error} If the request fails, with the directory path identified in the message
 */
export const fetchDirectory = async path => {
  const response = await fetchFromApi(path)
  const results = await Promise.all(
    response.map(entry => {
      if (entry.type === 'file') {
        return fetchFile(entry.path)
      }

      if (entry.type === 'dir') {
        return fetchDirectory(entry.path)
      }

      // Unknown entry type — return empty array to be flattened away
      // eslint-disable-next-line no-console
      console.warn(`Skipping unknown entry type: ${entry.type} at ${entry.path}`)
      return []
    })
  )

  return results.flat()
}
