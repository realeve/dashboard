import React from 'react';

import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
export { mock } from './mock';

import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';

import TrendChart from './TrendChart';

export const config: IChartConfig[] = [];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/39_trend_card.json',
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
  return <TrendChart data={data} />;
};
