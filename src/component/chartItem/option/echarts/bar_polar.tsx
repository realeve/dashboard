import React from 'react';
import * as lib from '../lib';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import { textColor } from '..';
import jStat from 'jstat';

import panel from '@/component/echarts/themeColor';

let color = panel.COLOR_PLATE_16;

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
    key: 'roundCap',
    defaultValue: true,
    title: '圆角(需刷新)',
    type: 'switch',
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
  {
    key: 'colorType',
    defaultValue: 'gardient',
    title: '颜色模式',
    type:'radio',
    option: [
      {
        title: '渐变',
        value: 'gardient',
      },
      {
        title: '彩色',
        value: 'palette',
      },
    ],
  },
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

export const defaultOption = {
  renderer: 'svg',
};

export default ({
  data: _data,
  x = 0,
  y = 1,
  barWidth = 20,
  fontSize = 16,
  color1 = '#BAE7FF',
  color2 = '#1150ff',
  roundCap = true,
  colorType = 'gardient',
}) => {
  let xData = [],
    yData = [];
  let value = _data.data;
  value.forEach((item) => {
    xData.push(item[x]);
    yData.push(item[y]);
  });

  let max = jStat.max(yData);
  let result = lib.handleMinMax({ min: 0, max });

  let append =
    colorType === 'gardient'
      ? {
          series: [
            {
              name,
              data: yData,
              type: 'bar',
              coordinateSystem: 'polar',
              barWidth,
              roundCap,
            },
          ],
          visualMap: {
            min: 0,
            max: max,
            type: 'piecewise',
            splitNumber: xData.length,
            dimension: y,
            show: false,
            inRange: {
              color: [color1, color2],
            },
          },
        }
      : {
          series: [
            {
              name,
              data: yData.map((value, idx) => ({
                value,
                itemStyle: {
                  color: color[idx % color.length],
                },
              })),
              type: 'bar',
              coordinateSystem: 'polar',
              barWidth,
              roundCap,
            },
          ],
        };

  return {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
    },
    legend: { show: false },
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
        margin: 25,
        align: 'right',
        interval: 0,
        color: textColor,
        fontSize,
      },
    },
    polar: {},
    ...append,
  };
};
