import React from 'react';
import { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [
    ['1851', 54],
    ['1852', 57],
    ['1853', 59],
    ['1854', 69],
    ['1855', 71],
    ['1856', 76],
    ['1857', 77],
  ],
  title: '拆线柱图_MOCK数据',
  header: ['year', 'value'],
  rows: 36,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'smooth',
    defaultValue: false,
    title: '平滑曲线',
    type: 'switch',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/02_linebar.json',
  interval: 5,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

export default ({ data: { data }, x = 0, y = 1, smooth = false }) => {
  return {
    chartType: 'line',
    renderer: 'svg',
    smooth,
    data: data,
    xField: x,
    yField: y,
    xAxis: { type: 'category' },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
  };
};
