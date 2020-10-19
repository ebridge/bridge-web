module.exports = {
  env: {
    node: true,
    browser: false,
    commonjs: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb/base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
  },
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
    'no-restricted-syntax': ['error', 'WithStatement', 'BinaryExpression[operator=\'in\']'],
    'arrow-parens': 0,
  },
};
