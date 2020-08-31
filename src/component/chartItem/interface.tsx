// 组件自身的配置项
export interface IChartConfig {
  key: string; // key字段
  defaultValue: number | boolean | string; // 默认值
  type?: 'input' | 'switch' | 'purecolor' | 'color' | 'radio' | 'select'; // 配置时的组件类型，默认为 input
  title?: string; // 配置时的标题信息，显示在左侧，当没有设置时将引用 key 作为标题，如本例中的x,y
  [key: string]: any; // 其余配置将全部注入到对应的组件中，如在input组件中可自行设置  min,max,step等
}

// 默认数据定义
export interface IChartDefaultValue {
  data: (string | number)[][];
  title: string;
  header: string[];
  rows: number;
  hash: string;
  [key: string]: any;
}

export interface IChartProps {
  data: IChartDefaultValue;
  [key: string]: any;
}
