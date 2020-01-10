import * as g2plot from '@antv/g2plot';
import { AutoChartOptions } from '@/lib/chart-advisor/src';

export type TMockChange = (result: { config?: any; data: any[] }) => void;
export interface IAChart extends AutoChartOptions {
  data: any[];
  onMockChange?: TMockChange;
  [key: string]: any;
}

export const showDefaultOption = chartType => {
  console.log(
    chartType + '默认配置项:',
    g2plot[chartType] && g2plot[chartType].getDefaultOptions(),
  );
};

export const getNonce = () =>
  Math.random()
    .toString(36)
    .slice(2, 11);
