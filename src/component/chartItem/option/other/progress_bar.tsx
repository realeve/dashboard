import React from 'react';
import { ProgressBar } from '@/component/widget';

import { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config = [];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/04_progress_bar.json',
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
  return <ProgressBar style={{ width: '100%', height: '100%', ...style }} percent={percent} />;
};
