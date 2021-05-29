module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'prettier',
    'prettier/react',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
    'prettier/prettier': 0,
    'react/jsx-props-no-spreading': 'off',
    'no-param-reassign': 0,
    'react/prop-types': 0,
    indent: 0,
    'jsx-a11y/anchor-is-valid': 0,
    'consistent-return': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'no-alert': 0,
    'no-empty-function': 0,
  },
};
