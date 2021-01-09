import Pie from '@/component/widget/pie';

import type { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export const mock: IChartMock = {
  data: [
    ['体育技能', 17],
    ['体育行为', 23],
    ['体质健康', 27],
    ['体育意识', 33],
    ['体育知识', 29],
  ],
  title: '某指标_MOCK数据',
  header: ['类型', '值'],
  rows: 1,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'circlePos',
    defaultValue: 'inner',
    title: '圆环位置',
    type: 'radio',
    option: [
      {
        title: '内部',
        value: 'inner',
      },
      {
        title: '外部',
        value: 'outter',
      },
    ],
  },
  {
    key: 'roseType',
    defaultValue: false,
    title: '玫瑰图样式',
    type: 'radio',
    option: [
      {
        title: '默认',
        value: false,
      },
      {
        title: '半径',
        value: 'radius',
      },
      {
        title: '面积',
        value: 'area',
      },
    ],
  },
  {
    key: 'valueFontSize',
    defaultValue: 30,
    title: '值字号',
    step: 2,
    type: 'range',
    min: 20,
    max: 80,
  },
  {
    key: 'titleFontSize',
    defaultValue: 16,
    title: '标题字号',
    step: 2,
    type: 'range',
    min: 0,
    max: 60,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/06_dynamic_pie.json',
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
  ],
};

export default (props) => <Pie {...props} />;
