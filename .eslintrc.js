module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    JSX: true,
    React: true,
  },
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],

  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'import',
    'eslint-plugin-no-inline-styles',
    'react-hooks',
    'jest',
  ],
  rules: {
    'indent': [0, 2, { SwitchCase: 1 }],
    'linebreak-style': 0,
    'quotes': ['error', 'single', { avoidEscape: true }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'off',
    'no-empty-function': 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
    'import/export': 'error',
    'import/first': 'error',
    'import/no-cycle': 'error',
    'import/no-deprecated': 'warn',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/no-mutable-exports': 'error',
    'import/no-unused-modules': 'warn',
    'import/no-useless-path-segments': 'warn',
    'no-console': 'error',
    'import/order': [
      'warn',
      {
        'alphabetize': {
          caseInsensitive: true,
          order: 'asc',
        },
        'groups': [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': ['builtin', 'object'],
      },
    ],
    'import/prefer-default-export': 'off',
    'no-inline-styles/no-inline-styles': 1,
  },
  settings: {
    'react': {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
    'import/ignore': ['node_modules(\\\\|/)react-native(\\\\|/)index\\.js$'],
  },

  overrides: [
    {
      files: ['.ts', '.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        'indent': [0, 2, { SwitchCase: 1 }],
        'linebreak-style': 0,
        'quotes': ['error', 'single', { avoidEscape: true }],
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'import/export': 'error',
        'import/first': 'error',
        'import/no-cycle': 'error',
        'import/no-deprecated': 'warn',
        'import/no-duplicates': 'error',
        'import/no-extraneous-dependencies': 'off',
        'import/no-mutable-exports': 'error',
        'import/no-unused-modules': 'warn',
        'import/no-useless-path-segments': 'warn',
        'no-console': 'error',
        'import/order': [
          'warn',
          {
            'alphabetize': {
              caseInsensitive: true,
              order: 'asc',
            },
            'groups': [
              ['builtin', 'external'],
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            'newlines-between': 'always',
            'pathGroupsExcludedImportTypes': ['builtin', 'object'],
          },
        ],
        'import/prefer-default-export': 'off',
        'no-inline-styles/no-inline-styles': 1,
      },
      settings: {
        'react': {
          version: 'detect',
        },
        'import/resolver': {
          typescript: {},
        },
        'import/ignore': [
          'node_modules(\\\\|/)react-native(\\\\|/)index\\.js$',
        ],
      },
    },
  ],
};
