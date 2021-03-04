let ignoreFiles = [
  '<rootDir>/src/app.ts',
  '<rootDir>/src/component/Editor/',
  '<rootDir>/src/component/chartItem/charts/',
  '<rootDir>/(.*).min.js$',
  '<rootDir>/(.*)interface.ts(|x)$',
];

/**
 * 判断当前测试模式
 */
const args = process.argv.slice(3);
const isOnline = args.find((item) => item.includes('--online'));
const reporters = isOnline ? { coverageReporters: ['text-lcov'] } : {};

module.exports = {
  testURL: 'http://localhost:8000',
  collectCoverage: true,
  ...reporters,
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ignoreFiles,
  coveragePathIgnorePatterns: ignoreFiles,
};
