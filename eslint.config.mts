import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'dist/',
      'build/',
      'coverage/',
      '.eslintcache',
      '.nyc_output/',
    ],
  },
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'next',
      'prettier',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'zod/require-strict': 2,
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    plugins: ['@typescript-eslint', 'drizzle', 'zod', 'react', 'jsx-a11y'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  }),
  {
    // Enable type-aware linting for TS/TSX files (tsconfig project).
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    // JS/TS config files (postcss.config.mjs etc.) are not part of any
    // tsconfig project; disable type-aware linting for them.
    files: ['**/*.config.{js,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
]

export default eslintConfig
