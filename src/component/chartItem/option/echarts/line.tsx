import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import * as lib from '../lib';

import type { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export const mock: IChartMock = {
  data: [
    ['类目1', '1月', 175],
    ['类目2', '1月', 210],
    ['类目3', '1月', 23],
    ['类目1', '2月', 125],
    ['类目2', '2月', 140],
    ['类目3', '2月', 17.5],
    ['类目1', '3月', 98],
    ['类目2', '3月', 120],
    ['类目3', '3月', 15],
    ['类目1', '4月', 120],
    ['类目2', '4月', 140],
    ['类目3', '4月', 12],
    ['类目1', '5月', 50],
    ['类目2', '5月', 60],
    ['类目3', '5月', 8],
    ['类目1', '6月', 60],
    ['类目2', '6月', 70],
    ['类目3', '6月', 7],
    ['类目1', '7月', 50],
    ['类目2', '7月', 60],
    ['类目3', '7月', 6],
    ['类目1', '8月', 50],
    ['类目2', '8月', 55],
    ['类目3', '8月', 5],
    ['类目1', '9月', 50],
    ['类目2', '9月', 55],
    ['类目3', '9月', 5],
  ],
  title: '拆线柱图_MOCK数据',
  header: ['月份', '类型', '交易发生值'],
  rows: 36,
  hash: 'mockdata',
};

export const handleData = (
  { data },
  { legend, x, y }: { legend?: number | string; x: number | string; y: number | string },
) => {
  const xArr = lib.getUniqByIdx({ key: x, data });
  const series = [];
  if (typeof legend === 'undefined') {
    const arr = [];
    xArr.forEach((xItem) => {
      const item = data.find((item) => item[x] == xItem);
      arr.push(item ? item[y] : '-');
    });
    series.push({
      name,
      arr,
    });
  } else {
    const legendArr = lib.getUniqByIdx({ key: legend, data });
    legendArr.map((name, idx) => {
      const arr = [];
      xArr.forEach((xItem) => {
        const item = data.find((item) => item[legend] == name && item[x] == xItem);
        arr.push(item ? item[y] : '-');
      });
      series.push({
        name,
        arr,
      });
    });
  }

  return {
    xArr,
    series,
  };
};

export const config = [
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '柱状宽度',
    type: 'range',
    min: 10,
    max: 40,
    step: 2,
  },
  ...lib.getPositionConfig(),
  {
    type: 'divider',
    title: '系列图表类型',
  },
  {
    key: 'chart1',
    title: '系列1',
    defaultValue: 'bar',
    ...lib.chartType,
  },
  {
    key: 'chart2',
    title: '系列2',
    defaultValue: 'bar',
    ...lib.chartType,
  },
  {
    key: 'chart3',
    title: '系列3',
    defaultValue: 'line',
    ...lib.chartType,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/02_linebar.json',
  interval: 5,
  cache: 2,
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
  barWidth = 15,
  smooth = true,
  legendShow = true,
  legendAlign,
  legendPosition,
  legendOrient,
  chart1 = 'bar',
  chart2 = 'bar',
  chart3 = 'line',
  area_opacity = 1,
  lineWidth = 2,
}) => {
  if (String(legend) == '') {
    return {};
  }
  const res = handleData(data, { legend, x, y });

  const color = '#ddd';
  const axisColor = '#0055bd'; // '#203651';
  const series = [
    {
      name: res.series[0].name,
      ...lib.getChartType(chart1, area_opacity),
      barWidth,
      smooth,
      itemStyle: {
        normal: {
          barBorderRadius: [barWidth / 2, barWidth / 2, 0, 0],
          color: new LinearGradient(0, 0, 0, 1, [
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
      lineStyle: {
        width: lineWidth,
      },
      data: res.series[0].arr,
    },
    {
      name: res.series[1].name,
      ...lib.getChartType(chart2, area_opacity),
      barWidth,
      smooth,
      itemStyle: {
        normal: {
          barBorderRadius: [barWidth / 2, barWidth / 2, 0, 0],
          color: new LinearGradient(0, 0, 0, 1, [
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
      lineStyle: {
        width: lineWidth,
      },
      data: res.series[1].arr,
    },
  ];

  if (res.series.length === 3) {
    series.push({
      name: res.series[2].name,
      ...lib.getChartType(chart3, area_opacity),
      smooth,
      itemStyle: {
        normal: {
          color: '#11dddc',
        },
      },
      lineStyle: {
        width: lineWidth,
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
    ...lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
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
