import * as lib from './config';

test('基础线型图配置项', () => {
  expect(lib.config).toMatchSnapshot();
});
