import { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export const mock: IChartMock = {
  data: [
    ['Zombieland', 9],
    ['Wieners', 8],
    ['Toy Story', 8],
    ['trashkannon', 7],
    ['the GROWLERS', 6],
    ['mudweiser', 6],
    ['ThunderCats', 4],
    ['The Taqwacores - Motion Picture', 4],
    ['The Shawshank Redemption', 2],
    ['The Olivia Experiment', 1],
  ],
  title: '拆线柱图_MOCK数据',
  header: ['year', 'value'],
  rows: 36,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'maxAngle',
    type: 'range',
    title: '最大旋转角度',
    min: 10,
    max: 360,
    step: 10,
    defaultValue: 240,
  },
  {
    key: 'intervalType',
    type: 'radio',
    title: '样式',
    option: [
      {
        title: '柱形',
        value: 'interval',
      },
      {
        title: '线条',
        value: 'line',
      },
    ],
    defaultValue: 'line',
  },
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
    key: 'radius',
    defaultValue: 0.8,
    title: '外径',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.8,
  },
  {
    type: 'label',
    title: '坐标系切换需刷新页面',
  },
  {
    key: 'coordinate',
    defaultValue: 'polar',
    title: '坐标系',
    type: 'radio',
    option: ['polar', 'rect'],
  },
  {
    key: 'transpose',
    defaultValue: false,
    title: 'X/Y轴互换',
    type: 'switch',
  },
  {
    key: 'color',
    defaultValue: '#096dd9',
    title: '颜色',
    type: 'purecolor',
    position: 'top',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/32_radial_bar.json',
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

/**
 * 玉珏图，参照 https://antv-g2plot.gitee.io/zh/examples/radial-bar/basic#line
 * 根据官方源码进行修改
 */
export default ({
  data: { data },
  color = '#096dd9',
  x = 0,
  y = 1,
  maxAngle = 240,
  intervalType: type,
  innerRadius = 0.2,
  radius = 0.8,
  coordinate = 'polar',
  transpose = true,
}) => {
  return {
    chartType: 'cbpc_radial_bar',
    data,
    coordinate,
    transpose,
    xField: x,
    yField: y,
    radius,
    innerRadius,
    maxAngle,
    color,
    tooltip: {
      showMarkers: true,
    },
    type,
  };
};
