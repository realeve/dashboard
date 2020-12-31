import type { IApiConfig, IG2PlotProps, IChartMock } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { palette } from '@/component/g2plot';
import { getAnnotations } from './lib';
import defaultTheme from '@/component/g2plot/theme';

export const mock: IChartMock = {
  data: [
    {
      year: '1850',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1850',
      value: 54,
      category: 'Solid fuel',
    },
    {
      year: '1850',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1850',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1850',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1851',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1851',
      value: 54,
      category: 'Solid fuel',
    },
    {
      year: '1851',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1851',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1851',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1852',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1852',
      value: 57,
      category: 'Solid fuel',
    },
    {
      year: '1852',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1852',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1852',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1853',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1853',
      value: 59,
      category: 'Solid fuel',
    },
    {
      year: '1853',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1853',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1853',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1854',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1854',
      value: 69,
      category: 'Solid fuel',
    },
    {
      year: '1854',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1854',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1854',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1855',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1855',
      value: 71,
      category: 'Solid fuel',
    },
    {
      year: '1855',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1855',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1855',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1856',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1856',
      value: 76,
      category: 'Solid fuel',
    },
    {
      year: '1856',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1856',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1856',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1857',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1857',
      value: 77,
      category: 'Solid fuel',
    },
    {
      year: '1857',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1857',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1857',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1858',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1858',
      value: 78,
      category: 'Solid fuel',
    },
    {
      year: '1858',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1858',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1858',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1859',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1859',
      value: 83,
      category: 'Solid fuel',
    },
    {
      year: '1859',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1859',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1859',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1860',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1860',
      value: 91,
      category: 'Solid fuel',
    },
    {
      year: '1860',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1860',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1860',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1861',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1861',
      value: 95,
      category: 'Solid fuel',
    },
    {
      year: '1861',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1861',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1861',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1862',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1862',
      value: 96,
      category: 'Solid fuel',
    },
    {
      year: '1862',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1862',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1862',
      value: 0,
      category: 'Gas flarinl',
    },
    {
      year: '1863',
      value: 0,
      category: 'Liquid fuel',
    },
    {
      year: '1863',
      value: 103,
      category: 'Solid fuel',
    },
    {
      year: '1863',
      value: 0,
      category: 'Gas fuel',
    },
    {
      year: '1863',
      value: 0,
      category: 'Cement production',
    },
    {
      year: '1863',
      value: 0,
      category: 'Gas flarinl',
    },
  ],
  title: '某数据_MOCK数据',
  header: ['year', 'value', 'category'],
  rows: 1000,
  hash: 'mockdata',
};

export const lineConfig = [
  {
    key: 'renderer',
    defaultValue: 'canvas',
    title: '图表引擎',
    type: 'radio',
    option: 'canvas,svg',
  },
  lib.getAntThemePanel(),
  {
    key: 'isStack',
    defaultValue: false,
    title: '堆叠',
    type: 'switch',
  },
  {
    key: 'showSlider',
    defaultValue: false,
    title: '显示滑块',
    type: 'switch',
  },
  {
    key: 'showLabel',
    defaultValue: true,
    title: '显示数据标签',
    type: 'switch',
  },
  {
    key: 'endLabel',
    defaultValue: false,
    title: '尾部标签跟随',
    type: 'switch',
  },
  {
    key: 'lineWidth',
    defaultValue: 2,
    title: '线宽',
    type: 'range',
    step: 1,
    min: 1,
    max: 20,
  },
  {
    key: 'fillOpacity',
    defaultValue: 0.4,
    title: '面积图透明度',
    type: 'range',
    step: 0.1,
    min: 0,
    max: 1,
  },
  {
    key: 'connectNulls',
    defaultValue: true,
    title: '连接空数据',
    type: 'switch',
  },
  {
    key: 'stepType',
    default: '无',
    title: '阶梯样式',
    type: 'radio',
    option: '无,hv,vh,hvh,vhv',
  },
  {
    type: 'divider',
    title: '数据点样式',
  },
  {
    key: 'pointSize',
    defaultValue: 0,
    title: '大小',
    type: 'range',
    step: 1,
    min: 0,
    max: 20,
  },
  {
    key: 'pointColor',
    defaultValue: '#ffffff',
    title: '颜色',
    type: 'purecolor',
    position: 'top',
  },
  {
    key: 'pointShape',
    defaultValue: 'hollow-circle',
    title: '形状',
    type: 'select',
    option:
      'hollow-circle,hollow-square,hollow-bowtie,hollow-diamond,hollow-hexagon,hollow-triangle,hollow-triangle-down,circle,square,bowtie,diamond,hexagon,triangle,triangle-down,cross,tick,plus,hyphen,line',
  },
  ...lib.getLegendConfig(),
];

export const config = [
  {
    type: 'label',
    title: '图表类型切换需刷新页面',
  },
  {
    key: 'chartType',
    defaultValue: 'line',
    title: '图表类型',
    type: 'radio',
    option: [
      {
        title: '曲线图',
        value: 'line',
      },
      {
        title: '面积图',
        value: 'area',
      },
      {
        title: '柱状图',
        value: 'column',
      },
      {
        title: '条形图',
        value: 'bar',
      },
    ],
  },
  {
    key: 'isPercent',
    defaultValue: false,
    title: '百分比',
    type: 'switch',
  },
  {
    key: 'smooth',
    defaultValue: true,
    title: '曲线类型',
    type: 'radio',
    option: [
      {
        title: <i className="datav-icon gui-icons datav-gui-icon-smooth-line datav-gui-icon" />,
        value: true,
      },
      {
        title: <i className="datav-icon gui-icons datav-gui-icon-poly-line datav-gui-icon" />,
        value: false,
      },
    ],
  },
  ...lineConfig,
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/33_g2_plotline.json',
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
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

// export const defaultOption = { renderer: 'svg' };
export type IG2Plot = {
  x: number;
  y: number;
  legend: number;
  showLabel: boolean;
  isStack: boolean;
  isPercent: boolean;
  smooth: boolean;
  connectNulls: boolean;
  endLabel: boolean;
  lineWidth: number;
  pointSize: number;
  pointColor: string;
  pointShape: string;
  stepType: string;
} & IG2PlotProps

export const getLineConfig = ({
  data: { data, header },
  x,
  y,
  legend,
  showLabel,
  isStack,
  isPercent,
  smooth,
  connectNulls,
  endLabel,
  lineWidth,
  pointSize,
  pointColor,
  pointShape,
  stepType,
  legendShow,
  showSlider,
  legendAlign,
  legendPosition,
  legendOrient,
  theme,
  chartType,
  fillOpacity,
  renderer,
}: IG2Plot) => {
  const isBarChart = ['column', 'bar'].includes(chartType);
  const reverseXY = chartType == 'bar';

  const seriesField: { seriesField?: string } =
    header.length < 3 || typeof legend === 'undefined'
      ? {}
      : {
          seriesField: header[legend],
        };
  const stepOption = stepType == '无' || stepType == '' ? { smooth } : { stepType, smooth: false };

  const slider =
    !reverseXY && showSlider
      ? {
          slider: {
            start: 0.1,
            end: 0.5,
          },
        }
      : {};

  const isDefaultTheme = theme === 'cbpc';
  const themeCfg = isDefaultTheme ? defaultTheme : palette[theme].theme;
  const distTheme = isDefaultTheme ? {} : { theme: themeCfg };

  const seriesCfg = {
    xField: header[reverseXY ? y : x],
    yField: header[reverseXY ? x : y],
    ...seriesField,
  };

  // 尾部跟随
  const annotationsOption =
    !isBarChart && endLabel && !isPercent
      ? getAnnotations(
          data,
          {
            ...seriesCfg,
            color: themeCfg.colors10,
          },
          {
            offsetX: 8,
            needSort: false,
            isStack,
            isArea: chartType == 'area',
            xAxisOffset: 0,
            maxLabelLength: 15,
          },
        )
      : null;
  const annotations =
    !endLabel || isBarChart || !annotationsOption
      ? {}
      : {
          annotations: annotationsOption,
        };
  // 百分比显示数据
  const formatter = !isPercent ? {} : { formatter: ({ value }) => `${(value * 100).toFixed(2)}%` };
  const label =
    !isBarChart || !showLabel
      ? {}
      : {
          // 可手动配置 label 数据标签位置
          label: {
            position: isStack ? 'middle' : reverseXY ? 'right' : 'top', // 'top', 'middle', 'bottom'
            ...formatter,
          },
        };

  const interactions =
    isBarChart && isStack
      ? [
          // { type: 'element-link' },
          {
            type: 'element-highlight-by-color',
          },
        ]
      : [
          {
            type: 'element-highlight-by-color',
          },
        ];

  const percentConfig = !isPercent
    ? {}
    : {
        isPercent,
        [reverseXY ? 'xAxis' : 'yAxis']: {
          label: {
            formatter: (value) => value * 100,
          },
        },
      };

  const config = {
    chartType,
    renderer,
    appendPadding: [0, endLabel && !isBarChart && !isPercent ? 100 : 0, 0, 0],

    // 数据系列配置
    ...seriesCfg,
    // 尾部跟随
    ...annotations,
    // 阶梯图
    ...stepOption,
    // 图例位置
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    // 缩略图滑动条
    ...slider,
    // 交互
    interactions,
    connectedArea: {
      trigger: 'hover',
    },
    // 主题配置色
    ...distTheme,
    isStack,
    isGroup: !isStack,
    connectNulls,
    lineStyle: { lineWidth },
    point: {
      size: pointSize,
      color: pointColor,
      shape: pointShape,
    },
    areaStyle: { fillOpacity },
    data,
    [!reverseXY ? 'xAxis' : 'yAxis']: {
      type: 'category',
      label: {
        autoRotate: false,
      },
    },
    ...label,
    // 百分比
    ...percentConfig,
    tooltip: {
      showMarkers: true,
      shared: true,
    },
  };

  return config;
};

export default getLineConfig;
