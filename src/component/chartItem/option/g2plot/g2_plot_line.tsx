import React from 'react';
import { IApiConfig } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { palette } from '@/component/g2plot';
export { mock } from './mock';
import { getAnnotations } from './lib';
import defaultTheme from '@/component/g2plot/theme';

export const config = [
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
    key: 'chartType',
    defaultValue: 'line',
    title: '图表类型(需刷新)',
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
    ],
  },
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
export default ({
  data: { data, header },
  x = 0,
  y = 1,
  legend = 2,
  isStack = false,
  smooth = false,
  connectNulls = true,
  endLabel = true,
  lineWidth = 2,
  pointSize = 0,
  pointColor = '#fff',
  pointShape = 'hollow-circle',
  stepType = '',
  legendShow = true,
  showSlider = false,
  legendAlign = 'center',
  legendPosition = 'top',
  legendOrient = 'horizontal',
  theme = 'cbpc',
  chartType = 'line',
  fillOpacity = 0.4,
}) => {
  let seriesField =
    header.length < 3 || typeof legend === 'undefined'
      ? {}
      : {
          seriesField: header[legend],
        };
  let stepOption = stepType == '无' ? { smooth } : { stepType, smooth: false };

  let slider = showSlider
    ? {
        slider: {
          start: 0.1,
          end: 0.5,
        },
      }
    : {};

  let themeCfg = palette[theme].theme;
  if (themeCfg === 'cbpc') {
    themeCfg = defaultTheme;
  }

  let option = {
    xField: header[x],
    yField: header[y],
    ...seriesField,
    color: themeCfg.colors10,
  };

  // 尾部跟随
  let annotationsOption = endLabel
    ? getAnnotations(data, option, {
        offsetX: 8,
        needSort: false,
        isStack,
        isArea: chartType == 'area',
        xAxisOffset: 0,
        maxLabelLength: 15,
      })
    : {};
  let annotations = !endLabel
    ? {}
    : {
        annotations: annotationsOption,
      };

  return {
    appendPadding: [0, endLabel ? 100 : 0, 0, 0],
    ...annotations,
    chartType,
    xField: header[x],
    yField: header[y],
    ...seriesField,
    ...stepOption,
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    ...slider,
    isStack,
    connectNulls,
    lineStyle: { lineWidth },
    point: {
      size: pointSize,
      color: pointColor,
      shape: pointShape,
    },
    areaStyle: { fillOpacity },
    data,
    // 主题配置色
    theme: palette[theme].theme,
    xAxis: { type: 'category' },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
  };
};
