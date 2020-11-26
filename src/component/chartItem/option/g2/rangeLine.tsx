import { Chart } from '@antv/g2';
import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface';

import * as R from 'ramda';

import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';

export let mock: IChartMock = {
  data: [
    ['1月', 175],
    ['2月', 125],
    ['3月', 98],
    ['4月', 120],
    ['5月', 50],
  ],
  title: '某数据_MOCK数据',
  header: ['月份', '类型', '交易发生值'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    type: 'divider',
    title: '颜色设置',
  },
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '柱状宽度',
    type: 'range',
    min: 10,
    max: 40,
    step: 2,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/41_rangeLine.json',
  interval: 60,
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

export const defaultOption = {
  padding: [20, 20, 40, 40],
  renderer: 'svg',
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = ({ data: { data: data }, x = 0, y = 1 }: IChartProps, chart: Chart) => {
  chart.data(data);
  chart.scale({
    [y]: {
      min: 0,
    },
  });

  chart.line().position(`${x}*${y}`);
  chart.render();
};

export default onMount;
