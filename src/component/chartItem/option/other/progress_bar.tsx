import ProgressBar from '@/component/widget/progressbar';
import type { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export const mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config = [];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/04_progress_bar.json',
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

export default ({ option: { data, x = 0 }, style }) => {
  const percent = data.data[0][x];
  return <ProgressBar style={{ width: '100%', height: '100%', ...style }} percent={percent} />;
};
