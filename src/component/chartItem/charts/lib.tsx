// eslint-disable-next-line
import React from 'react';
import { getDefaultValue } from '@/pages/config/canvas/lib';

export default (file: string) => {
  let moduleName: string | null = file.match(/charts(.*)+.test./)[1];
  if (!moduleName) {
    console.log(file);
    return;
  }
  moduleName = moduleName.replace(/\\/, '');
  // eslint-disable-next-line
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

  test('默认配置项测试', () => {
    if (!lib.mock || !lib.default) {
      return;
    }
    const config = getDefaultValue(lib?.config || []);
    const apiConfig = getDefaultValue(lib?.apiConfig?.config || []);

    const option = { data: lib.mock, ...config, ...apiConfig };

    // 以默认mock数据作为配置,默认config,apiConfig作为设置项，计算生成的option内容
    try {
      expect(lib.default({ option, ...option })).toMatchSnapshot();
    } catch (e) {
      console.log(`${moduleName}组件默认导出测试错误`);
      console.log(e);
    }
  });
};
