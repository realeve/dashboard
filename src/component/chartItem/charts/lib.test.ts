import { getDefaultValue } from '@/pages/config/canvas/lib';

export default (file: string) => {
  const moduleName: string | null = file.match(/charts(.*)+.test./)[1];
  if (!moduleName) {
    console.log(file);
    return;
  }
  const { default: lib } = require(`./${moduleName}`);

  test('基础信息测试-模拟数据', () => {
    lib.mock && expect(lib.mock.rows).toBeGreaterThan(0);
  });

  test('基础信息测试-默认配置项', () => {
    lib.config && expect(getDefaultValue(lib.config)).toMatchSnapshot();
  });

  test('基础信息测试-API配置项', () => {
    lib.apiConfig?.config && expect(getDefaultValue(lib.apiConfig.config)).toMatchSnapshot();
  });

  test('基础信息测试-默认渲染设置/边距', () => {
    lib.defaultOption && expect(lib.defaultOption).toMatchSnapshot();
  });
};
