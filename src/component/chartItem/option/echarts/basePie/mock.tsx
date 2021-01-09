import type { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export { config } from './config';

export const mock: IChartMock = {
  data: [
    ['1月', 175],
    ['2月', 125],
    ['3月', 98],
    ['4月', 120],
    ['5月', 50],
  ],
  title: '某数据_MOCK数据',
  header: ['类型', '交易发生值'],
  rows: 10,
  hash: 'mockdata',
};

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/46_base_pie.json',
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

/**
 * 默认渲染引擎
 */
// export const defaultOption = {
//   renderer: 'svg',
// };
