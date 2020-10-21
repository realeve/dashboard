import React from 'react';
import { textColor } from '@/component/chartItem/option';
import util from '@/component/echarts/themeColor';
import echarts from 'echarts';
import { IChartMock, IApiConfig } from '@/component/chartItem/interface';
import { handleData } from './line';
import * as lib from '../lib';

export let mock: IChartMock = {
  title: '渐变面积图_MOCK数据',
  header: ['legend', 'x', 'y'],
  rows: 147,
  hash: 'mockdata',
  data: [
    ['邮件营销', '周一', 120],
    ['联盟广告', '周一', 220],
    ['视频广告', '周一', 150],
    ['直接访问', '周一', 320],
    ['搜索引擎', '周一', 820],
    ['邮件营销', '周二', 132],
    ['联盟广告', '周二', 182],
    ['视频广告', '周二', 232],
    ['直接访问', '周二', 332],
    ['搜索引擎', '周二', 932],
    ['邮件营销', '周三', 101],
    ['联盟广告', '周三', 191],
    ['视频广告', '周三', 201],
    ['直接访问', '周三', 301],
    ['搜索引擎', '周三', 901],
    ['邮件营销', '周四', 134],
    ['联盟广告', '周四', 234],
    ['视频广告', '周四', 154],
    ['直接访问', '周四', 334],
    ['搜索引擎', '周四', 934],
    ['邮件营销', '周五', 90],
    ['联盟广告', '周五', 290],
    ['视频广告', '周五', 190],
    ['直接访问', '周五', 390],
    ['搜索引擎', '周五', 1290],
    ['邮件营销', '周六', 230],
    ['联盟广告', '周六', 330],
    ['视频广告', '周六', 330],
    ['直接访问', '周六', 330],
    ['搜索引擎', '周六', 1330],
    ['邮件营销', '周日', 210],
    ['联盟广告', '周日', 310],
    ['视频广告', '周日', 410],
    ['直接访问', '周日', 320],
    ['搜索引擎', '周日', 1320],
  ],
};

export const config = [
  {
    key: 'yAxis',
    defaultValue: true,
    title: '显示y轴',
    type: 'switch',
  },
  ...lib.getPositionConfig(),
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/11_gardient_line.json',
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
  yAxis = true,
  smooth = true,
  legend = 0,
  x = 1,
  y = 2,
  lineWidth = 2,
  area_opacity = 0.9,
  data,
  legendAlign = 'center',
  legendPosition = 'top',
  legendOrient = 'horizontal',
}) => {
  if (String(legend) == '') {
    return {};
  }
  let res = handleData(data, { legend, x, y });

  let color = util.getColor(res.xArr.length, 'line');

  let series = res.series.map(({ name, arr }, idx) => ({
    name,
    type: 'line',
    smooth,
    itemStyle: {
      normal: {
        color: color[idx % res.series.length],
        borderWidth: 4,
        areaStyle: {
          //渐变色的设置
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: util.hex2rgb(color[idx % res.series.length], 0.9),
            },
            {
              offset: 0.5,
              color: util.hex2rgb(color[idx % res.series.length], 0.4),
            },
            {
              offset: 1,
              color: util.hex2rgb(color[idx % res.series.length], 0.05),
            },
          ]),
          opacity: area_opacity,
        },
        lineStyle: {
          color: color[idx % res.series.length],
          width: lineWidth,
        },
      },
    },
    label: {
      normal: {
        show: true,
        position: 'top',
      },
    },
    stack: '累计',
    data: arr,
  }));

  return {
    grid: {
      left: '3%',
      top: 30,
      right: '3%',
      bottom: 25,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: res.xArr,
      splitLine: {
        show: false,
      },
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          fontSize: 14,
          color: textColor,
        },
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: yAxis,
        inside: true,
        length: 10,
        lineStyle: {
          color: textColor,
        },
      },
      axisLabel: {
        show: yAxis,
        textStyle: {
          color: textColor,
          fontSize: 14,
        },
      },
    },
    tooltip: {},
    legend: {
      icon: 'circle',
      textStyle: { color: '#fff' },
      ...lib.getLegendPosition({ legendAlign, legendPosition, legendOrient }),
    },
    series,
  };
};
