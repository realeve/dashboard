import * as lib from '@/utils/lib';
import * as R from 'ramda';
import { EChartsSeriesType } from 'echarts';
import * as Position from '@/component/field/Align/iconPosition';
import * as Align from '@/component/field/Align/iconAlign';
import { BarChartOutlined, LineChartOutlined, AreaChartOutlined } from '@ant-design/icons';

export interface IChart {
  key?: string;
  title: string;
  default?: string | number;
  url?: string | Array<string>;
  type?: string;
}

export type TChartConfig = Array<IChart>;

let uniq: <T>(arr: Array<T>) => Array<T> = arr => R.uniq(arr);

export const tooltipFormatter = (p, unit, axisName, append = false) => {
  let title: boolean | string = false;
  let str = '';
  p = p.filter(item => typeof item.value !== 'undefined');

  if (p.length === 0) {
    return;
  }

  let shouldDrill = window.location.hash.includes('dr0_id=');
  let drillTipText = shouldDrill ? '<div style="color:#e23;">( 点击查看详情 )</div>' : '';

  p.forEach((item, idx) => {
    if (!title) {
      title = item.name;
    }
    if (title !== item.name) {
      return;
    }

    if (typeof item.value !== 'undefined' && item.value !== '-') {
      str +=
        `<div class="ex_tooltip"><div class="icon" style="background-color:${
          item.color
        };"></div><span>${item.seriesName || axisName}：${
          typeof item.value === 'string' ? Number(item.value) : item.value
        } </span></div>` +
        (append ? `<div class="ex_tooltip_append">${append[item.seriesName]}</div>` : '');
    }
  });
  if (unit) {
    str = unit + str;
  }
  if (title) {
    title = `<div style="font-weight:bold;font-size:20px;height:30px;">${title}</div>`;
  }

  return `${title}${str}${drillTipText}` || false;
};

export const getTooltipUnit = title => {
  let unit: boolean | string = false;
  if (!title) {
    return unit;
  }
  let res = title.match(/\((\S+)\)/);
  if (res && res[1]) {
    unit = `<div style="margin-bottom:5px;display:block;">(单位:${res[1]})</div>`;
  }
  return unit;
};

let handleDefaultOption = (option, config, showDateRange = true) => {
  let renderer = getRenderer(config);
  let toolbox = option.toolbox || {
    feature: {
      dataZoom: {},
      magicType: {
        type: ['line', 'bar', 'stack', 'tiled'],
      },
    },
  };
  toolbox = Object.assign(toolbox, {
    feature: {
      saveAsImage: {
        type: renderer === 'svg' ? 'svg' : 'png',
      },
    },
  });

  let defaultLegend = {
    type: 'scroll',
    width: 500,
    align: 'right',
    textStyle: {
      color: '#666',
    },
  };

  if (R.isNil(option.legend)) {
    option.legend = defaultLegend;
  }

  option = Object.assign(
    {
      toolbox,
      tooltip: {},
      legend: defaultLegend,
    },
    option,
  );

  if (['bar', 'line'].includes(config.type)) {
    let axisPointerType: 'shadow' | 'cross' = 'shadow';
    let tooltipTrigger: string = 'axis';
    switch (config.type) {
      case 'bar':
        axisPointerType = 'shadow';
        break;
      case 'line':
      default:
        axisPointerType = 'cross';
        break;
    }

    /**
     * 该语法可代替
     * let axisName = option&&option.yAxis&&option.yAxis.name;
     */
    let axisName = option?.yAxis?.name;
    let unit = getTooltipUnit(config?.data?.title);

    option.tooltip = {
      trigger: tooltipTrigger,
      axisPointer: {
        type: axisPointerType,
      },
      formatter: p => tooltipFormatter(p, unit, axisName),
    };

    if (config.histogram) {
      option.tooltip = {};
      // Reflect.deleteProperty(option, 'dataZoom');
    }
  }

  //全局处理
  option = handleSimpleMode(option, config);
  return option;
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

  let { xAxis, yAxis } = option;
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

  if (config.simple == CHART_MODE.HIDE_DESC) {
    // Reflect.deleteProperty(option, 'toolbox');
    let [title]: string = option.title;
    option.title = title;
  } else if (config.simple == CHART_MODE.HIDE_ALL) {
    option.title = {};
    option.toolbox = {};
    option.grid = {
      left: 35,
      right: 10,
      top: 10,
      bottom: 20,
    };
    Reflect.deleteProperty(option, 'dataZoom');
  } else if (config.simple == CHART_MODE.SHOW_TITLE) {
    let [title]: string = option.title;
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
export let str2Date: (str: string) => string = str => {
  str = String(str);
  let needConvert: boolean = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(0[1-9]|1[0-2])$/.test(
    str,
  );
  if (!needConvert) {
    return str;
  }

  let dates: Array<string> = [str.substr(0, 4), str.substr(4, 2)];
  if (str.length === 8) {
    dates[2] = str.substr(6, 2);
  }
  return dates.join('-');
};

export let str2Num: (str: string) => number | string = str => {
  if (/^(|\-)[0-9]+.[0-9]+$/.test(str)) {
    return parseFloat(parseFloat(str).toFixed(3));
  }
  if (/^(|\-)[0-9]+$/.test(str)) {
    return parseInt(str, 10);
  }
  return str;
};

export let isDate: (dateStr: string) => boolean = dateStr => {
  return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
    dateStr,
  );
};

export let needConvertDate: (dateStr: string) => boolean = dateStr => {
  return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(-|)(0[1-9]|1[0-2])$/.test(
    dateStr,
  );
};

export let getDataByIdx: ({ key: string, data: any }) => Array<any> = ({ key, data }) =>
  R.pluck(key)(data);

export let getUniqByIdx: ({ key: string, data: any }) => Array<any> = ({ key, data }) =>
  R.uniq(
    getDataByIdx({
      key,
      data,
    }),
  );

export let getDataByKeys = ({ keys, data }) => {
  let _data = R.project(keys)(data);
  return R.map(R.values)(_data);
};

export const colors: Array<string> = [
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
  '#fefef4',
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
  var result: string = '';
  hexVal = hexVal.includes('#') ? hexVal.slice(1) : hexVal;
  switch (hexVal.length) {
    case 3:
      result =
        parseInt(hexVal[0] + '' + hexVal[0], 16) +
        ',' +
        parseInt(hexVal[1] + '' + hexVal[1], 16) +
        ',' +
        parseInt(hexVal[2] + '' + hexVal[2], 16);
      break;
    case 6:
    default:
      result =
        parseInt(hexVal[0] + '' + hexVal[1], 16) +
        ',' +
        parseInt(hexVal[2] + '' + hexVal[3], 16) +
        ',' +
        parseInt(hexVal[4] + '' + hexVal[5], 16);
      break;
  }
  return result;
}

export type arrRgb = Array<string>;
export const rgb2hex = str => {
  if (str[0] === '#') {
    return str;
  }
  let val = str.replace(/(rgb|a|\(|\))/g, '').split(',');
  let alpha = val.length === 4 ? Math.ceil(Number(val[3]) * 255) : 255;
  val[3] = alpha;
  return (
    '#' +
    val
      .map(item =>
        Number(item)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
};

export let getLegendData: <T>(
  arr: Array<T>,
) => Array<{
  icon: string;
  name: T;
}> = legendData =>
  legendData.map(name => ({
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
export let chartGL: Array<tGl> = ['bar3d', 'line3d', 'scatter3d', 'surface'];

export type tRender = 'canvas' | 'svg';
export let getRenderer: (params: {
  render?: tRender;
  type: string;
  histogram?: string;
}) => tRender = params =>
  params.render ||
  (['paralell', ...chartGL].includes(params.type) || params.histogram ? 'canvas' : 'svg');

export interface Iparams {
  type: tGl;
  height?: string | number;
  size?: number;
}

export type chartHeightFun = (params: Iparams, data: any) => string;

export let getChartHeight: chartHeightFun = (params: Iparams, option) => {
  if (params.height) {
    return params.height + 'px';
  }
  // , ...chartGL
  let height: string = ['sunburst', 'sankey', 'paralell'].includes(params.type)
    ? '900px'
    : chartGL.includes(params.type)
    ? '700px'
    : '500px';
  if (params.type === 'calendar') {
    if (!R.isNil(option.series)) {
      height = 100 + option.series.length * (6 * params.size + 70) + 'px';
    } else {
      height = '800px';
    }
  }
  return height;
};

// 处理minmax值至最佳刻度，需要考虑 >10 及 <10 两种场景以及负数的情况
export let handleMinMax: (params: {
  min: number;
  max: number;
}) => {
  min: number;
  max: number;
} = ({ min, max }) => {
  let exLength: number = String(Math.floor(max)).length - 1;
  if (max > 10) {
    return {
      max: Math.ceil(max / 10 ** exLength) * 10 ** exLength,
      min: min - (min % 10 ** exLength),
    };
  }
  return {
    max: Math.ceil(max / 1) * 1,
    min: min > 0 ? min - (min % 1) : Math.floor(min / 1) * 1,
  };
};

export let getLegend: (
  params: any,
  selectedMode?: string,
) => {
  show?: boolean;
  selectedMode?: string;
  data?: any;
} = ({ data, legend }, selectedMode = 'single') => {
  if (R.isNil(legend)) {
    return {
      show: false,
    };
  }
  let key: string = data.header[legend];
  let legendData = getUniqByIdx({
    key,
    data: data.data,
  });
  return {
    selectedMode,
    data: getLegendData(legendData),
  };
};

export type axis = 'value' | 'category';
// 获取指定key对应的轴数据
export let getAxis: (
  param: { data: any; header: string[] },
  key: string,
) => {
  xAxis: Array<string | number>;
  xAxisType: axis;
} = ({ data, header }, key) => {
  let xAxis = getUniqByIdx({
    key: header[key],
    data,
  });
  let xAxisType: axis = lib.isNumOrFloat(xAxis[0]) ? 'value' : 'category';

  if (xAxisType === 'value') {
    xAxis = R.sort((a, b) => a - b)(xAxis);
  }
  return {
    xAxis,
    xAxisType,
  };
};

interface IPositionConfig {
  key: string;
  defaultValue: string | number | boolean;
  title: string;
  type: 'radio' | 'range';
  option?: {
    title: string | React.ReactNode;
    value: string | number | boolean;
  }[];
}

export const getPositionConfig: () => IPositionConfig[] = () => [
  {
    key: 'legendAlign',
    defaultValue: 'center',
    title: '图例对齐',
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
    title: '图例位置',
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
    key: 'smooth',
    defaultValue: true,
    title: '曲线样式',
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

export const getLegendPosition = ({ legendAlign = 'center', legendPosition = 'top' }) => {
  if (['top', 'bottom'].includes(legendPosition)) {
    return {
      [legendPosition]: 15,
      left: legendAlign,
    };
  }
  let position = {
    left: 'top',
    center: 'middle',
    right: 'bottom',
  };
  return {
    [legendPosition]: 15,
    top: position[legendAlign],
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
export const getFontConfig = (fontSize = 18, color = '#f2f2f2') => [
  {
    key: 'fontSize',
    defaultValue: fontSize,
    title: '文字字号',
    step: 1,
    type: 'range',
    min: 12,
    max: 60,
  },
  {
    key: 'fontWeight',
    defaultValue: 'normal',
    title: '文字加粗',
    type: 'radio',
    option: [
      {
        title: <div style={{ fontWeight: 'lighter', fontSize: fontSize }}>Aa</div>,
        value: 'lighter',
      },
      {
        title: <div style={{ fontWeight: 'normal', fontSize: fontSize }}>Aa</div>,
        value: 'normal',
      },
      {
        title: <div style={{ fontWeight: 'bold', fontSize: fontSize }}>Aa</div>,
        value: 'bold',
      },
      {
        title: <div style={{ fontWeight: 'bolder', fontSize: fontSize }}>Aa</div>,
        value: 'bolder',
      },
    ],
  },
  {
    key: 'fontColor',
    defaultValue: color,
    title: '文字颜色',
    type: 'purecolor',
  },
];
