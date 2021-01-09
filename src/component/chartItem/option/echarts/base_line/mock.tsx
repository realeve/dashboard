import type { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export { config } from './config';

export const mock: IChartMock = {
  data: [
    ['类目1', '1月', 175],
    ['类目2', '1月', 210],
    ['类目1', '2月', 125],
    ['类目2', '2月', 140],
    ['类目1', '3月', 98],
    ['类目2', '3月', 120],
    ['类目1', '4月', 120],
    ['类目2', '4月', 140],
    ['类目1', '5月', 50],
    ['类目2', '5月', 60],
  ],
  title: '某数据_MOCK数据',
  header: ['月份', '类型', '交易发生值'],
  rows: 10,
  hash: 'mockdata',
};

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/34_base_line.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
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
