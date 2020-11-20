import { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [
    { value: 1.2 },
    { value: 3.4 },
    { value: 3.7 },
    { value: 4.3 },
    { value: 5.2 },
    { value: 5.8 },
    { value: 6.1 },
    { value: 6.5 },
    { value: 6.8 },
    { value: 7.1 },
    { value: 7.3 },
    { value: 7.7 },
    { value: 8.3 },
    { value: 8.6 },
    { value: 8.8 },
    { value: 9.1 },
    { value: 9.2 },
    { value: 9.4 },
    { value: 9.5 },
    { value: 9.7 },
    { value: 10.5 },
    { value: 10.7 },
    { value: 10.8 },
    { value: 11.0 },
    { value: 11.0 },
    { value: 11.1 },
    { value: 11.2 },
    { value: 11.3 },
    { value: 11.4 },
    { value: 11.4 },
    { value: 11.7 },
    { value: 12.0 },
    { value: 12.9 },
    { value: 12.9 },
    { value: 13.3 },
    { value: 13.7 },
    { value: 13.8 },
    { value: 13.9 },
    { value: 14.0 },
    { value: 14.2 },
    { value: 14.5 },
    { value: 15 },
    { value: 15.2 },
    { value: 15.6 },
    { value: 16.0 },
    { value: 16.3 },
    { value: 17.3 },
    { value: 17.5 },
    { value: 17.9 },
    { value: 18.0 },
    { value: 18.0 },
    { value: 20.6 },
    { value: 21 },
    { value: 23.4 },
  ],
  title: '拆线柱图_MOCK数据',
  header: ['value'],
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
    key: 'binNumber',
    defaultValue: 5,
    title: '分箱数量',
    type: 'range',
    step: 1,
    min: 2,
    max: 20,
  },
  {
    type: 'label',
    title: '分箱宽度为0时，分箱数量有效，切换时需刷新页面。',
  },
  {
    key: 'binWidth',
    defaultValue: 5,
    title: '分箱宽度',
    type: 'range',
    step: 1,
    min: 0,
    max: 100,
  },
  {
    key: 'color',
    defaultValue: '#096dd9',
    title: '颜色',
    type: 'purecolor',
    position: 'bottom',
  },
  {
    key: 'offsetX',
    defaultValue: -56,
    title: 'X偏移量',
    type: 'range',
    step: -2,
    min: -100,
    max: 100,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/02_linebar.json',
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

interface IG2Plot extends IG2PlotProps {
  color: string;
  binNumber: number;
  offsetX: number;
  binWidth: number;
  [key: string]: any;
}

export default ({
  data: { data, header },
  x = 0,
  binNumber = 5,
  binWidth = 5,
  color = '#096dd9',
  renderer = 'svg',
  offsetX = -56,
}: IG2Plot) => {
  let binConfig =
    binWidth == 0
      ? {
          binNumber: binNumber - 1,
        }
      : {
          binWidth,
        };
  return {
    chartType: 'histogram',
    renderer,
    data,
    color,
    binField: header[x],
    ...binConfig,
    label: {
      position: 'top',
      offsetX,
    },
    tooltip: {
      showTitle: false,
      formatter: ({ range, count }) => {
        return {
          name: range.map((item) => item.toFixed(1)).join(' ~ '),
          value: count,
        };
      },
    },
  };
};
