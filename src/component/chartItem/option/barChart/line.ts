import echarts from 'echarts';
import * as lib from '../lib';

export let defaultValue = [
  {
    "x": "1月",
    "y": 175,
    "s": "类目1"
  },
  {
    "x": "1月",
    "y": 210,
    "s": "类目2"
  },
  {
    "x": "1月",
    "y": 23,
    "s": "类目3"
  },
  {
    "x": "2月",
    "y": 125,
    "s": "类目1"
  },
  {
    "x": "2月",
    "y": 140,
    "s": "类目2"
  },
  {
    "x": "2月",
    "y": 17.5,
    "s": "类目3"
  },
  {
    "x": "3月",
    "y": 98,
    "s": "类目1"
  },
  {
    "x": "3月",
    "y": 120,
    "s": "类目2"
  },
  {
    "x": "3月",
    "y": 15,
    "s": "类目3"
  },
  {
    "x": "4月",
    "y": 120,
    "s": "类目1"
  },
  {
    "x": "4月",
    "y": 140,
    "s": "类目2"
  },
  {
    "x": "4月",
    "y": 12,
    "s": "类目3"
  },
  {
    "x": "5月",
    "y": 50,
    "s": "类目1"
  },
  {
    "x": "5月",
    "y": 60,
    "s": "类目2"
  },
  {
    "x": "5月",
    "y": 8,
    "s": "类目3"
  },
  {
    "x": "6月",
    "y": 60,
    "s": "类目1"
  },
  {
    "x": "6月",
    "y": 70,
    "s": "类目2"
  },
  {
    "x": "6月",
    "y": 7,
    "s": "类目3"
  },
  {
    "x": "7月",
    "y": 50,
    "s": "类目1"
  },
  {
    "x": "7月",
    "y": 60,
    "s": "类目2"
  },
  {
    "x": "7月",
    "y": 6,
    "s": "类目3"
  },
  {
    "x": "8月",
    "y": 50,
    "s": "类目1"
  },
  {
    "x": "8月",
    "y": 55,
    "s": "类目2"
  },
  {
    "x": "8月",
    "y": 5,
    "s": "类目3"
  },
  {
    "x": "9月",
    "y": 50,
    "s": "类目1"
  },
  {
    "x": "9月",
    "y": 55,
    "s": "类目2"
  },
  {
    "x": "9月",
    "y": 5,
    "s": "类目3"
  },
  {
    "x": "10月",
    "y": 50,
    "s": "类目1"
  },
  {
    "x": "10月",
    "y": 60,
    "s": "类目2"
  },
  {
    "x": "10月",
    "y": 5,
    "s": "类目3"
  },
  {
    "x": "11月",
    "y": 40,
    "s": "类目1"
  },
  {
    "x": "11月",
    "y": 48,
    "s": "类目2"
  },
  {
    "x": "11月",
    "y": 5,
    "s": "类目3"
  },
  {
    "x": "12月",
    "y": 25,
    "s": "类目1"
  },
  {
    "x": "12月",
    "y": 30,
    "s": "类目2"
  },
  {
    "x": "12月",
    "y": 4,
    "s": "类目3"
  }
].map(item=>([item.x,item.s,item.y]))

const handleData = (data, { legend, x, y }) => {
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
      data: res.series[0].arr
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
      yAxisIndex:1,
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
      left:'center',
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
