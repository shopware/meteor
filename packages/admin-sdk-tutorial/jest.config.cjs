module.exports = {
  rootDir: __dirname,
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/jest/**/*.spec.ts"],
  collectCoverageFrom: ["<rootDir>/src/catalog/normalizeCatalog.ts"],
  coverageDirectory: "<rootDir>/node_modules/.tmp/jest-coverage",
  modulePathIgnorePatterns: [
    "<rootDir>/coverage/",
    "<rootDir>/playwright-report/",
    "<rootDir>/test-results/",
  ],
  transform: {
    "^.+\\.ts$": [
      "babel-jest",
      {
        presets: ["@babel/preset-typescript"],
        plugins: ["@babel/plugin-transform-modules-commonjs"],
      },
    ],
  },
};
