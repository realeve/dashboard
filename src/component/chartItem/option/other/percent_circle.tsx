import Percent from '@/component/widget/Percent';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
export const mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'half',
    defaultValue: true,
    title: '半圆',
    type: 'switch',
  },
  {
    key: 'width',
    defaultValue: 2,
    title: '宽度',
    type: 'range',
    min: 2,
    max: 20,
    step: 2,
  },
  {
    key: 'length',
    defaultValue: 10,
    title: '长度',
    type: 'range',
    min: 5,
    max: 60,
    step: 1,
  },
  {
    key: 'color',
    defaultValue: '#30c3a7',
    title: '颜色',
    type: 'purecolor',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/13_percent_circle.json',
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

export default ({
  option: {
    data: { data, title },
    x = 0,
    half = true,
    width = 2,
    color = '#30c3a7',
    length = 10,
  },
}) => <Percent option={{ value: data[0][x], title, half, width, color, length }} />;
