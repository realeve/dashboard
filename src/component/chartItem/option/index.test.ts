import * as lib from './index';

// umi test ./src/component/chartItem/option/index.test.ts
test('基础配置', () => {
  expect(lib.textColor).toMatchSnapshot();
  expect(lib.chartList).toMatchSnapshot();
});
