import * as lib from '@/component/chartItem/option/lib';

export const config = [
  {
    key: 'chartType',
    defaultValue: 'pie',
    title: '图表类型',
    type: 'radio',
    option: [
      {
        title: '饼图',
        value: 'pie',
      },
      {
        title: '玫瑰图',
        value: 'rose',
      },
      {
        title: '玫瑰面积图',
        value: 'area',
      },
    ],
  },
  lib.getAntThemePanel(),
  ...lib.getLegendConfig(),
  {
    key: 'innerRadius',
    defaultValue: 20,
    title: '圆环大小',
    type: 'range',
    min: 0,
    max: 70,
    step: 5,
  },
  {
    key: 'labelPosition',
    defaultValue: 'inner',
    title: '标签位置',
    type: 'radio',
    option: [
      {
        title: '内部',
        value: 'inner',
      },
      {
        title: '外部',
        value: 'outer',
      },
    ],
  },
  {
    key: 'labelAlign',
    defaultValue: 'edge',
    title: '标签对齐',
    type: 'radio',
    option: [
      {
        title: '默认',
        value: 'none',
      },
      {
        title: '文字对齐',
        value: 'labelLine',
      },
      {
        title: '两边对齐',
        value: 'edge',
      },
    ],
  },
  {
    key: 'edgeDistance',
    defaultValue: 10,
    title: '标签边距',
    step: 1,
    type: 'range',
    min: 0,
    max: 30,
  },
  {
    key: 'borderWidth',
    defaultValue: 1,
    title: '线宽',
    step: 1,
    type: 'range',
    min: 0,
    max: 30,
  },
  {
    key: 'borderColor',
    defaultValue: '#070125',
    title: '边框线颜色',
    type: 'purecolor',
  },
  {
    key: 'borderRadiusInner',
    defaultValue: 0,
    title: '内圆圆角',
    step: 1,
    type: 'range',
    min: 0,
    max: 50,
  },
  {
    key: 'borderRadiusOutter',
    defaultValue: 0,
    title: '外圆圆角',
    step: 1,
    type: 'range',
    min: 0,
    max: 50,
  },
  {
    key: 'labelFontSize',
    defaultValue: 16,
    title: '标签字号',
    step: 1,
    type: 'range',
    min: 10,
    max: 40,
  },
  {
    key: 'valueFontSize',
    defaultValue: 12,
    title: '标签字号',
    step: 1,
    type: 'range',
    min: 10,
    max: 40,
  },
];
