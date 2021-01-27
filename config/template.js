/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');
const [, , ...argv] = process.argv;
const dirName = argv[0];
const chartType = argv[1] || 'echarts';
const R = require('ramda');
const beautify = require('js-beautify');
const moment = require('dayjs');
let components = require('../public/components.json');
const now = () => moment().format('YYYY-MM-DD HH:mm:ss');

// 测试模式，只打印，不改文件
const DEBUG_MODE = false;

const beautyOption = {
  indent_size: 2,
  wrap_line_length: 80,
  jslint_happy: true,
};
let nextIndex = 0;

// npm run add your_chart_name echarts/g2/other

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

let dir = './src/component/chartItem/';

const getCharts = () => {
  let str = fs.readFileSync(dir + 'option/index.ts', 'utf8');
  let chartArr = eval(str.match(/\[(\S|\s)+\]/)[0]);

  if (chartArr.includes(dirName)) {
    console.error(dirName + '图表已存在，请更换名称');
    return false;
  }
  return chartArr;
};

const handleOptionIndex = () => {
  const chartArr = getCharts();
  if (!chartArr) {
    return;
  }
  let nextIndex = chartArr.length + 1;

  let nextOption = str.replace('];', `  '${dirName}',\n];`);

  let fileStr = `/*
    时间：${now()}
    类型: ${chartType}
    序号：${nextIndex}
    名称：你的图表名称
*/ 
import * as ${dirName} from '../option/${chartType}/${dirName}';

export default ${dirName}; 
`;
  if (DEBUG_MODE) {
    console.log(str);
    return true;
  }
  // 先写文件内容
  handleTemplate();

  // 再注入导出的项
  fs.writeFileSync(`${dir}charts/${dirName}.ts`, fileStr);

  // 最后将图表列表写入
  fs.writeFileSync(dir + 'option/index.ts', nextOption);

  console.log('1.组件 lib 导出文件完成');
  return true;
};

/**
 * 处理components.json文件
 */
const handleComponents = () => {
  let lastComponent = R.last(components);
  lastComponent.list[0].list = [
    {
      name: `${chartType}.${dirName}`,
      key: dirName,
      engine: chartType,
      type: 'regular_bar',
      title: '请设置图表名称',
      image: '/img/icons/01_barChartPositiveNegative.png.webp',
    },
  ];
  components = [...R.init(components), lastComponent];
  let str = beautify(JSON.stringify(components), beautyOption);
  if (DEBUG_MODE) {
    console.log(str);
  } else {
    fs.writeFileSync('./public/components.json', str);
  }

  const mock = `{
    "data": [
      ["类目1", "1月", 175],
      ["类目2", "1月", 210],
      ["类目1", "2月", 125],
      ["类目2", "2月", 140],
      ["类目1", "3月", 98],
      ["类目2", "3月", 120],
      ["类目1", "4月", 120],
      ["类目2", "4月", 140],
      ["类目1", "5月", 50],
      ["类目2", "5月", 60]
    ],
    "title": "某数据_MOCK数据",
    "header": ["月份", "类型", "交易发生值"],
    "rows": 10,
    "hash": "mockdata"
  }
  `;
  fs.writeFileSync(`./public/mock/${nextIndex}_${dirName}.json`, mock);
  console.log('2.组件列表配置文件完成');
};

const getTemplateFile = () => {
  const mockStr = `
export const mock: IChartMock = {
    data: [
    ['类目1', '1月', 175],
    ['类目2', '1月', 210],
    ['类目1', '2月', 125],
    ['类目2', '2月', 140],
    ['类目1', '3月', 98],
    ['类目2', '3月', 120],
    ['类目1', '4月', 120],
    ['类目2', '4月', 140],
    ['类目1', '5月', 50],
    ['类目2', '5月', 60],
    ],
    title: '某数据_MOCK数据',
    header: ['月份', '类型', '交易发生值'],
    rows: 10,
    hash: 'mockdata',
};`;
  let str = ` 
  import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
  import { handleData } from '@/component/chartItem/option/echarts/line';
  
  import * as lib from '@/component/chartItem/option/lib';
  import { textColor } from '@/component/chartItem/option';

  ${mockStr}
  
  export const config: IChartConfig[]  = [
    {
      key: 'legend',
      defaultValue: 0,
    },
    {
      key: 'x',
      defaultValue: 1,
    },
    {
      key: 'y',
      defaultValue: 2,
    },
    ...lib.getPositionConfig(),
  ];
  
  export const apiConfig: IApiConfig = {
    show: true,
    type: 'url',
    url: '/mock/${nextIndex}_${dirName}.json',
    interval: 5,
    cache:2,
    config: [
      {
        key: 'legend',
        title: 'legend 字段',
        defaultValue: 0,
        min: 0,
      },
      {
        key: 'x',
        title: 'x 字段',
        defaultValue: 1,
        min: 0,
      },
      {
        key: 'y',
        title: 'y 字段',
        defaultValue: 2,
        min: 0,
      },
    ],
  };
  
  export const defaultOption = {
    renderer: 'canvas',
  };
  
  export default ({
    data,
    legend = 0,
    x = 1,
    y = 2,
    smooth = true,
    legendShow = true,
    legendAlign,
    legendPosition,
    legendOrient,
    area_opacity = 1,
    lineWidth = 8,
  }) => {
    if (String(legend) == '') {
      return {};
    }
    let res = handleData(data, { legend, x, y });
  
    let series = res.series.map(({ name, arr: data }) => ({
      name,
      data,
      type: 'line',
      smooth,
      lineStyle: {
        width: lineWidth,
      },
    }));
  
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          position: 'top',
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#ddd',
          },
          axisLine: {
            lineStyle: {
              color: '#ddd',
            },
          },
        },
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: {
            show: false,
          },
          data: res.xArr,
          axisLine: {
            lineStyle: {
              color: '#ddd',
            },
          },
          axisLabel: {
            color: '#ddd',
          },
        },
      ],
      series,
    };
  };
  `;
  if (chartType === 'echarts') {
    return str;
  }
  str = `
  import type { Chart } from '@antv/g2';
  import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface'; 
  
  import * as lib from '@/component/chartItem/option/lib';
  import { textColor } from '@/component/chartItem/option';
  import { getColors, getAntThemePanel } from '../g2plot/lib';

  ${mockStr}
  
  export const config: IChartConfig[] = [  
    getAntThemePanel(),
    {
      key: 'needRerverse',
      defaultValue: false,
      title: '翻转颜色表',
      type: 'switch',
    },
    {
      type: 'divider',
      title: '颜色设置',
    },
    {
      key: 'barWidth',
      defaultValue: 20,
      title: '柱状宽度',
      type: 'range',
      min: 10,
      max: 40,
      step: 2,
    },
  ];
  
  export const apiConfig: IApiConfig = {
    show: true,
    type: 'url',
    url: '/mock/${nextIndex}_${dirName}.json',
    interval: 60,
    config: [
      {
        key: 'x',
        title: 'x 字段',
        defaultValue: 0,
        min: 0,
      },
      {
        key: 'y',
        title: 'y 字段',
        defaultValue: 1,
        min: 0,
      },
    ],
  };
  
  export const defaultOption = {
    padding: [20, 20, 40, 40],
    renderer: 'svg',
  };
  
  // g2 的默认组件需要2个参数，一是配置项，二是chart实例
  export const onMount = ({ data: { data: data },legend:_legend=0, x:_x = 1, y:_y = 2 }: IChartProps, chart: Chart) => {    
    
  let colors = getColors(theme, needRerverse);
  let x = header[_x], y = header[_y], legend = header[legend];

    chart.data(data);
    chart.scale({
        [y]: {
            min: 0
        }
    });

    chart
    .line()
    .position(\`\${x}*\${y}\`)
    .color(\`\${legend}\`,colors);
    chart.render();
  };
  
  export default onMount;
  `;
  if (chartType === 'g2') {
    return str;
  }
  str = `
// 此处导入你所需要的自定义组件
import ProgressBar from '@/component/widget/progressbar'; 
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface'; 

import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';

export const mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/${nextIndex}_${dirName}.json',
  interval: 5,
  cache:2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
  ],
};

export default ({ option: { data, x = 0 }, style }) => {
  let percent = data.data[0][x];
  // 此处像正常的react组件处理，返回对应的信息即可
  return <ProgressBar style={{ width: '100%', height: '100%', ...style }} percent={percent} />;
}; 
  `;
  if (chartType == 'other') {
    return str;
  }

  str = `
import { IChartMock, IApiConfig, IG2PlotProps } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import { getTheme } from './lib';

export const mock: IChartMock = {
  data: [
    ['1851', 54],
    ['1852', 57],
    ['1853', 59],
    ['1854', 69],
    ['1855', 71],
    ['1856', 76],
    ['1857', 77],
  ],
  title: '拆线柱图_MOCK数据',
  header: ['year', 'value'],
  rows: 36,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'renderer',
    defaultValue: 'svg',
    title: '图表引擎',
    type: 'radio',
    option: 'canvas,svg',
  },
  lib.getAntThemePanel(),
  ...lib.getLegendConfig(),
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/02_linebar.json',
  interval: 5,
  cache:2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

interface IG2Plot extends IG2PlotProps {
  [key: string]: any;
}

export default ({
  data: { data },
  x = 0,
  y = 1,

  renderer = 'svg',
  theme = 18,
  legendShow = true,
  legendAlign,
  legendPosition,
  legendOrient,
}: IG2Plot) => {
  return {
    chartType: 'line',
    ...getTheme(theme),
    renderer,
    ...lib.getG2LegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    data,
    xField: x,
    yField: y,
    xAxis: { type: 'category' },
  };
};`;
  if (chartType == 'g2plot') {
    return str;
  }

  return `// 未知的组件类型  ${chartType}`;
};

const handleTemplate = () => {
  let str = getTemplateFile();
  if (DEBUG_MODE) {
    console.log(str);
  } else {
    fs.writeFileSync(`${dir}option/${chartType}/${dirName}.tsx`, str);
  }
  console.log('3.文件组件写入完成');
};

// 对现有组件增加默认测试用例
const rewriteTestFile = () => {
  const chartArr = getCharts();

  if (!chartArr) {
    return;
  }

  chartArr.forEach(setTestFile);
};

const setTestFile = (dirName) => {
  const content = `import init from './lib.test';
init(__filename);
  `;
  fs.writeFileSync(`${dir}charts/${dirName}.test.ts`, content);
};

const init = () => {
  let success = handleOptionIndex();
  if (!success) {
    return;
  }
  handleComponents();
  console.log(`模版${dirName}已创建`);
};

// init();
rewriteTestFile();

process.exit(0);
