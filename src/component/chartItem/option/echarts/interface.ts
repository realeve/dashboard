import type { IChartMock } from '@/component/chartItem/interface';

export type ILegendProps = {
  /** 显示legend */
  readonly legendShow: boolean;
  /** legend排列 */
  readonly legendAlign: 'left' | 'right' | 'center';

  /** legend位置 */
  readonly legendPosition: 'left' | 'right' | 'center';

  /** legend横纵排列 */
  readonly legendOrient: 'horizontal' | 'vertical';
}

export type IApiProps = {
  /** 传入的数据  */
  readonly data: IChartMock;

  /** legend字段  */
  readonly legend?: number;

  /** x字段 */
  readonly x: number;

  /** y字段 */
  readonly y: number;
}
