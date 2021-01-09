import type { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import { handleData } from '@/component/chartItem/option/echarts/line';

import LinearGradient from 'zrender/lib/graphic/LinearGradient';

export const mock: IChartMock = {
  data: [
    ['Sun', 175],
    ['Mon', 210],
    ['Tue', 125],
    ['Wed', 140],
    ['Thu', 98],
    ['Fri', 120],
    ['Sat', 120],
  ],
  title: '某数据_MOCK数据',
  header: ['月份', '类型', '交易发生值'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    type: 'switch',
    title: '分隔线',
    defaultValue: true,
    key: 'showSplit',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/30_bar_2d.json',
  interval: 5,
  cache: 2,
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
  renderer: 'svg',
};

export default ({ data: srcData, x = 0, y = 1, showSplit = true }) => {
  const res = handleData(srcData, { x, y });
  const series = [];
  res.series.forEach(({ name, arr: data }) => {
    series.push({
      name,
      data,
      tooltip: {
        show: false,
      },
      type: 'bar',
      barWidth: 24.5,
      itemStyle: {
        color: new LinearGradient(
          0,
          1,
          0,
          0,
          [
            {
              offset: 0,
              color: '#0B4EC3', // 0% 处的颜色
            },
            {
              offset: 0.6,
              color: '#138CEB', // 60% 处的颜色
            },
            {
              offset: 1,
              color: '#17AAFE', // 100% 处的颜色
            },
          ],
          false,
        ),
      },
      barGap: 0,
    });
    const sideData = data.map((item) => item + 4.5);
    series.push({
      type: 'bar',
      barWidth: 8,
      itemStyle: {
        color: new LinearGradient(
          0,
          1,
          0,
          0,
          [
            {
              offset: 0,
              color: '#09337C', // 0% 处的颜色
            },
            {
              offset: 0.6,
              color: '#0761C0', // 60% 处的颜色
            },
            {
              offset: 1,
              color: '#0575DE', // 100% 处的颜色
            },
          ],
          false,
        ),
      },
      barGap: 0,
      data: sideData,
    });
    series.push({
      tooltip: {
        show: false,
      },
      type: 'pictorialBar',
      itemStyle: {
        borderWidth: 1,
        borderColor: '#0571D5',
        color: '#1779E0',
      },
      symbol: 'path://M 0,0 l 120,0 l -30,60 l -120,0 z',
      symbolSize: ['30', '12'],
      symbolOffset: ['0', '-11'],
      symbolRotate: -5,
      symbolPosition: 'end',
      data,
      label: { show: true, position: 'top', color: '#ddd', offset: [0, 15], rotate: -5 },
      z: 3,
    });
  });

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
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
          show: showSplit,
          lineStyle: {
            type: 'solid',
            color: '#4784e8',
          },
        },
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
            color: '#3eb2e8',
          },
        },
        axisLabel: {
          color: '#fff',
        },
      },
    ],
    series,
  };
};
