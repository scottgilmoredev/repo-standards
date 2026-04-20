/**
 * File Writer
 *
 * @module
 * @description Writes fetched files into the consumer project directory.
 * Creates missing parent directories, and prompts on conflict rather than
 * overwriting silently.
 */

import { mkdir, writeFile as fsWriteFile, access } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'

import inquirer from 'inquirer'

/**
 * Check whether a file exists at the given absolute path
 *
 * @param {string} absPath - Absolute path to check
 * @returns {Promise<boolean>} True if the file exists
 * @private
 */
const fileExists = async absPath => {
  try {
    await access(absPath)
    return true
  } catch {
    // access throws if the file does not exist — no dedicated exists check in fs/promises
    return false
  }
}

/**
 * Write a single file into the consumer project directory
 *
 * Creates parent directories as needed. If the file already exists, prompts
 * the user to overwrite or skip. New files are written without prompting.
 *
 * @param {{path: string, content: string}} file - Resolved file path and content
 * @param {string} file.path - File path relative to the repository root
 * @param {string} file.content - Decoded file content
 * @returns {Promise<void>}
 */
export const writeFile = async ({ path: filePath, content }) => {
  const cwd = process.cwd()
  const absPath = resolve(cwd, filePath)

  // Guard against path traversal — absolute paths and .. segments both escape cwd via resolve
  if (!absPath.startsWith(cwd + sep)) {
    throw new Error(`Refusing to write outside project root: ${filePath}`)
  }

  const dir = dirname(absPath)

  // recursive: true silently no-ops if the directory already exists
  await mkdir(dir, { recursive: true })

  const exists = await fileExists(absPath)

  if (exists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `${filePath} already exists. Overwrite?`,
        default: false, // safe default — overwrite is destructive
      },
    ])

    if (!overwrite) return
  }

  await fsWriteFile(absPath, content, 'utf-8')
}
