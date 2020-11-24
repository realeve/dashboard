import { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { getTheme } from './lib';
import { tooltip } from '@/component/g2plot/theme';
import { textColor } from '@/component/chartItem/option';

export let mock: IChartMock = {
  data: [
    { type: '分类一', value: 47 },
    { type: '分类二', value: 45 },
    { type: '分类三', value: 38 },
    { type: '分类四', value: 65 },
    { type: '分类五', value: 20 },
    { type: '其他', value: 5 },
  ],
  title: '拆线柱图_MOCK数据',
  header: ['type', 'value'],
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
  lib.getAntThemePanel(),
  ...lib.getLegendConfig(),
  {
    key: 'innerRadius',
    defaultValue: 0.2,
    title: '圆环大小',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    key: 'labelPosition',
    defaultValue: 'inner',
    title: '标签位置',
    type: 'radio',
    option: [
      {
        title: '内部',
        value: 'inner',
      },
      {
        title: '外部',
        value: 'outer',
      },
      {
        title: '蜘蛛布局',
        value: 'spider',
      },
    ],
  },
  {
    key: 'showStatistic',
    defaultValue: true,
    title: '显示汇总结果',
    type: 'switch',
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
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

interface IG2Plot extends IG2PlotProps {
  [key: string]: any;
}

export default ({
  data: { data, header, title },
  x: _x = 0,
  y: _y = 1,
  innerRadius,
  renderer = 'svg',
  theme = 18,
  legendShow = true,
  legendAlign,
  legendPosition,
  legendOrient,
  labelPosition = 'inner',
  showStatistic = true,
}: IG2Plot) => {
  let x = header[_x],
    y = header[_y];
  return {
    chartType: 'pie',
    ...getTheme(theme),
    renderer,
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    data,
    angleField: y,
    colorField: x,
    radius: 0.95,
    innerRadius,
    label: {
      type: labelPosition,
      offset: labelPosition == 'inner' ? '-30%' : '10%',
      // content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      content: labelPosition == 'inner' ? '{name} {percentage}' : '{name}\n{percentage}',
      style: {
        fontSize: 12,
        textAlign: 'center',
        fill: textColor,
      },
    },
    state: {
      active: {
        style: {
          lineWidth: 0,
          fillOpacity: 0.65,
        },
      },
    },
    tooltip,
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    statistic: showStatistic && {
      title: {
        offsetY: '-10',
        style: {
          fill: textColor,
        },
      },
      content: {
        offsetY: 16,
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: textColor,
          fontWeight: 'normal',
          fontSize: 20,
        },
      },
    },
  };
};
