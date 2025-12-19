import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'generated/**',
      'prisma/generated/**',
      '*.config.js',
      '.*.js',
      'scripts/**',
      'husky/**',
      '.husky/**',
      '!.husky/pre-commit',
      '!.husky/commit-msg',
      '!.husky/pre-push',
      '.package-lock.json',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'warn',
      eqeqeq: 'off',
      curly: ['error', 'all'],
    },
  },
  eslintConfigPrettier
);
