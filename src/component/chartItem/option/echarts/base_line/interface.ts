import type { ILegendProps, IApiProps } from '../interface';

export type IEchartsBaselineProps = {
  /** 主题 */
  readonly theme: number | string;

  /** 主题颜色逆序，用于处理X/Y交换时的颜色问题  */
  readonly needRerverse: boolean;

  /** 图表类型  */
  readonly chartType: 'bar' | 'line';

  /** 面积图  */
  readonly isArea: boolean;

  /** 阶梯图 */
  readonly isStep: boolean;

  /** 极坐标系 */
  readonly isPolar: boolean;

  /** 堆叠图 */
  readonly isStack: boolean;

  /** 百分比图 */
  readonly isPercent: boolean;

  /** 平滑曲线 */
  readonly smooth: boolean;

  /** 交换XY轴 */
  readonly isReverse: boolean;

  /** 显示X轴线 */
  readonly showX: boolean;

  /** 显示Y轴标签 */
  readonly showY: boolean;

  /** 显示尾部跟随标签 */
  readonly showEndlabel: boolean;

  /** 显示标记点 */
  readonly showMarkpoint: false | 'minmax' | 'min' | 'max';

  /** 显示标记线 */
  readonly showMarkline: boolean;

  /** 显示标记区域 */
  readonly showMarkArea: boolean;

  /** 标记区域颜色1，区域将在2个颜色间间隔排列 */
  readonly markAreaColor;

  /** 标记区域颜色2，区域将在2个颜色间间隔排列 */
  readonly markAreaColor2;

  /** 标记区域标题  */
  readonly markTitle1?: string;

  /** 标记区域值 */
  readonly markArea1: [number, number];

  /** 标记区域标题  */
  readonly markTitle2?: string;

  /** 标记区域值 */
  readonly markArea2: [number, number];

  /** 标记区域标题  */
  readonly markTitle3?: string;

  /** 标记区域值 */
  readonly markArea3: [number, number];

  /** 标记区域标题  */
  readonly markTitle4?: string;

  /** 标记区域值 */
  readonly markArea4: [number, number];

  /** 标记区域标题  */
  readonly markTitle5?: string;

  /** 标记区域值 */
  readonly markArea5: [number, number];

  /** 柱状图显示背景 */
  readonly showBackground: boolean;

  /** 柱状图背景颜色 */
  readonly barBackgroundColor: string;

  /** 显示数据标签 */
  readonly showLabel: boolean;

  /** 面积图透明度 */
  readonly area_opacity: number;

  /** 曲线线宽 */
  readonly lineWidth: number;

  /** 柱状宽度 */
  readonly barWidth: number;

  /** 曲线图显示symbol标记 */
  readonly showSymbol: boolean;

  /** 曲线图symbol标记样式 */
  readonly symbol: string;
  /** 曲线图symbol标记大小 */
  readonly symbolSize: number;

  /** 极坐标下圆角显示 */
  readonly roundCap: boolean;

  /** 鼠标移入时，tooltip对应的坐标轴样式 */
  readonly axisPointer: 'shadow' | 'cross' | 'line';

  /** 标签样式 */
  readonly fontSize: number;
  readonly fontColor: string;

  /** 数据排序方式 */
  readonly order: '不排序' | '升序' | '降序';

  /** 是否禁用legend数据 */
  readonly disableLegend: boolean;
} & ILegendProps &
  IApiProps;

export interface ISeries {
  name: string;
  coordinateSystem: string;
  data: (number | string)[];
  stack: boolean;
  type: string;
  step: boolean;
  smooth: boolean;
  lineStyle: {
    width: number;
  };
  areaStyle: {
    opacity: number;
  };
  markPoint: {
    silent: boolean;
    data: {
      name: string;
      type: string;
    }[];
  };
  barWidth: number;
  symbol: string;
  symbolSize: number;
  showSymbol: boolean;
  label: {
    show: boolean;
    position: string;
    color: string;
  };
  showBackground: boolean;
  backgroundStyle: {
    color: string;
  };
  roundCap: boolean;
}
