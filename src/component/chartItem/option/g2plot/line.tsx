import React from 'react';
import { IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { palette } from '@/component/g2plot';
export { mock } from './mock';
import { getAnnotations } from './lib';
import defaultTheme from '@/component/g2plot/theme';

export const config = [
  {
    key: 'renderer',
    defaultValue: 'canvas',
    title: '图表引擎',
    type: 'radio',
    option: 'canvas,svg',
  },
  lib.getAntThemePanel(),
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
    key: 'isStack',
    defaultValue: false,
    title: '堆叠',
    type: 'switch',
  },
  {
    key: 'isPercent',
    defaultValue: false,
    title: '百分比',
    type: 'switch',
  },
  {
    key: 'showSlider',
    defaultValue: false,
    title: '显示滑块',
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

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/33_g2_plotline.json',
  interval: 5,
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
interface IG2Plot extends IG2PlotProps {
  x: number;
  y: number;
  legend: number;
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
}

export default ({
  data: { data, header },
  x = 0,
  y = 1,
  legend = 2,
  isStack = false,
  isPercent = false,
  smooth = false,
  connectNulls = true,
  endLabel = true,
  lineWidth = 2,
  pointSize = 0,
  pointColor = '#ffffff',
  pointShape = 'hollow-circle',
  stepType = '',
  legendShow = true,
  showSlider = false,
  legendAlign = 'center',
  legendPosition = 'top',
  legendOrient = 'horizontal',
  theme = 18,
  chartType = 'line',
  fillOpacity = 0.4,
  renderer = 'canvas',
}: IG2Plot) => {
  const isBarChart = ['column', 'bar'].includes(chartType);
  const reverseXY = chartType == 'bar';

  let seriesField =
    header.length < 3 || typeof legend === 'undefined'
      ? {}
      : {
          seriesField: header[legend],
        };
  let stepOption = stepType == '无' || stepType == '' ? { smooth } : { stepType, smooth: false };

  let slider =
    !reverseXY && showSlider
      ? {
          slider: {
            start: 0.1,
            end: 0.5,
          },
        }
      : {};

  const isDefaultTheme = theme === 'cbpc';
  let themeCfg = isDefaultTheme ? defaultTheme : palette[theme].theme;
  let distTheme = isDefaultTheme ? {} : { theme: themeCfg };

  let seriesCfg = {
    xField: header[reverseXY ? y : x],
    yField: header[reverseXY ? x : y],
    ...seriesField,
  };

  // 尾部跟随
  let annotationsOption =
    !isBarChart && endLabel
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
  let annotations =
    !endLabel || isBarChart || !annotationsOption
      ? {}
      : {
          annotations: annotationsOption,
        };
  // 百分比显示数据
  let formatter = !isPercent ? {} : { formatter: ({ value }) => `${(value * 100).toFixed(2)}%` };
  let label = !isBarChart
    ? {}
    : {
        // 可手动配置 label 数据标签位置
        label: {
          position: isStack ? 'middle' : reverseXY ? 'right' : 'top', // 'top', 'middle', 'bottom'
          ...formatter,
        },
      };

  let interactions =
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

  let config = {
    chartType,
    renderer,
    appendPadding: [0, endLabel && !isBarChart ? 100 : 0, 0, 0],

    // 数据系列配置
    ...seriesCfg,
    // 尾部跟随
    ...annotations,
    // 阶梯图
    ...stepOption,
    // 图例位置
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    //缩略图滑动条
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
    [!reverseXY ? 'xAxis' : 'yAxis']: { type: 'category' },
    ...label,
    // 百分比
    ...percentConfig,
    tooltip: {
      showMarkers: true,
      shared: true,
    },
  };
  // console.log(config);
  return config;
};
