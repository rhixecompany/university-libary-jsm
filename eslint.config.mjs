import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
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
      // // 'tailwindcss/no-custom-classname': 'error',
      // '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      // '@typescript-eslint/no-explicit-any': 'off',
      // 'zod/require-strict': 2,
      // 'react/no-unescaped-entities': 'off',
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
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }),
]

export default eslintConfig
