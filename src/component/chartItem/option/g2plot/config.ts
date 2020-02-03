export interface IG2Config {
  data: (string | number)[][];
  header: string[];
  legend?: string | number; // legend 序列
  x?: string | number; // x 序列
  y?: string | number; // y 序列
  showLegend?: boolean; // 显示legend
  direction?: 'horizontal' | 'vertical';
  smooth?: boolean; //平滑曲线
  stack?: boolean; // 堆叠
  group?: boolean; //分组
  point?: boolean; // 显示曲线上的点
  area?: boolean; //曲面图
  step?: null | 'hv' | 'vh' | 'vhv' | 'hvh'; //阶梯图
  percent?: boolean; //百分比堆叠图
  thumbnail?: boolean; // 显示缩略图
  labelStyle?: 'line' | 'area'; //标签跟随样式
  [key: string]: any;
}
