import React, { useMemo } from 'react';
import ECharts from '@/component/echarts';
import { handleScatterData, EStatus } from './util';
import { SEARCH_PREFIX } from '@/utils/setting';
import type { IChartConfig } from '@/component/chartItem/interface';

const starableAnimate = (idx) => idx * Math.random() * 10;
export const statusColor = ['#ddd', '#749cff', '#fb0348', '#333'];

export const config: IChartConfig[] = [
  {
    title: '冠字组件设置',
    type: 'divider',
  },
  {
    title: '冠字接口',
    key: 'detailApi',
    type: 'input',
    valueType: 'text',
    defaultValue: '/1199/3f5aca42dd',
    subTitle: '参数示例：prod=9603T&gz=AJ**&procname=检封',
  },
  {
    title: '单元格大小',
    key: 'boxSize',
    type: 'range',
    min: 10,
    step: 1,
    max: 40,
    defaultValue: 20,
  },
  {
    title: '单元格形状',
    key: 'boxShape',
    type: 'radio',
    option: 'rect,circle,roundRect',
    defaultValue: 'circle',
  },
];

export default ({ style, data: _data, boxShape, boxSize = 20, y, prod }) => {
  const data = useMemo(() => handleScatterData({ prod, y, data: _data }), [_data.hash, y, prod]);
  return (
    <ECharts
      style={style}
      onClick={({ value }) => {
        if (!value[3]) {
          return;
        }
        const { url } = value[3];
        window.open(SEARCH_PREFIX + url, '_blank');
      }}
      option={{
        darkMode: true,
        xAxis: { show: false },
        yAxis: { show: false },
        tooltip: {
          trigger: 'item',
          axisPointer: false,
          formatter: ({ value }) => {
            if (!value[3]) {
              return '未印码';
            }
            const { title, type, url } = value[3];
            const tip = ['未印刷', '正常', '跳号', '未印码'][value[2]];
            return `车号:${url}<br/>
            品种:${type}<br/>
            冠字:${title}<br/>
            生产状态:${tip}
            ${
              value[2] === EStatus.ERROR
                ? '<br/><span style="font-weight:bold;color:#e23;">(点击查看车号详情)</span>'
                : ''
            }`;
          },
        },
        grid: {
          top: 5,
          bottom: 0,
          left: 0,
          right: 20,
        },
        animationEasing: 'cubicInOut',
        series: [
          {
            symbol: boxShape,
            symbolSize: boxSize,
            data,
            type: 'scatter',
            itemStyle: {
              color: ({ value }) => {
                return statusColor[value[2]];
              },
            },
            animationDelay: starableAnimate,
            animationDelayUpdate: starableAnimate,
          },
          {
            type: 'effectScatter',
            symbol: boxShape,
            symbolSize: boxSize * 0.75,
            data: data.filter((item) => item[2] === EStatus.ERROR),
            itemStyle: {
              color: '#f23',
            },
            emphasis: {
              focus: 'series',
            },
            z: 3,
          },
        ],
      }}
    />
  );
};
