import { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [
    { type: '分类一', min: 76, max: 100 },
    { type: '分类二', min: 56, max: 108 },
    { type: '分类三', min: 38, max: 129 },
    { type: '分类四', min: 58, max: 155 },
    { type: '分类五', min: 45, max: 120 },
    { type: '分类六', min: 23, max: 99 },
    { type: '分类七', min: 18, max: 56 },
    { type: '分类八', min: 18, max: 34 },
  ],
  title: '拆线柱图_MOCK数据',
  header: ['type', 'min', 'max'],
  rows: 36,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'renderer',
    defaultValue: 'svg',
    title: '图表引擎',
    type: 'radio',
    option: 'canvas,svg',
  },
  {
    key: 'color',
    defaultValue: '#096dd9',
    title: '颜色',
    type: 'purecolor',
    position: 'bottom',
  },
  {
    key: 'fill',
    defaultValue: '#ddd',
    title: '标签文字颜色',
    type: 'purecolor',
    position: 'bottom',
  },
  {
    key: 'reverseXY',
    defaultValue: false,
    title: '调换XY轴',
    type: 'switch',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/02_linebar.json',
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
    {
      key: 'y2',
      title: 'y2 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

interface IG2Plot extends IG2PlotProps {
  color: string;
  fill: string;
  reverseXY: boolean;
  [key: string]: any;
}

export default ({
  data: { data, header },
  x = 0,
  y = 1,
  y2 = 2,
  renderer = 'svg',
  color = '#096dd9',
  fill = '#ddd',
  reverseXY = false,
}: IG2Plot) => {
  let xField = header[x];
  let _data = data.map((item) => ({
    [xField]: item[xField],
    value: [item[header[y]], item[header[y2]]],
  }));

  let config = reverseXY
    ? {
        chartType: 'bar',
        yField: xField,
        xField: 'value',
      }
    : {
        chartType: 'column',
        xField,
        yField: 'value',
      };

  return {
    ...config,
    color,
    renderer,
    data: _data,
    isRange: true,
    label: {
      position: 'middle',
      style: {
        fill,
      },
    },
  };
};
