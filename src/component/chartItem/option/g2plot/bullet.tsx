import type { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';

export const mock: IChartMock = {
  data: [
    ['A', 80, 85, 100],
    ['B', 60, 85, 100],
    ['C', 92, 85, 100],
    ['D', 88, 85, 100],
  ],
  title: '拆线柱图_MOCK数据',
  header: ['类型', '实际值', '目标值', '最大值'],
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
    key: 'direction',
    title: '布局',
    type: 'radio',
    defaultValue: 'horizontal',
    option: [
      {
        title: '横向',
        value: 'horizontal',
      },
      {
        title: '纵向',
        value: 'vertical',
      },
    ],
  },
  {
    key: 'legendShow',
    defaultValue: true,
    type: 'switch',
    title: '显示图例',
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
      title: '标题',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: '测量值',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'y2',
      title: '目标值',
      defaultValue: 2,
      min: 0,
    },
    {
      key: 'max',
      title: '范围最大值',
      defaultValue: 3,
      min: 0,
    },
  ],
};

type IG2Plot = Record<string, any>;

export default ({
  data: { data },
  x = 0,
  y = 1,
  y2 = 2,
  max = 3,
  direction = 'horizontal',
  renderer = 'canvas',
  legendShow = true,
}: IG2Plot) => {
  const res = data[0];
  const isHorizontal = direction === 'horizontal';

  const bulletData = data.map((res) => ({
    title: res[x],
    ranges: [res[max]],
    measures: [res[y]],
    target: res[y2],
  }));

  const option = {
    chartType: 'bullet',
    renderer,
    layout: direction,
    data: bulletData,
    measureField: 'measures',
    rangeField: 'ranges',
    targetField: 'target',
    xField: 'title',
    color: {
      range: '#5B8FF9',
      measure: '#5B8FF9',
      target: '#ee4444',
    },
    xAxis: {
      line: null,
    },
    // yAxis: false,
    bulletStyle: {
      target: {
        lineWidth: 3,
      },
    },
    label: {
      measure: {
        position: isHorizontal ? 'right' : 'top',
        [isHorizontal ? 'offsetX' : 'offsetY']: (isHorizontal ? -1 : 1) * 28,
        style: {
          fill: '#fff',
        },
      },
    },
    size: {
      target: 30,
      measure: 25,
    },
    // 自定义 legend
    legend: legendShow && {
      custom: true,
      position: 'bottom',
      items: [
        {
          value: '实际值',
          name: '实际值',
          marker: { symbol: 'square', style: { fill: '#5B8FF9', r: 5 } },
        },
        {
          value: '目标值',
          name: '目标值',
          marker: { symbol: 'line', style: { stroke: '#5B8FF9', r: 5 } },
        },
      ],
    },
  };
  return option;
};
