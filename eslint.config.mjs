import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

const tsRecommended = tsPlugin.configs.recommended.rules ?? {};
const tsStrict = tsPlugin.configs['recommended-type-checked']?.rules ?? {};
const hooksRecommended = reactHooks.configs.recommended.rules ?? {};

export default [
  {
    ignores: ['**/node_modules/**', '**/.expo/**', 'dist/**', 'build/**']
  },
  {
    files: ['app/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url),
        ecmaVersion: 2021,
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsRecommended,
      ...tsStrict,
      ...hooksRecommended,
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];
