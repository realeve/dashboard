import { IChartMock } from '@/component/chartItem/interface';
export interface IG2PlotProps {
  data: IChartMock;
  readonly theme?: string | number;
  readonly legendShow: boolean;
  readonly legendAlign: 'left' | 'center' | 'right';
  readonly legendPosition: 'top' | 'center' | 'bottom';
  readonly legendOrient: 'vertical' | 'horizontal';
  readonly renderer?: 'svg' | 'canvas';
  [key: string]: any;
}
