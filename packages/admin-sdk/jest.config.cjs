module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
  modulePathIgnorePatterns: [
    '<rootDir>/cypress/',
  ],
  testMatch: [
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/src/**/*.spec.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!lodash-es)/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.afterEnv.js']
};

