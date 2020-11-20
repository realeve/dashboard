
  import React from 'react'; 
  import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
  import { handleData } from '@/component/chartItem/option/echarts/line';
  
  import * as lib from '@/component/chartItem/option/lib';
  import { textColor } from '@/component/chartItem/option';

  
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
    url: 'http://localhost:8000/mock/34_base_line.json',
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
  
  export const defaultOption = {
    renderer: 'svg',
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
  