// 组件自身的配置项
export interface IChartConfig {
  key: string; // key字段
  defaultValue?: number | boolean | string; // 默认值
  valueType?: 'number' | 'text';
  type?: 'input' | 'switch' | 'purecolor' | 'color' | 'radio' | 'select' | 'range'; // 配置时的组件类型，默认为 input
  title?: string | React.ReactNode; // 配置时的标题信息，显示在左侧，当没有设置时将引用 key 作为标题，如本例中的x,y
  [key: string]: any; // 其余配置将全部注入到对应的组件中，如在input组件中可自行设置  min,max,step等
}

// 默认数据定义
export interface IChartMock {
  data: ((string | number)[] | {})[];
  title: string;
  header: string[];
  rows: number;
  hash: string;
  [key: string]: any;
}

export interface IChartProps {
  data: IChartMock;
  legendPosition?: 'bottom' | 'top' | 'left' | 'right';
  legendAlign?: 'left' | 'center' | 'right';
  renderer: 'canvas' | 'svg';
  [key: string]: any;
}

export interface IApiConfig {
  show: boolean;
  type: 'url' | 'mock';
  url?: string; // 默认地址
  data?: IChartMock;
  config: IChartConfig[];
  interval?: number;
}
