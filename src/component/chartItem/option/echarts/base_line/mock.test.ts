import * as lib from './mock';

test('数据模拟', () => {
  expect(lib.apiConfig).toMatchSnapshot();
  expect(lib.config).toMatchSnapshot();
  expect(lib.defaultOption).toMatchSnapshot();
  expect(lib.mock).toMatchSnapshot();
});
