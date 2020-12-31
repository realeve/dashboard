import type { ILegendProps, IApiProps } from '../interface';

export type IBasePieProps = {
  /** 主题 */
  theme: number | string;

  /** 图表类型  */
  chartType: 'pie' | 'rose' | 'area';

  /** 内径 */
  innerRadius: number;

  /** 标签位置 */
  labelPosition: string;

  /** 标签对齐方式 */
  labelAlign: string;

  /** 边框线宽 */
  borderWidth: number;

  /** 边框线颜色 */
  borderColor: string;

  /** 内圆角 */
  borderRadiusInner: number;

  /** 外圆角 */
  borderRadiusOutter: number;

  /** 标签距边缘距离 */
  edgeDistance: number;

  /** 值字号 */
  valueFontSize: number;

  /** 标签字号 */
  labelFontSize: number;
} & ILegendProps & IApiProps
