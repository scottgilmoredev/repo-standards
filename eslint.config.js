import js from '@eslint/js'
import importX from 'eslint-plugin-import-x'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['node_modules', 'coverage'],
  },
  js.configs.recommended,
  importX.flatConfigs.recommended,
  {
    files: ['vitest.config.js'],
    rules: {
      'import-x/no-unresolved': 'off',
    },
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'import-x/order': ['error', { 'newlines-between': 'always' }],
      'import-x/no-duplicates': 'error',
    },
  },
])
