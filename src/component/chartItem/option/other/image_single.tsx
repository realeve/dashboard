
import React from 'react';
// 此处导入你所需要的自定义组件
import { ProgressBar } from '@/component/widget'; 
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface'; 

import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/26_image_single.json',
  interval: 5,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
  ],
};

export default ({ option: { data, x = 0 }, style }) => {
  let percent = data.data[0][x];
  // 此处像正常的react组件处理，返回对应的信息即可
  return <ProgressBar style={{ width: '100%', height: '100%', ...style }} percent={percent} />;
}; 
  