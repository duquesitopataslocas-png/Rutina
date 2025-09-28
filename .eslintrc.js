module.exports = {
  root: true,
  extends: ['@react-native/eslint-config', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  }
};
