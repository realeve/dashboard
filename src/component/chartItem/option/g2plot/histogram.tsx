import type { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { getTheme } from './lib';

export const mock: IChartMock = {
  data: [
    { value: 1.2, type: 'a' },
    { value: 3.4, type: 'b' },
    { value: 3.7, type: 'a' },
    { value: 4.3, type: 'b' },
    { value: 5.2, type: 'a' },
    { value: 5.8, type: 'b' },
    { value: 6.1, type: 'a' },
    { value: 6.5, type: 'b' },
    { value: 6.8, type: 'a' },
    { value: 7.1, type: 'b' },
    { value: 7.3, type: 'a' },
    { value: 7.7, type: 'b' },
    { value: 8.3, type: 'a' },
    { value: 8.6, type: 'b' },
    { value: 8.8, type: 'a' },
    { value: 9.1, type: 'b' },
    { value: 9.2, type: 'a' },
    { value: 9.4, type: 'b' },
    { value: 9.5, type: 'a' },
    { value: 9.7, type: 'b' },
    { value: 10.5, type: 'a' },
    { value: 10.7, type: 'b' },
    { value: 10.8, type: 'a' },
    { value: 11, type: 'b' },
    { value: 11, type: 'a' },
    { value: 11.1, type: 'b' },
    { value: 11.2, type: 'a' },
    { value: 11.3, type: 'b' },
    { value: 11.4, type: 'a' },
    { value: 11.4, type: 'b' },
    { value: 11.7, type: 'a' },
    { value: 12, type: 'b' },
    { value: 12.9, type: 'a' },
    { value: 12.9, type: 'b' },
    { value: 13.3, type: 'a' },
    { value: 13.7, type: 'b' },
    { value: 13.8, type: 'a' },
    { value: 13.9, type: 'b' },
    { value: 14, type: 'a' },
    { value: 14.2, type: 'b' },
    { value: 14.5, type: 'a' },
    { value: 15, type: 'b' },
    { value: 15.2, type: 'a' },
    { value: 15.6, type: 'b' },
    { value: 16, type: 'a' },
    { value: 16.3, type: 'b' },
    { value: 17.3, type: 'a' },
    { value: 17.5, type: 'b' },
    { value: 17.9, type: 'a' },
    { value: 18, type: 'b' },
    { value: 18, type: 'a' },
    { value: 20.6, type: 'b' },
    { value: 21, type: 'a' },
    { value: 23.4, type: 'b' },
  ],
  title: '拆线柱图_MOCK数据',
  header: ['value', 'type'],
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
  lib.getAntThemePanel(),
  ...lib.getLegendConfig(),
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
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

type IG2Plot = {
  color: string;
  binNumber: number;
  offsetX: number;
  binWidth: number;
  [key: string]: any;
} & IG2PlotProps;

export default ({
  data: { data, header },
  x = 0,
  legend = 1,
  binNumber = 5,
  binWidth = 5,
  color = '#096dd9',
  renderer = 'svg',
  offsetX = -56,
  theme = 18,
  legendShow = true,
  legendAlign,
  legendPosition,
  legendOrient,
}: IG2Plot) => {
  const binConfig =
    binWidth === 0
      ? {
          binNumber: binNumber - 1,
        }
      : {
          binWidth,
        };
  const noLegend = typeof legend === 'undefined' || header.length === 1;
  const stackCfg = noLegend
    ? {
        label: {
          position: 'top',
          offsetX,
        },
        color,
      }
    : {
        stackField: header[legend],
        label: {
          position: 'middle',
          offsetX,
        },
      };

  return {
    chartType: 'histogram',
    renderer,
    data,
    ...getTheme(theme),
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    binField: header[x],
    ...binConfig,
    ...stackCfg,
    tooltip: {
      showMakers: true,
      formatter: ({ range, count, ...props }) => {
        const name = range.map((item) => item.toFixed(1)).join(' ~ ');
        return noLegend
          ? {
              name,
              value: count,
            }
          : {
              name: `${props[header[legend]]} (${name}) `,
              value: count,
            };
      },
    },
    yAxis: {
      grid: null,
    },
  };
};
