import React from 'react';
import * as lib from '../lib';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import { textColor } from '..';
import jStat from 'jstat';

export let mock: IChartMock = {
  data: [
    ['问题 1', 0.21],
    ['问题 2', 0.4],
    ['问题 3', 0.49],
    ['问题 4', 0.52],
    ['问题 5', 0.53],
    ['问题 6', 0.84],
    ['问题 7', 1],
    ['问题 8', 1.2],
  ],
  title: '弧形柱图_MOCK数据',
  header: ['类型', '值'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '柱状宽度',
    type: 'range',
    min: 10,
    max: 60,
    step: 2,
  },
  {
    key: 'fontSize',
    defaultValue: 16,
    title: '字号',
    type: 'range',
    min: 10,
    max: 60,
    step: 2,
  },
  ...lib.getPositionConfig(),

  {
    key: 'color1',
    defaultValue: '#BAE7FF',
    title: '开始颜色',
    type: 'purecolor',
  },

  {
    key: 'color2',
    defaultValue: '#1150ff',
    title: '结束颜色',
    type: 'purecolor',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/15_bar_polar.json',
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

export default ({
  data: _data,
  x = 0,
  y = 1,
  legendShow = false,
  legendAlign,
  legendPosition,
  legendOrient,
  barWidth = 20,
  fontSize = 16,
  color1 = '#BAE7FF',
  color2 = '#1150ff',
}) => {
  let xData = [],
    yData = [];
  let value = _data.data;
  value.forEach(item => {
    xData.push(item[x]);
    yData.push(item[y]);
  });

  let max = jStat.max(yData);
  let result = lib.handleMinMax({ min: 0, max });

  return {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
    },
    legend: lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    angleAxis: {
      show: false,
      max: result.max,
    },
    radiusAxis: {
      type: 'category',
      data: xData,
      z: 10,
      axisTick: {
        show: false,
      },
      axisLine: { show: false },
      axisLabel: {
        interval: 0,
        color: textColor,
        fontSize,
      },
    },
    polar: {},
    series: [
      {
        name,
        data: yData,
        type: 'bar',
        coordinateSystem: 'polar',
        barWidth,
      },
    ],
    visualMap: {
      min: 0,
      max: max,
      type: 'piecewise',
      splitNumber: xData.length,
      dimension: 1,
      show: false,
      inRange: {
        color: [color1, color2],
      },
    },
  };
};
