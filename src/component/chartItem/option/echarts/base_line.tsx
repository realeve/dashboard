import React from 'react';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import { handleData } from '@/component/chartItem/option/echarts/line';

import * as lib from '@/component/chartItem/option/lib';
import { getColors } from '../g2plot/lib';

export let mock: IChartMock = {
  data: [
    ['类目1', '1月', 175],
    ['类目2', '1月', 210],
    ['类目1', '2月', 125],
    ['类目2', '2月', 140],
    ['类目1', '3月', 98],
    ['类目2', '3月', 120],
    ['类目1', '4月', 120],
    ['类目2', '4月', 140],
    ['类目1', '5月', 50],
    ['类目2', '5月', 60],
  ],
  title: '某数据_MOCK数据',
  header: ['月份', '类型', '交易发生值'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  lib.getAntThemePanel(),
  {
    key: 'needRerverse',
    defaultValue: false,
    title: '翻转颜色表',
    type: 'switch',
  },
  {
    key: 'chartType',
    defaultValue: 'line',
    title: '图表类型',
    type: 'radio',
    option: [
      {
        title: '柱状图',
        value: 'bar',
      },
      {
        title: '曲线图',
        value: 'line',
      },
    ],
  },
  {
    key: 'isPolar',
    defaultValue: false,
    type: 'switch',
    title: '极坐标系',
  },
  {
    key: 'isArea',
    defaultValue: false,
    type: 'switch',
    title: '面积图',
  },
  {
    key: 'isStack',
    defaultValue: false,
    type: 'switch',
    title: '堆叠',
  },
  {
    key: 'isStep',
    defaultValue: false,
    type: 'radio',
    title: '阶梯图',
    option: [
      {
        title: '起始点',
        value: 'start',
      },
      {
        title: '中间点',
        value: 'middle',
      },
      {
        title: '结束点',
        value: 'end',
      },
      {
        title: '关闭',
        valud: false,
      },
    ],
  },
  {
    key: 'showLabel',
    defaultValue: false,
    type: 'switch',
    title: '显示标签',
  },
  {
    key: 'isReverse',
    defaultValue: false,
    type: 'switch',
    title: '交换XY轴',
  },
  {
    type: 'divider',
    title: '数据点标记设置(曲线图有效)',
  },
  {
    key: 'showSymbol',
    defaultValue: false,
    type: 'switch',
    title: '显示',
  },
  {
    key: 'symbolSize',
    defaultValue: 4,
    title: '大小',
    type: 'range',
    min: 0,
    max: 40,
    step: 1,
  },
  {
    key: 'symbol',
    defaultValue: 'circle',
    title: '形状',
    type: 'select',
    option: 'circle,rect,roundRect,triangle,diamond,pin,arrow,none',
  },
  ...lib.getPositionConfig(),
  {
    type: 'divider',
    title: '柱状图设置',
  },
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '宽度',
    type: 'range',
    min: 10,
    max: 40,
    step: 2,
  },
  {
    key: 'showBackground',
    defaultValue: true,
    type: 'switch',
    title: '显示背景',
  },
  {
    key: 'barBackgroundColor',
    defaultValue: 'rgba(140,150,200,0.2)',
    type: 'purecolor',
    title: '背景颜色',
  },
  {
    key: 'roundCap',
    defaultValue: false,
    type: 'switch',
    title: '极坐标柱形圆弧效果',
  },

  { type: 'label' },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/34_base_line.json',
  interval: 5,
  config: [
    {
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

export const defaultOption = {
  renderer: 'svg',
};

const getAxisName = ({ isReverse, isPolar, type = 'x' }) => {
  let arr = ['xAxis', 'yAxis', 'angleAxis', 'radiusAxis'];
  if (!isPolar) {
    return isReverse ? (type == 'x' ? arr[0] : arr[1]) : type == 'x' ? arr[1] : arr[0];
  }
  return isReverse ? (type == 'x' ? arr[2] : arr[3]) : type == 'x' ? arr[3] : arr[2];
};

export default ({
  data,
  legend = 0,
  x = 1,
  y = 2,
  theme = 18,
  needRerverse,
  chartType,
  isArea,
  isStep = false,
  isPolar,
  isStack,
  smooth = true,
  isReverse = false,
  legendShow = true,
  showBackground,
  barBackgroundColor,
  showLabel,
  legendAlign,
  legendPosition,
  legendOrient,
  area_opacity = 1,
  lineWidth = 8,
  barWidth,
  showSymbol,
  symbol,
  symbolSize,
  roundCap,
}) => {
  if (String(legend) == '') {
    return {};
  }
  let res = handleData(data, { legend, x, y });

  let series = res.series.map(({ name, arr: data }) => ({
    name,
    coordinateSystem: isPolar ? 'polar' : 'cartesian2d',
    data: isReverse ? data.reverse() : data,
    stack: isStack,
    type: chartType,
    step: isStep,
    smooth,
    lineStyle: {
      width: lineWidth,
    },
    ...(isArea ? { areaStyle: { opacity: area_opacity } } : {}),
    barWidth,
    symbol,
    symbolSize,
    showSymbol,
    label: {
      show: showLabel,
      position: `inside${isReverse ? 'Right' : 'Top'}`,
      color: '#fff',
    },
    showBackground,
    backgroundStyle: {
      color: barBackgroundColor,
    },
    roundCap,
  }));

  let color = getColors(theme, needRerverse);

  return {
    color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },

    // 极坐标系必须设置polar
    ...(isPolar ? { polar: {} } : {}),
    [getAxisName({ isPolar, isReverse, type: 'x' })]: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        position: 'top',
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#ddd',
        },
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
      },
    ],
    [getAxisName({ isPolar, isReverse, type: 'y' })]: [
      {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: isReverse ? res.xArr.reverse() : res.xArr,
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
        axisLabel: {
          color: '#ddd',
        },
      },
    ],
    series,
  };
};
