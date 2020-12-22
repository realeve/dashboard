import React from 'react';
// 此处导入你所需要的自定义组件
import FlipBoard from '@/component/widget/FlipBoard';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';

export let mock: IChartMock = {
  data: [[1336.467]],
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
    defaultValue: 1.5,
    title: '动画持续时长',
    type: 'range',
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  ...lib.getFontConfig(18, textColor),
  {
    key: 'backgroundColor',
    defaultValue: '#0f396b',
    title: '背景',
    type: 'purecolor',
  },
  {
    key: 'padding',
    defaultValue: 5,
    title: '边距',
    type: 'range',
    min: 5,
    max: 100,
    step: 1,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/19_flipboard.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
  ],
};

export default ({ option: { data, x = 0, ...props } }) => {
  let value = Number(data.data[0][x].toFixed(props.decimals || 2));
  return <FlipBoard title="某指标" value={value} {...props} />;
};
