const eslint = require('@eslint/js');
const globals = require('globals');
const typescriptEslint = require('typescript-eslint');

module.exports = typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
