import { IChartMock } from '@/component/chartItem/interface';

export interface ILegendProps {
  /** 显示legend */
  readonly legendShow: boolean;
  /** legend排列 */
  readonly legendAlign: 'left' | 'right' | 'center';

  /** legend位置 */
  readonly legendPosition: 'left' | 'right' | 'center';

  /** legend横纵排列 */
  readonly legendOrient: 'horizontal' | 'vertical';
}

export interface IApiProps {
  /** 传入的数据  */
  readonly data: IChartMock;

  /** legend字段  */
  readonly legend?: number;

  /** x字段 */
  readonly x: number;

  /** y字段 */
  readonly y: number;
}
