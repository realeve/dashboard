import React from 'react';
import * as R from 'ramda';
import type { EChartsSeriesType } from 'echarts';
import * as Position from '@/component/field/Align/iconPosition';
import * as Align from '@/component/field/Align/iconAlign';
import { BarChartOutlined, LineChartOutlined, AreaChartOutlined } from '@ant-design/icons';
import type { IChartMock, IChartConfig } from '@/component/chartItem/interface';

import { palette } from '@/component/g2plot/palette';
// 获取最佳轴长度
import { nice, quantity } from 'echarts/lib/util/number';

export type tRender = 'canvas' | 'svg';

export interface IChart {
  key?: string;
  title: string;
  default?: string | number;
  url?: string | string[];
  type?: string;
}

export type TChartConfig = IChart[];

export const uniq: <T>(arr: T[]) => T[] = (arr) => R.uniq(arr);
export interface ITooltipFormatter {
  series: { name: string; value: string | number; seriesName: string; color: string }[];
  unit: string | boolean;
  axisName: string;
  append?: boolean;
  shouldDrill?: boolean;
}
export const tooltipFormatter: (param: ITooltipFormatter) => string | false = ({
  series,
  unit,
  axisName,
  append = false,
  shouldDrill = false,
}) => {
  let title: boolean | string = false;
  let str = '';
  const p = series.filter((item) => typeof item.value !== 'undefined');

  if (p.length === 0) {
    return false;
  }

  // let shouldDrill = window.location.hash.includes('dr0_id=');
  const drillTipText = shouldDrill ? '<div style="color:#e23;">( 点击查看详情 )</div>' : '';

  p.forEach((item) => {
    if (!title) {
      title = item.name;
    }

    // 该分支永远不会进入
    // if (title !== item.name) {
    //   return;
    // }

    if (typeof item.value !== 'undefined' && item.value !== '-') {
      str += `<div class="ex_tooltip"><div class="icon" style="background-color:${
        item.color
      };"></div><span>${item.seriesName || axisName}：${
        typeof item.value === 'string' ? Number(item.value) : item.value
      } </span></div>${
        append ? `<div class="ex_tooltip_append">${append[item.seriesName]}</div>` : ''
      }`;
    }
  });
  if (unit) {
    str = unit + str;
  }
  if (title) {
    title = `<div style="font-weight:bold;font-size:20px;height:30px;">${title}</div>`;
  }

  return `${title}${str}${drillTipText}`;
};

export const getTooltipUnit = (title) => {
  let unit: boolean | string = false;
  if (!title) {
    return unit;
  }
  const res = title.match(/\((\S+)\)/);
  if (res && res[1]) {
    unit = `<div style="margin-bottom:5px;display:block;">(单位:${res[1]})</div>`;
  }
  return unit;
};

/**
 *  @param HIDE_DESC 隐藏说明文字
    @param HIDE_ALL 全部隐藏
    @param SHOW_TITLE 显示标题
 */
export enum CHART_MODE {
  HIDE_DESC = 1, // 隐藏说明文字
  HIDE_ALL = 2, // 全部隐藏
  SHOW_TITLE = 3, // 显示标题
}

// 简洁模式
export const handleSimpleMode = (option, config) => {
  if (!config.simple) {
    return option;
  }

  const { yAxis } = option;
  let { xAxis } = option;
  if (yAxis && yAxis.name) {
    Reflect.deleteProperty(yAxis, 'name');
  }
  if (xAxis && xAxis.name) {
    Reflect.deleteProperty(xAxis, 'name');
    xAxis = Object.assign(xAxis, {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    });
    option = Object.assign(option, { xAxis, yAxis });
  }

  if (config.simple === CHART_MODE.HIDE_DESC) {
    // Reflect.deleteProperty(option, 'toolbox');
    const [title]: string = option.title;
    option.title = title;
  } else if (config.simple === CHART_MODE.HIDE_ALL) {
    option.title = {};
    option.toolbox = {};
    option.grid = {
      left: 35,
      right: 10,
      top: 10,
      bottom: 20,
    };
    Reflect.deleteProperty(option, 'dataZoom');
  } else if (config.simple === CHART_MODE.SHOW_TITLE) {
    const [title]: string = option.title;
    option.title = title;
    option.toolbox = {};
    option.grid = {
      left: 35,
      right: 10,
      top: 45,
      bottom: 20,
    };
    Reflect.deleteProperty(option, 'dataZoom');
  }

  return option;
};

// 字符串转日期
export const str2Date: (str: string) => string = (str) => {
  str = String(str);
  const needConvert: boolean = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(0[1-9]|1[0-2])$/.test(
    str,
  );
  if (!needConvert) {
    return str;
  }

  const dates: string[] = [str.substr(0, 4), str.substr(4, 2)];
  if (str.length === 8) {
    dates[2] = str.substr(6, 2);
  }
  return dates.join('-');
};

export const str2Num: (str: string) => number | string = (str) => {
  if (/^(|-)[0-9]+.[0-9]+$/.test(str)) {
    return parseFloat(parseFloat(str).toFixed(3));
  }
  if (/^(|-)[0-9]+$/.test(str)) {
    return parseInt(str, 10);
  }
  return str;
};

export const isDate: (dateStr: string) => boolean = (dateStr) => {
  return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
    dateStr,
  );
};

export const needConvertDate: (dateStr: string) => boolean = (dateStr) => {
  return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(-|)(0[1-9]|1[0-2])$/.test(
    dateStr,
  );
};

export const getDataByIdx: ({ key: string, data: any }) => any[] = ({ key, data }) =>
  R.pluck(key)(data);

export const getUniqByIdx: ({ key: string, data: any }) => any[] = ({ key, data }) =>
  R.uniq(
    getDataByIdx({
      key,
      data,
    }),
  );

export const getDataByKeys = ({ keys, data }: { keys: string[]; data: Record<string, any>[] }) => {
  const _data: Record<string, any>[] = R.project(keys)(data);
  return R.map(R.values)(_data);
};

/**
 * 判断颜色是否为色彩
 * @param str 颜色值
 */
export const isColor = (str: string) => /^rgb\(|^rgba\(|^#[\d|a-f]/.test(String(str).toLowerCase());

export const colors: string[] = [
  '#da0d68',
  '#975e6d',
  '#e0719c',
  '#f99e1c',
  '#ef5a78',
  '#da1d23',
  '#dd4c51',
  '#3e0317',
  '#e62969',
  '#6569b0',
  '#ef2d36',
  '#c94a44',
  '#b53b54',
  '#a5446f',
  '#f2684b',
  '#e73451',
  '#e65656',
  '#f89a1c',
  '#aeb92c',
  '#4eb849',
  '#f68a5c',
  '#baa635',
  '#f7a128',
  '#f26355',
  '#e2631e',
  '#fde404',
  '#7eb138',
  '#ebb40f',
  '#e1c315',
  '#9ea718',
  '#94a76f',
  '#d0b24f',
  '#8eb646',
  '#faef07',
  '#c1ba07',
  '#b09733',
  '#8f1c53',
  '#b34039',
  '#ba9232',
  '#8b6439',
  '#187a2f',
  '#a2b029',
  '#718933',
  '#3aa255',
  '#a2bb2b',
  '#62aa3c',
  '#03a653',
  '#038549',
  '#28b44b',
  '#a3a830',
  '#7ac141',
  '#5e9a80',
  '#0aa3b5',
  '#9db2b7',
  '#8b8c90',
  '#beb276',
  '#744e03',
  '#a3a36f',
  '#c9b583',
  '#978847',
  '#9d977f',
  '#cc7b6a',
  '#db646a',
  '#76c0cb',
  '#80a89d',
  '#def2fd',
  '#7a9bae',
  '#039fb8',
  '#5e777b',
  '#120c0c',
  '#c94930',
  '#caa465',
  '#dfbd7e',
  '#be8663',
  '#b9a449',
  '#899893',
  '#a1743b',
  '#894810',
  '#ddaf61',
  '#b7906f',
  '#eb9d5f',
  '#ad213e',
  '#794752',
  '#cc3d41',
  '#b14d57',
  '#c78936',
  '#8c292c',
  '#e5762e',
  '#a16c5a',
  '#a87b64',
  '#c78869',
  '#d4ad12',
  '#9d5433',
  '#c89f83',
  '#bb764c',
  '#692a19',
  '#470604',
  '#e65832',
  '#d45a59',
  '#310d0f',
  '#ae341f',
  '#d78823',
  '#da5c1f',
  '#f89a80',
  '#f37674',
  '#e75b68',
  '#d0545f',
];

export function hex2rgb(hexVal: string): string {
  let result: string = '';
  hexVal = hexVal.includes('#') ? hexVal.slice(1) : hexVal;
  switch (hexVal.length) {
    case 3:
      result = `${parseInt(`${hexVal[0]}${hexVal[0]}`, 16)},${parseInt(
        `${hexVal[1]}${hexVal[1]}`,
        16,
      )},${parseInt(`${hexVal[2]}${hexVal[2]}`, 16)}`;
      break;
    case 6:
    default:
      result = `${parseInt(`${hexVal[0]}${hexVal[1]}`, 16)},${parseInt(
        `${hexVal[2]}${hexVal[3]}`,
        16,
      )},${parseInt(`${hexVal[4]}${hexVal[5]}`, 16)}`;
      break;
  }
  return result;
}
// 将数值从 0-255 转换成16进制字符串
const toHex = (value: number): string => {
  const x16Value = Math.round(value).toString(16);

  return x16Value.length === 1 ? `0${x16Value}` : x16Value;
};

export type arrRgb = string[];
export const rgb2hex = (str) => {
  if (str[0] === '#') {
    return str;
  }
  const val = str.replace(/(rgb|a|\(|\))/g, '').split(',');
  const alpha = val.length === 4 ? Math.ceil(Number(val[3]) * 255) : 255;
  val[3] = alpha;
  return `#${val.map(toHex).join('')}`;
};

export const getLegendData: <T>(
  arr: T[],
) => {
  icon: string;
  name: T;
}[] = (legendData) =>
  legendData.map((name) => ({
    name,
    icon: 'circle',
  }));

export type tGl =
  | 'bar3d'
  | 'line3d'
  | 'scatter3d'
  | 'surface'
  | 'sunburst'
  | 'sankey'
  | 'paralell'
  | 'calendar'
  | EChartsSeriesType;
export const chartGL: tGl[] = ['bar3d', 'line3d', 'scatter3d', 'surface'];

export const getRenderer: (params: {
  render?: tRender;
  type: string;
  histogram?: string;
}) => tRender = (params) =>
  params.render ||
  (['paralell', ...chartGL].includes(params.type) || params.histogram ? 'canvas' : 'svg');

export interface Iparams {
  type: tGl;
  height?: string | number;
  size?: number;
}

interface IPositionConfig {
  key?: string;
  defaultValue?: string | number | boolean;
  title: string;
  type: 'radio' | 'range' | 'divider' | 'switch';
  option?: {
    title: string | React.ReactNode;
    value: string | number | boolean;
  }[];
}

export const getLegendConfig: () => IPositionConfig[] = () => [
  {
    type: 'divider',
    title: '图例配置',
  },
  {
    key: 'legendShow',
    defaultValue: true,
    type: 'switch',
    title: '显示图例',
  },
  {
    key: 'legendAlign',
    defaultValue: 'center',
    title: '对齐',
    type: 'radio',
    option: [
      {
        title: <Align.AlignLeftIcon style={{ color: '#fff' }} />,
        value: 'left',
      },
      {
        title: <Align.AlignCenterIcon style={{ color: '#fff' }} />,
        value: 'center',
      },
      {
        title: <Align.AlignRightIcon style={{ color: '#fff' }} />,
        value: 'right',
      },
    ],
  },
  {
    key: 'legendPosition',
    defaultValue: 'top',
    title: '位置',
    type: 'radio',
    option: [
      {
        title: <Position.TopIcon title="上方" style={{ color: '#fff' }} />,
        value: 'top',
      },
      {
        title: <Position.RightIcon title="右方" style={{ color: '#fff' }} />,
        value: 'right',
      },
      {
        title: <Position.BottomIcon title="下方" style={{ color: '#fff' }} />,
        value: 'bottom',
      },
      {
        title: <Position.LeftIcon title="左方" style={{ color: '#fff' }} />,
        value: 'left',
      },
    ],
  },
  {
    key: 'legendOrient',
    defaultValue: 'horizontal',
    title: '排列方式',
    type: 'radio',
    option: [
      {
        title: '水平',
        value: 'horizontal',
      },
      {
        title: '垂直',
        value: 'vertical',
      },
    ],
  },
];

export const getPositionConfig: () => IPositionConfig[] = () => [
  ...getLegendConfig(),
  {
    type: 'divider',
    title: '拆线图样式',
  },
  {
    key: 'smooth',
    defaultValue: true,
    title: '曲线类型',
    type: 'radio',
    option: [
      {
        title: <i className="datav-icon gui-icons datav-gui-icon-smooth-line datav-gui-icon" />,
        value: true,
      },
      {
        title: <i className="datav-icon gui-icons datav-gui-icon-poly-line datav-gui-icon" />,
        value: false,
      },
    ],
  },
  {
    key: 'area_opacity',
    defaultValue: 1,
    title: '面积图透明度',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    key: 'lineWidth',
    defaultValue: 2,
    title: '线宽',
    type: 'range',
    min: 1,
    max: 20,
    step: 1,
  },
];

export const getG2LegendOption = ({
  legendAlign = 'center',
  legendPosition = 'top',
  legendOrient = 'horizontal',
  legendShow = true,
}) => {
  if (!legendShow) {
    return { legend: false };
  }
  // position：top | top-left | top-right | right | right-top | right-bottom | left | left-top | left-bottom | bottom | bottom-left | bottom-right
  let position = '';
  if (['top', 'bottom'].includes(legendPosition)) {
    const vPos = legendAlign === 'center' ? '' : `-${legendAlign}`;
    position = legendPosition + vPos;
  } else {
    const vPos = legendPosition === 'center' ? '' : `${legendPosition}`;
    position = vPos + { left: '-top', right: '-bottom', center: '' }[legendAlign];
  }
  return {
    legend: {
      layout: legendOrient,
      position,
    },
  };
};

/**
 * 获取 ECharts legend 配置信息
 * @param param0
 */
export const getLegendOption = ({
  legendAlign = 'center',
  legendPosition = 'top',
  legendOrient = 'horizontal',
  legendShow = true,
}) => {
  let legend = {};
  if (['top', 'bottom'].includes(legendPosition)) {
    legend = {
      [legendPosition]: 15,
      left: legendAlign,
      orient: legendOrient,
    };
  } else {
    const position = {
      left: 'top',
      center: 'middle',
      right: 'bottom',
    };
    legend = {
      [legendPosition]: 15,
      top: position[legendAlign],
      orient: legendOrient,
    };
  }
  return {
    show: legendShow,
    icon: 'circle',
    textStyle: {
      color: '#ddd',
    },
    ...legend,
  };
};

// 图表类型，返回 柱状图，曲线图，面积图
export const chartType = {
  type: 'radio',
  option: [
    {
      title: <BarChartOutlined style={{ color: '#fff' }} />,
      value: 'bar',
    },
    {
      title: <LineChartOutlined style={{ color: '#fff' }} />,
      value: 'line',
    },
    {
      title: <AreaChartOutlined style={{ color: '#fff' }} />,
      value: 'area',
    },
  ],
};

export const getChartType = (type: string, opacity = 1) => {
  if (type === 'area') {
    return {
      type: 'line',
      areaStyle: { opacity },
    };
  }
  return { type };
};

// 文字配置
export const getFontConfig: (fontSize?: number, color?: string) => IChartConfig[] = (
  fontSize = 18,
  color = '#f2f2f2',
) => [
  {
    type: 'divider',
    title: '文字样式',
  },
  {
    key: 'fontSize',
    defaultValue: fontSize,
    title: '字号',
    step: 1,
    type: 'range',
    min: 12,
    max: 100,
  },
  {
    key: 'fontWeight',
    defaultValue: 'normal',
    title: '加粗',
    type: 'radio',
    option: [
      {
        title: <div style={{ fontWeight: 'lighter', fontSize }}>Aa</div>,
        value: 'lighter',
      },
      {
        title: <div style={{ fontWeight: 'normal', fontSize }}>Aa</div>,
        value: 'normal',
      },
      {
        title: <div style={{ fontWeight: 'bold', fontSize }}>Aa</div>,
        value: 'bold',
      },
      {
        title: <div style={{ fontWeight: 'bolder', fontSize }}>Aa</div>,
        value: 'bolder',
      },
    ],
  },
  {
    key: 'textAlign',
    defaultValue: 'center',
    title: '对齐',
    type: 'radio',
    option: [
      {
        title: <Align.AlignLeftIcon style={{ color: '#fff' }} />,
        value: 'left',
      },
      {
        title: <Align.AlignCenterIcon style={{ color: '#fff' }} />,
        value: 'center',
      },
      {
        title: <Align.AlignRightIcon style={{ color: '#fff' }} />,
        value: 'right',
      },
    ],
  },
  {
    key: 'fontColor',
    defaultValue: color,
    title: '颜色',
    type: 'purecolor',
  },
  {
    key: 'letterSpacing',
    defaultValue: 0,
    title: '字间距',
    step: 1,
    type: 'range',
    min: 0,
    max: 100,
  },
];

export const getAntThemePanel: () => IChartConfig = () => ({
  key: 'theme',
  defaultValue: 'cbpc',
  title: '主题色',
  type: 'antselect',
  option: palette.map((item, idx) => {
    if (idx > palette.length - 3) {
      return item;
    }
    return {
      ...item,
      title: <img src={item.title} style={{ height: 30 }} />,
    };
  }),
});

/**
 * 获取指定值的最低轴长度,用于根据数值手工计算Y轴最小值用于渲染
 * @param val 数值
 */
export const getMin = (val: number | string) => {
  val = Number(val);
  if (val < 0) {
    // eslint-disable-next-line
    return -getMax(-val);
  }
  if (val < 10) {
    return 0;
  }
  return val - (val % quantity(val));
  // let pow = 10 ** Math.floor(Math.log(val) / Math.log(10));
  // return (Number(String(val)[0]) - 1) * pow;
};

/**
 * 获取指定值的最佳轴长度,用于根据数值手工计算Y轴最大值用于渲染
 * 参考：https://github.com/apache/incubator-echarts/blob/master/src/util/number.ts
 * @param val 数值
 */
export const getMax = (val: number | string) => {
  val = Number(val);
  if (val < 0) {
    return -getMin(-val);
  }
  // let pow = 10 ** Math.floor(Math.log(val) / Math.log(10));
  // return (Number(String(val)[0]) + 1) * pow;
  return nice(val);
};

export const getBarMax = (data, y: number | string = 1) => {
  const item = R.last(data)[y];
  return getMax(item);
};
// 处理minmax值至最佳刻度，需要考虑 >10 及 <10 两种场景以及负数的情况
export const handleMinMax: (params: {
  min: number;
  max: number;
}) => {
  min: number;
  max: number;
} = ({ min, max }) => {
  // let exLength: number = String(Math.floor(max)).length - 1;
  // if (max > 10) {
  //   return {
  //     max: Math.ceil(max / 10 ** exLength) * 10 ** exLength,
  //     min: min - (min % 10 ** exLength),
  //   };
  // }
  // return {
  //   max: Math.ceil(max / 1) * 1,
  //   min: min > 0 ? min - (min % 1) : Math.floor(min / 1) * 1,
  // };
  return {
    min: getMin(min),
    max: getMax(max),
  };
};

/**
 * 计算获取饼图百分比
 * @param param0
 */
export const getPercent = ({ data, y: _y, header }) => {
  const _data = R.clone(data);

  /**
   * 2020-12-05 写单元测试时做以下调整：
   * 此处返回值是增加一项 percent存储数据的百分比，数据结构只能为对象，
   * 不能为数组，故此处无需判断是否为array;
   */
  // let isArray = 'Array' == R.type(_data[0]);
  // let arr: number[] = R.pluck(isArray ? _y : header[_y], _data);
  const arr: number[] = R.pluck(header[_y], _data);

  const percent = getPercentWithPrecision(arr, 2);
  return _data.map((item, i) => {
    item.percent = percent[i];
    return item;
  });
};

/** Get a data of given precision, assuring the sum of percentages
 * in valueList is 1.
 * The largest remainer method is used.
 * https://en.wikipedia.org/wiki/Largest_remainder_method
 *(最大余额法)
 * https://github.com/apache/incubator-echarts/blob/master/src/util/number.ts#L215
 */

export function getPercentWithPrecision(
  valueList: (number | '-')[],
  precision: number = 2,
): number[] {
  const sum = valueList.reduce((acc, val) => acc + (Number.isNaN(val) || val === '-' ? 0 : val), 0);
  // console.log(sum);
  if (sum === 0) {
    return valueList.map(() => 0);
  }

  const digits = 10 ** precision;
  const votesPerQuota = valueList.map(
    (val: number | '-') => ((Number.isNaN(val) || val === '-' ? 0 : val) / sum) * digits * 100,
  );
  const targetSeats = digits * 100;

  // Assign automatic seats.
  const seats = votesPerQuota.map((votes) => Math.floor(votes));
  let currentSum = seats.reduce((acc, val) => acc + val, 0);

  const remainder = votesPerQuota.map((votes, idx) => votes - seats[idx]);

  // Has remainding votes.
  while (currentSum < targetSeats) {
    // Find next largest remainder.
    let max = Number.NEGATIVE_INFINITY;
    let maxId = null;
    for (let i = 0, len = remainder.length; i < len; i++) {
      if (remainder[i] > max) {
        max = remainder[i];
        maxId = i;
      }
    }

    // Add a vote to max remainder.
    seats[maxId] += 1;
    remainder[maxId] = 0;
    currentSum += 1;
  }

  return seats.map((item) => item / digits);
}

export const disableLegend: IChartConfig = {
  key: 'disableLegend',
  title: '禁用legend',
  defaultValue: false,
  type: 'switch',
};

/**
 * 数据排序配置项
 */
export const orderOption: IChartConfig = {
  key: 'order',
  title: '对Y轴排序',
  defaultValue: '不排序',
  type: 'radio',
  option: `不排序,升序,降序`,
};

/**
 * 对数据排序
 * @param order 排序方式
 * @param data 原始数据
 * @param key 需要排序的索引字段
 */
export const orderDataByValue = ({
  order,
  data,
  key,
}: {
  order: '不排序' | '升序' | '降序';
  data: IChartMock;
  key: string | number;
}) => {
  if (!data) {
    return null;
  }
  const nextData = R.clone(data);
  if (order === '不排序') {
    return nextData;
  }
  const orderFn = order === '升序' ? R.ascend(R.prop(String(key))) : R.descend(R.prop(String(key)));
  return {
    ...nextData,
    data: R.sort(orderFn)(
      nextData.data.map((item) => ({
        ...item,
        [key]: Number(item[key]),
      })),
    ),
  };
};
