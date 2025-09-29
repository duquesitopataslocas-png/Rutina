module.exports = {
  preset: 'jest-expo/next',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo-|@expo)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect']
};
