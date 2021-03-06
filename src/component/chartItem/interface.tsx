// 组件自身的配置项

export type TFormConfigType =
  | 'input'
  | 'switch'
  | 'slider'
  | 'purecolor'
  | 'color'
  | 'radio'
  | 'select'
  | 'antselect'
  | 'range'
  | 'divider'
  | 'image'
  | 'label';
export interface IChartConfig {
  key?: string; // key字段
  defaultValue?: number | boolean | string | number[]; // 默认值
  valueType?: 'number' | 'text';
  type?: TFormConfigType; // 配置时的组件类型，默认为 input
  title?: string | React.ReactNode; // 配置时的标题信息，显示在左侧，当没有设置时将引用 key 作为标题，如本例中的x,y
  subTitle?: string | React.ReactNode; // 副标题
  // noAnimation?: boolean; // purecolor 状态下是否显示动画
  [key: string]: any; // 其余配置将全部注入到对应的组件中，如在input组件中可自行设置  min,max,step等
}

export type TChartMockData = (string | number)[] | Record<string, any>;
// 默认数据定义
export interface IChartMock {
  data: TChartMockData[];
  title: string;
  header: string[];
  rows: number;
  hash: string;
  serverTime?: string;
  [key: string]: any;
}

export interface IChartProps {
  data: IChartMock;
  legendPosition?: 'bottom' | 'top' | 'left' | 'right';
  legendAlign?: 'left' | 'center' | 'right';
  legendOrient?: 'horizontal' | 'vertical';
  renderer: 'canvas' | 'svg';
  [key: string]: any;
}

export interface IApiConfig {
  show?: boolean;
  type?: 'url' | 'mock';
  url?: string; // 默认地址
  data?: IChartMock;
  config?: IChartConfig[];
  cache?: number; // 缓存时长
  interval?: number;
  dataType?: 'array' | 'json';
}

export interface IG2PlotProps {
  data: IChartMock;
  chartType?: string;
  renderer?: 'svg' | 'canvas';
  theme?: string | number;
  legendShow: boolean;
  legendAlign: 'left' | 'center' | 'right';
  legendPosition: 'top' | 'center' | 'bottom';
  legendOrient: 'vertical' | 'horizontal';
  [key: string]: any;
}
