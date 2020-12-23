import { IChartConfig } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import * as utils from './lib';

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
    key: 'isPercent',
    defaultValue: false,
    type: 'switch',
    title: '百分比图',
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
    key: 'axisPointer',
    defaultValue: 'shadow',
    type: 'radio',
    title: '指示器样式',
    option: [
      {
        value: 'line',
        title: '直线',
      },
      { value: 'shadow', title: '阴影' },
      { value: 'cross', title: '十字准星' },
    ],
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
    noAnimation: true,
  },
  {
    key: 'roundCap',
    defaultValue: false,
    type: 'switch',
    title: '极坐标柱形圆弧效果',
  },
  { type: 'divider', title: '数据标记设置' },
  {
    key: 'showMarkpoint',
    defaultValue: false,
    type: 'radio',
    title: '显示标记点',
    option: [
      {
        title: '最大值',
        value: 'max',
      },
      {
        title: '最小值',
        value: 'min',
      },
      {
        title: '同时显示',
        value: 'minmax',
      },
      {
        title: '不显示',
        value: false,
      },
    ],
  },
  {
    key: 'showMarkline',
    defaultValue: false,
    type: 'radio',
    title: '显示标记线',
    option: [
      {
        title: '平均值',
        value: 'average',
      },
      {
        title: '不显示',
        value: false,
      },
    ],
  },
  {
    key: 'showMarkArea',
    defaultValue: false,
    type: 'switch',
    title: '显示标记区域',
  },
  {
    key: 'markAreaColor',
    defaultValue: 'rgba(255,255,255,0.1)',
    type: 'purecolor',
    title: '标记区域颜色',
    position: 'bottom',
    noAnimation: true,
  },
  {
    key: 'markAreaColor2',
    defaultValue: 'rgba(255,255,255,0.3)',
    type: 'purecolor',
    title: '标记区域颜色2',
    position: 'bottom',
    noAnimation: true,
  },
  ...utils.getMarkArea(5, 1),
];
