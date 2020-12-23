import { IChartConfig, IChartMock } from '@/component/chartItem/interface';
export { mock } from './mock';
import { lineConfig, IG2Plot, getLineConfig } from '../../g2plot/line';
import { ChartConfig } from '@/component/g2plot';
import * as _ from '@antv/util';
import TrendChart from './TrendChart';

export { apiConfig } from '../../g2plot/line';
export const config: IChartConfig = [
  {
    key: 'cardPosition',
    defaultValue: 'left',
    title: '指标卡位置',
    type: 'radio',
    option: [
      {
        title: '左',
        value: 'left',
      },
      {
        title: '右',
        value: 'right',
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
    ],
  },
  {
    key: 'isPercent',
    defaultValue: false,
    title: '百分比',
    type: 'switch',
  },
  ...lineConfig,
];

export default ({ option }: { option: IG2Plot }) => {
  let { ...config }: ChartConfig = getLineConfig(option) as ChartConfig;
  let props = _.pick<{
    data: IChartMock;
    x: number;
    y: number;
    legend: number;
  }>(option, ['data', 'x', 'y', 'legend']);
  return (
    <TrendChart
      {...props}
      cardPosition={option.cardPosition}
      config={{
        ...config,
        legend: false,
        yAxis: {
          grid: {
            line: false,
          },
        },
        point: {
          size: 0,
        },
        tooltip: {
          showMarkers: true,
          follow: false,
          showContent: false,
          showTitle: false,
          marker: { lineWidth: 2, r: 6 },
        },
        interactions: [{ type: 'marker-active' }],
      }}
    />
  );
};
