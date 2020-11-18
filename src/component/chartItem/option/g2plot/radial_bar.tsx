import React from 'react';
import { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [
    ['Zombieland', 9],
    ['Wieners', 8],
    ['Toy Story', 8],
    ['trashkannon', 7],
    ['the GROWLERS', 6],
    ['mudweiser', 6],
    ['ThunderCats', 4],
    ['The Taqwacores - Motion Picture', 4],
    ['The Shawshank Redemption', 2],
    ['The Olivia Experiment', 1],
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
export const defaultOption = { renderer: 'svg' };

/**
 * 玉珏图，参照 https://antv-g2plot.gitee.io/zh/examples/radial-bar/basic#line
 * 目前版本的 g2 plot渲染结果同官方不一致
 */
export default ({ data: { data }, x = 0, y = 1 }) => {
  return {
    renderer: 'svg',
    chartType: 'radial_bar',
    data: data,
    xField: x,
    yField: y,
    radius: 0.8,
    innerRadius: 0.2,
    tooltip: {
      showMarkers: true,
    },
    type: 'line',
  };
};
