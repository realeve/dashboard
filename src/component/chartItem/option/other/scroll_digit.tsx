import React from 'react';
// 此处导入你所需要的自定义组件
import { DigitalScroll } from '@/component/widget';
import { ICountUp } from '@/component/widget/DigitalScroll';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [[138248]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'decimals',
    title: '小数位数',
    defaultValue: 2,
    min: 0,
    max: 4,
  },
  {
    key: 'suffix',
    title: '单位',
    defaultValue: '',
    valueType: 'text',
  },
  {
    key: 'prefix',
    title: '前缀',
    defaultValue: '',
    valueType: 'text',
  },
  {
    key: 'duration',
    defaultValue: 0.8,
    title: '动画持续时长',
    type: 'range',
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  {
    key: 'theme',
    title: '主题背景',
    type: 'radio',
    defaultValue: 'theme1',
    option: [
      {
        title: '透明',
        value: 'transparent',
      },
      {
        title: '蓝色边框',
        value: 'blueTheme',
      },
      {
        title: '白色',
        value: 'whiteTheme',
      },
    ],
  },
  {
    key: 'scale',
    defaultValue: 1.2,
    title: '文字缩放',
    type: 'range',
    min: 0.5,
    max: 5,
    step: 0.1,
  },
  {
    key: 'padding',
    defaultValue: 15,
    title: '边距',
    type: 'range',
    min: 5,
    max: 100,
    step: 1,
  },
  {
    key: 'outlineColor',
    defaultValue: '#0996f9',
    title: '边框颜色',
    type: 'purecolor',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/20_scroll_digit.json',
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

interface IScrollConfig extends ICountUp {
  data: { data: any[][] };
  x: number;
}
export default ({ option: { data, x = 0, ...props } }: { option: IScrollConfig }) => {
  let value = Number(data.data[0][x]);
  return <DigitalScroll value={value} {...props} />;
};
