import React from 'react';
// 此处导入你所需要的自定义组件
import { FlipBoard } from '@/component/widget';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
export let mock: IChartMock = {
  data: [[1336.467]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'decimal',
    title: '小数位数',
    defaultValue: 0,
    min: 0,
    max: 4,
  },
  {
    key: 'suffix',
    title: '单位',
    defaultValue: '',
    valueType: 'text',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/19_flipboard.json',
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

export default ({ option: { data, x = 0, decimal = 2, suffix = '' } }) => {
  let value = data.data[0][x]; 
  return <FlipBoard title="某指标" value={value} decimals={decimal} suffix={suffix} />;
};
