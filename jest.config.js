let ignoreFiles = [
  '<rootDir>/src/app.ts',
  '<rootDir>/src/component/Editor/',
  '<rootDir>/src/component/chartItem/charts/',
  '<rootDir>/(.*).min.js$',
  '<rootDir>/(.*)interface.ts(|x)$',
];
module.exports = {
  testURL: 'http://localhost:8000',
  collectCoverage: true,
  coverageReporters: ['text-lcov'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ignoreFiles,
  coveragePathIgnorePatterns: ignoreFiles,
};
