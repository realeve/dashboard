import panel from '@/component/echarts/themeColor';
import * as R from 'ramda';
export const getBarMax = (data, y) => {
  let item = R.last(data)[y];
  return Math.ceil(item / 10) * 10;
};

// let color = ['#afa3f5', '#00d488', '#3feed4', '#3bafff', '#f1bb4c' ];

let color = panel.COLOR_PLATE_16;

export default ({ data: value, x = 0, y = 1 }) => {
  let data = value.sort((a, b) => a[y] - b[y]);
  let max = getBarMax(data, y);
  return {
    angleAxis: {
      max,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    radiusAxis: {
      type: 'category',
      data: data.map(item => item[x]),
      z: 10,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        margin: 25,
        align: 'right',
        show: true,
        interval: 0,
        color: function(value, idx) {
          return color[idx % color.length];
        },
      },
    },
    tooltip: {},
    polar: {
      tooltip: { trigger: 'item' },
    },
    series: [
      {
        type: 'bar',
        data: data.map((value, idx) => {
          let item = { value: value[y] };
          item.itemStyle = {
            color: color[idx % color.length],
          };
          return item;
        }),
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: 10,
      },
    ],
  };
};
