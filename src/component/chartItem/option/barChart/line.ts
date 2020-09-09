import echarts from 'echarts';
import * as lib from '../lib';
import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [
    ['1月', '类目1', 175],
    ['1月', '类目2', 210],
    ['1月', '类目3', 23],
    ['2月', '类目1', 125],
    ['2月', '类目2', 140],
    ['2月', '类目3', 17.5],
    ['3月', '类目1', 98],
    ['3月', '类目2', 120],
    ['3月', '类目3', 15],
    ['4月', '类目1', 120],
    ['4月', '类目2', 140],
    ['4月', '类目3', 12],
    ['5月', '类目1', 50],
    ['5月', '类目2', 60],
    ['5月', '类目3', 8],
    ['6月', '类目1', 60],
    ['6月', '类目2', 70],
    ['6月', '类目3', 7],
    ['7月', '类目1', 50],
    ['7月', '类目2', 60],
    ['7月', '类目3', 6],
    ['8月', '类目1', 50],
    ['8月', '类目2', 55],
    ['8月', '类目3', 5],
    ['9月', '类目1', 50],
    ['9月', '类目2', 55],
    ['9月', '类目3', 5]
  ],
  title: '拆线柱图_MOCK数据',
  header: ['月份', '类型', '交易发生值'],
  rows: 36,
  hash: 'mockdata',
};

const handleData = ({data}, { legend, x, y }) => {
  let legendArr = lib.getUniqByIdx({ key: legend, data });
  let xArr = lib.getUniqByIdx({ key: x, data });
  let series = [];
  legendArr.map((name, idx) => {
    let arr = [];
    xArr.forEach(xItem => {
      let item = data.find(item => item[legend] == name && item[x] == xItem);
      arr.push(item ? item[y] : '-');
    });
    series.push({
      name,
      arr,
    });
  });

  return {
    xArr,
    series,
  };
};

export const config = [
  {
    key: 'legend',
    default: 0,
  },
  {
    key: 'x',
    default: 1,
  },
  {
    key: 'y',
    default: 2,
  },
  {
    key: 'barWidth',
    default: 20,
    title: '柱状宽度',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/02_linebar.json',
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

export default ({ data, legend = 0, x = 1, y = 2, barWidth = 15 }) => {
  let res = handleData(data, { legend, x, y });

  const color = '#ddd';
  const axisColor = '#0055bd'; //'#203651';

  let series = [
    {
      name: res.series[0].name,
      type: 'bar',
      barWidth,
      itemStyle: {
        normal: {
          barBorderRadius: [barWidth / 2, barWidth / 2, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ff69fa',
            },
            {
              offset: 1,
              color: '#ff05c4',
            },
          ]),
        },
      },
      data: res.series[0].arr,
    },
    {
      name: res.series[1].name,
      type: 'bar',
      barWidth,
      itemStyle: {
        normal: {
          barBorderRadius: [barWidth / 2, barWidth / 2, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: '#2846ff',
            },
            {
              offset: 0,
              color: '#229dfb',
            },
          ]),
        },
      },
      data: res.series[1].arr,
    },
  ];

  if (res.series.length === 3) {
    series.push({
      name: res.series[2].name,
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          color: '#11dddc',
          lineWidth: 2.5,
        },
      },
      data: res.series[2].arr,
      yAxisIndex: 1,
    });
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      icon: 'circle',
      textStyle: {
        color,
      },
      top: 20,
      left: 'center',
    },
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
          color,
        },
        axisLine: {
          lineStyle: {
            color: axisColor,
          },
        },
      },
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
          color,
        },
        axisLine: {
          lineStyle: {
            color: axisColor,
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
            color: axisColor,
          },
        },
        axisLabel: {
          color,
        },
      },
    ],
    series,
  };
};
