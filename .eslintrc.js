module.exports = {
  root: true,
  extends: ['expo', 'plugin:react-hooks/recommended', 'prettier'],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
