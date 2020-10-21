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
const DEBUG_MODE = true;

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

let dir = './src/component/chartItem/option/';
const handleOptionIndex = () => {
  let str = fs.readFileSync(dir + 'index.ts', 'utf8');
  let idx = str.match(/\d+/g);
  nextIndex = Number(R.last(idx)) + 1;

  str = `${str}
/*
    时间：${now()}
    类型: ${chartType}
    序号：${nextIndex}
    名称：你的图表名称
*/ 
import * as ${dirName} from './${chartType}/${dirName}';
export { ${dirName} }; 
`;
  if (DEBUG_MODE) {
    console.log(str);
  } else {
    fs.writeFileSync(dir + 'index.ts', str);
  }

  console.log('1.组件 lib 导出文件完成');
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
      image: '/img/icons/01_barChartPositiveNegative.png',
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
  let str = `
  import React from 'react';
  import * as lib from '../lib';
  import { IChartMock, IApiConfig } from '@/component/chartItem/interface';
  import { handleData } from '@/component/chartItem/option/echarts/line';
  
  export let mock: IChartMock = {
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
  };
  
  export const config = [
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
    url: 'http://localhost:8000/mock/${nextIndex}_${dirName}.json',
    interval: 5,
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
  str = `import { Chart } from '@antv/g2';
  import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface';
  import { handleAxisStyle } from './waterfall';
  
  export let mock: IChartMock = {
    header: ['类别', '数值'],
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
    title: '请添加你的数据_mock',
    rows: 14,
    hash: 'mockdata',
  };
  
  export const config: IChartConfig[] = [
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
    url: 'http://localhost:8000/mock/${nextIndex}_${dirName}.json',
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
  export const onMount = ({ data: { data: data }, x = 0, y = 1 }: IChartProps, chart: Chart) => {
    chart.data(data);
    handleAxisStyle(chart, { x, y });
    chart.scale(y, { nice: true });
    chart.legend(false);
    chart.interval().position(\`${x}*${y}\`);
    chart.render();
  };
  
  export default onMount;
  `;
  if (chartType === 'g2') {
    return str;
  }
};

const handleTemplate = () => {
  let str = getTemplateFile();
  if (DEBUG_MODE) {
    console.log(str);
  } else {
    fs.writeFileSync(`${dir}${chartType}/${dirName}.tsx`, str);
  }
  console.log('3.文件组件写入完成');
};
const init = () => {
  handleOptionIndex();
  handleComponents();
  handleTemplate();
  console.log(`模版${dirName}已创建`);
};

init();

process.exit(0);