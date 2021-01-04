module.exports = {
  testURL: 'http://localhost:8000',
  collectCoverage: true,
  // coverageReporters: ['text-lcov'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
};
