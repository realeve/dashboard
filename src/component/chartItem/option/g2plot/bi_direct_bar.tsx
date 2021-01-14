import type { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';
import * as R from 'ramda';
import * as lib from '@/component/chartItem/option/lib';
import { getTheme } from './lib';

export const mock: IChartMock = {
  data: [
    { country: '乌拉圭', '2016年耕地总面积': 13.4, '2016年转基因种植面积': 12.3 },
    { country: '巴拉圭', '2016年耕地总面积': 14.4, '2016年转基因种植面积': 6.3 },
    { country: '南非', '2016年耕地总面积': 18.4, '2016年转基因种植面积': 8.3 },
    { country: '巴基斯坦', '2016年耕地总面积': 34.4, '2016年转基因种植面积': 13.8 },
    { country: '阿根廷', '2016年耕地总面积': 44.4, '2016年转基因种植面积': 19.5 },
    { country: '巴西', '2016年耕地总面积': 24.4, '2016年转基因种植面积': 18.8 },
    { country: '加拿大', '2016年耕地总面积': 54.4, '2016年转基因种植面积': 24.7 },
    { country: '中国', '2016年耕地总面积': 104.4, '2016年转基因种植面积': 5.3 },
    { country: '美国', '2016年耕地总面积': 165.2, '2016年转基因种植面积': 72.9 },
  ],
  title: '拆线柱图_MOCK数据',
  header: ['country', '2016年耕地总面积', '2016年转基因种植面积'],
  rows: 36,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'renderer',
    defaultValue: 'svg',
    title: '图表引擎',
    type: 'radio',
    option: 'canvas,svg',
  },
  lib.getAntThemePanel(),
  {
    key: 'direction',
    title: '图表布局',
    type: 'radio',
    defaultValue: 'vertical',
    option: [
      {
        title: '横向',
        value: 'vertical',
      },
      {
        title: '纵向',
        value: 'horizontal',
      },
    ],
  },
  ...lib.getLegendConfig(),
  {
    type: 'label',
    title: 'Y轴最大值变更需刷新页面',
  },
  {
    key: 'limitYaxis',
    defaultValue: true,
    title: '约束Y轴最大值',
    type: 'switch',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/35_bi_direct_bar.json',
  interval: 5,
  cache: 2,
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
    {
      key: 'y2',
      title: 'y2 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

/**
 * 获取指定键的最大值(此处未考虑负数)
 * @param data 数组
 * @param key 键
 */
export const getMaxByKey = (data, key) => {
  const arr = R.pluck(key)(data);
  const max = Math.max(...arr);
  return max;
};

/**
 *
 * 获取指定键的最大值(此处未考虑负数)
 * @param data 数组
 * @param keys 键值对
 */
export const getMaxByKeys = (data, keys) => {
  const arr = keys.map((key) => getMaxByKey(data, key));
  const max = Math.max(...arr);
  const val = lib.getMax(max);
  const yAxis = {};
  keys.forEach((key) => {
    yAxis[key] = {
      min: 0,
      max: val,
      grid: { line: null },
    };
  });
  return { yAxis };
};

export type IBidirectionalBar = {
  x: number;
  y: number;
  y2: number;
  direction: 'horizontal' | 'vertical';
  limitYaxis?: boolean;
} & IG2PlotProps;
export default ({
  data: { data, header },
  x = 0,
  y = 1,
  y2 = 2,
  direction = 'horizontal',
  renderer = 'svg',
  limitYaxis = true,
  theme = 18,
  legendShow = true,
  legendAlign,
  legendPosition,
  legendOrient,
}: IBidirectionalBar) => {
  const yField = [header[y], header[y2]];
  const yAxis = limitYaxis ? getMaxByKeys(data, yField) : {};

  const distTheme = getTheme(theme);

  return {
    ...distTheme,
    renderer,
    chartType: 'bidirectional_bar',
    data,
    xField: header[x],
    yField,
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    xAxis: {
      position: 'bottom',
    },
    label: {
      position: (e) => {
        if (direction === 'vertical') {
          return e.type === header[y] ? 'top' : 'middle';
        }
        return e.type === header[y2] ? 'right' : 'middle';
        // return direction === 'vertical'
        //   ? e.type === header[y]
        //     ? 'top'
        //     : 'middle'
        //   : e.type === header[y2]
        //   ? 'right'
        //   : 'middle';
      },
      style: {
        fill: '#ddd',
      },
    },
    ...yAxis,
    layout: direction,
    interactions: [{ type: 'active-region' }],
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };
};
