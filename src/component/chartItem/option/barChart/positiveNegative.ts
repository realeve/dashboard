import echarts from 'echarts';
import * as R from 'ramda';
import * as lib from '../lib';
import jStat from 'jstat';

export let defaultValue = [
  ['周一', '收入', 320],
  ['周一', '付出', 120],
  ['周二', '收入', 302],
  ['周二', '付出', 132],
  ['周三', '收入', 341],
  ['周三', '付出', 101],
  ['周四', '收入', 374],
  ['周四', '付出', 134],
  ['周五', '收入', 390],
  ['周五', '付出', 190],
  ['周六', '收入', 450],
  ['周六', '付出', 230],
  ['周日', '收入', 420],
  ['周日', '付出', 210],
];

const handleData = (data, { legend, x, y }) => { 
  let max = jStat.max(R.pluck([String(y)])(data))
 
  let result = lib.handleMinMax({ min: 0, max });
  let legendArr = lib.getUniqByIdx({ key: legend, data });
  let xArr = lib.getUniqByIdx({ key: x, data });
  let series = []; 
  legendArr.map((name, idx) => {
    let arr = [];
    xArr.forEach(xItem => { 
      let item = data.find(item => item[legend] == name && item[x] == xItem);
      arr.push(item ? item[y] * (idx === 0 ? -1 : 1) : '-');
    });
    series.push({
      name,
      arr,
    });
  });

  return {
    xArr,
    series,
    max: result.max,
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

export default ({ data, legend = 0, x = 1, y = 2, barWidth = 20 }) => {
  let res = handleData(data, { legend, x, y });
 

  const color = '#ddd';
  const axisColor = '#203651'; // '#0055bd'; // 

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    }, 
    legend: { 
        icon:'circle',
        textStyle:{
            color
        },
        top:15,
        left:'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
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
          formatter: Math.abs,
          color,
        },
        axisLine: {
          lineStyle: {
            color: axisColor,
          },
        },
        min: -res.max,
        max: res.max,
      },
    ],
    yAxis: [
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
          margin: 0,
        },
      },
    ],
    series: [
      {
        name: res.series[0].name,
        type: 'bar',
        stack: '总量',
        barWidth,
        label: {
          show: true,
          position: 'left',
          formatter: e => Math.abs(e.value),
          color: '#ff3e8b',
        },
        itemStyle: {
          normal: {
            barBorderRadius: [barWidth / 2, 0, 0, barWidth / 2],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#ef00ff',
              },
              {
                offset: 1,
                color: '#ba00ff',
              },
            ]),
          },
        },
        data: res.series[0].arr,
      },
      {
        name: res.series[1].name,
        type: 'bar',
        stack: '总量',
        barWidth,
        label: {
          show: true,
          position: 'right',
          color: '#00baff',
        },
        itemStyle: {
          normal: {
            barBorderRadius: [0, barWidth / 2, barWidth / 2, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#2846ff',
              },
              {
                offset: 1,
                color: '#00baff',
              },
            ]),
          },
        },
        data: res.series[1].arr,
      },
    ],
  };
};
