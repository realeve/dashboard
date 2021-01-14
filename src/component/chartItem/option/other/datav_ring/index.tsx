import type { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';

// import { textColor } from '@/component/chartItem/option';
import Charts from './chart';
import * as R from 'ramda';
import 'echarts/lib/chart/pie';

const color: string[] = [
  '#00c0ff',
  '#3de7c9',
  '#fff',
  '#00c0ff',
  '#3de7c9',
  '#5B8FF9',
  '#5AD8A6',
  '#5D7092',
  '#F6BD16',
  '#6F5EF9',
  '#6DC8EC',
  '#945FB9',
  '#FF9845',
  '#1E9493',
  '#FF99C3',
];

export const mock: IChartMock = {
  data: [
    ['监控系统', 93],
    ['收费系统', 65],
    ['通信系统', 32],
    ['供配电系统', 44],
    ['其它', 52],
  ],
  title: 'datav饼图_MOCK数据',
  header: ['类型', '指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'innerRadius',
    defaultValue: 70,
    title: '圆环大小',
    type: 'range',
    min: 20,
    max: 90,
    step: 5,
  },
  {
    key: 'max',
    defaultValue: 12,
    title: '线宽',
    type: 'range',
    min: 8,
    max: 50,
    step: 1,
  },
  {
    key: 'labelLineEndLength',
    defaultValue: 20,
    title: '指标线长度',
    type: 'range',
    min: 0,
    max: 50,
    step: 1,
  },
  {
    key: 'fill',
    defaultValue: '#fff',
    title: '文字颜色',
    type: 'purecolor',
  },
  {
    key: 'fontSize',
    defaultValue: 16,
    title: '文字大小',
    type: 'range',
    min: 10,
    max: 50,
    step: 1,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/23_datav_ring.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
  ],
};

const getRadius = (radius, max = 12) => `${Math.floor(Math.random() * max + radius)}%`;
const formatRadius = ({ radius, innerRadius, max }) => {
  const nextRadius = R.clone(radius);
  while (radius[0] === radius[1]) {
    nextRadius[0] = getRadius(innerRadius, max);
  }
  return nextRadius;
};

export default ({
  option: {
    data: { data },
    x = 0,
    y = 1,
    innerRadius = 70,
    max = 12,
    labelLineEndLength = 20,
    fill = '#fff',
    fontSize = 16,
  },
}) => {
  const res = R.clone(data).map((item) => ({ name: item[x], value: item[y] }));

  const _data = res.map((item) => {
    let radius = [getRadius(innerRadius, max), getRadius(innerRadius, max)];
    radius = formatRadius({ radius, innerRadius, max });
    return {
      ...item,
      radius,
    };
  });

  const option = {
    series: [
      {
        type: 'pie',
        data: _data,
        outsideLabel: {
          labelLineEndLength,
          formatter: `{percent}%\n{name}`,
          style: {
            fill,
            fontSize,
          },
        },
      },
    ],
    color,
  };

  return <Charts option={option} />;
};

export interface IChartOption {
  color: string[];
  series: {
    type: string;
    data: any;
    outsideLabel: {
      labelLineEndLength: number;
      formatter: string;
      style: {
        fill: string;
        fontSize: number;
      };
    };
  }[];
}
