/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // libs that ship untranspiled ES modules must be listed here
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|tailwindcss)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/integration/',
    '/tests/e2e/',
  ],
  // ---------------------------------------------------------------------------
  // Future project structure (uncomment and fill in when adding integration/E2E)
  // ---------------------------------------------------------------------------
  // projects: [
  //   {
  //     displayName: 'unit',
  //     testMatch: ['**/*.test.ts?(x)'],
  //     testPathIgnorePatterns: ['/node_modules/', '/tests/integration/', '/tests/e2e/'],
  //   },
  //   {
  //     displayName: 'integration',
  //     testMatch: ['**/tests/integration/**/*.test.ts?(x)'],
  //   },
  //   {
  //     displayName: 'e2e',
  //     testMatch: ['**/tests/e2e/**/*.test.ts?(x)'],
  //   },
  // ],
};

module.exports = config;
