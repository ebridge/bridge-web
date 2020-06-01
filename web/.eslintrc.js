module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': [2, { code: 120, tabWidth: 4, ignoreUrls: true }],
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'react/react-in-jsx-scope': 'off',
    'class-methods-use-this': 'off',
    'react/prop-types': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'no-restricted-syntax': ['error', 'WithStatement', 'BinaryExpression[operator='in']'],
    'arrow-parens': 0,
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
};
