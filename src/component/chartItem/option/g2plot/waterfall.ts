import { IG2Config } from './config';

export interface IG2PlotConfig {
  data: (string | number)[][];
  xField: string;
  yField: string;
  color?: {
    total: string;
    rising?: string;
    falling?: string;
  };
}
export default ({ data, header, x = 0, y = 1 }: IG2Config) => {
  x = String(x);
  y = String(y);
  let axisLabel = {
    label: {
      style: {
        fill: 'rgba(255, 255, 255, 0.65)',
      },
    },
  };

  let configs: IG2PlotConfig = {
    data,
    xField: x,
    yField: y,
    xAxis: axisLabel,
    yAxis: {
      ...axisLabel,
    },
    color: {
      rising: 'rgb(240,102,74)', //正值柱形填充颜色
      falling: 'rgb(48,191,120)', //负值柱形填充颜色
      total: '#1890ff', // 总计值柱形填充颜色，可选
    },
  };

  return {
    data,
    config: {
      configs,
      type: 'Waterfall',
    },
  };
};
