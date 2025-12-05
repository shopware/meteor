/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true
    }
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