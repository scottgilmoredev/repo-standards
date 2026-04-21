#!/usr/bin/env node

/**
 * CLI Entry Point
 *
 * @module
 * @description Orchestrates the repo-standards install flow: loads the bundle
 * manifest, prompts the user to select bundles, fetches and writes selected
 * files, and writes a .repo-standards lockfile on completion.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import inquirer from 'inquirer'

import { fetchDirectory, fetchFile } from './github.js'
import { writeFile as writeLocalFile } from './writer.js'

/** @type {string} Sentinel value for the Select All checkbox option */
export const SELECT_ALL = '__select_all__'

/**
 * Load and parse the components.json bundle manifest
 *
 * @returns {Promise<{version: string, bundles: object}>} Parsed manifest
 */
export const loadComponents = async () => {
  // resolve relative to this file, not cwd — components.json ships with the package
  const dir = dirname(fileURLToPath(import.meta.url))
  const raw = await readFile(join(dir, '..', 'components.json'), 'utf-8')
  return JSON.parse(raw)
}

/**
 * Build inquirer checkbox choices from the bundle manifest
 *
 * @param {object} bundles - Bundles map from components.json
 * @returns {Array<{name: string, value: string}>} Choices array with Select All first
 */
export const buildChoices = bundles => [
  { name: 'Select All', value: SELECT_ALL },
  ...Object.entries(bundles).map(([name, bundle]) => ({
    name: `${name} — ${bundle.description}`,
    value: name,
  })),
]

/**
 * Prompt the user to select bundles via an interactive checkbox
 *
 * @param {Array} choices - Inquirer choices array
 * @param {object} bundles - Bundles map, used to expand Select All
 * @returns {Promise<string[]>} Selected bundle names
 * @private
 */
const promptBundles = async (choices, bundles) => {
  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select documentation bundles to install:',
      choices,
    },
  ])

  // Select All expands to every bundle name in the manifest
  if (selected.includes(SELECT_ALL)) {
    return Object.keys(bundles)
  }

  return selected
}

/**
 * Fetch all files for a list of bundle paths
 *
 * Tries fetchDirectory first; falls back to fetchFile for plain file paths.
 * The GitHub API returns an array for directories and an object for files —
 * fetchDirectory throws when it receives an object with no .map method.
 *
 * @param {string[]} paths - File or directory paths from the bundle manifest
 * @returns {Promise<Array<{path: string, content: string}>>} Flat list of resolved files
 */
export const fetchBundlePaths = async paths => {
  const results = await Promise.all(
    paths.map(async path => {
      try {
        return await fetchDirectory(path)
      } catch {
        return [await fetchFile(path)]
      }
    })
  )
  return results.flat()
}

/**
 * Write the .repo-standards lockfile to the consumer project root
 *
 * @param {string} version - Bundle manifest version
 * @param {string[]} bundleNames - Names of installed bundles
 * @returns {Promise<void>}
 */
export const writeLockfile = async (version, bundleNames) => {
  const lockfile = {
    version,
    installedBundles: bundleNames,
    installedAt: new Date().toISOString(),
  }
  await writeFile(
    join(process.cwd(), '.repo-standards'),
    JSON.stringify(lockfile, null, 2),
    'utf-8'
  )
}

/**
 * Run the repo-standards interactive install flow
 *
 * @returns {Promise<void>}
 */
export const run = async () => {
  const { version, bundles } = await loadComponents()
  const choices = buildChoices(bundles)
  const selected = await promptBundles(choices, bundles)

  if (selected.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No bundles selected. Nothing installed.')
    return
  }

  for (const name of selected) {
    const files = await fetchBundlePaths(bundles[name].paths)
    for (const file of files) {
      await writeLocalFile(file)
    }
  }

  await writeLockfile(version, selected)
  // eslint-disable-next-line no-console
  console.log(`Installed ${selected.length} bundle(s). Lockfile written to .repo-standards`)
}

if (realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run()
}
