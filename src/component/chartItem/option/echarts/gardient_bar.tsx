import LinearGradient from 'zrender/lib/graphic/LinearGradient';

import { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [
    ['新能源智能汽车', 23],
    ['航天航空', 12],
    ['第三代半导体', 18],
    ['产业金融', 12],
    ['商务会展', 43],
    ['临空经济', 23],
    ['文创旅游', 32],
    ['智能制造业', 21],
  ],
  title: '渐变柱图_MOCK数据',
  header: ['类型', '值'],
  rows: 36,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '柱状宽度',
    type: 'range',
    min: 10,
    max: 60,
    step: 2,
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

export default ({ data: _data, x = 0, y = 1, barWidth = 20 }) => {
  let xData = [],
    yData = [];
  let value = _data.data;
  value.forEach((item) => {
    xData.push(item[x]);
    yData.push(item[y]);
  });
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: '8%',
      right: '5%',
      left: '5%',
      bottom: '5%',
    },
    xAxis: [
      {
        type: 'category',
        data: xData,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          margin: 10,
          color: '#e2e9ff',
          textStyle: {
            fontSize: 14,
          },
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: '{value}',
          color: '#e2e9ff',
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        type: 'bar',
        data: yData,
        barWidth: barWidth,
        itemStyle: {
          normal: {
            color: LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(0,244,255,1)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0,77,167,1)', // 100% 处的颜色
                },
              ],
              false,
            ),
            barBorderRadius: [barWidth * 1.5, barWidth * 1.5, barWidth * 1.5, barWidth * 1.5],
            shadowColor: 'rgba(0,160,221,1)',
            shadowBlur: 4,
          },
        },
        label: {
          normal: {
            show: true,
            lineHeight: 30,
            width: 80,
            height: 30,
            backgroundColor: 'rgba(0,160,221,0.1)',
            borderRadius: 200,
            // 此处位置X的设置: 增加一个参数barPosition,记录barWidth在10 20 30 40 50 60时的最佳位置，
            // 在excel中添加曲线图，添加趋势线及公式，得到 positionX = 0.5 * barWidth - 16
            position: [barWidth / 2 - 16, '-60'],
            distance: 1,
            formatter: ['    {d|●}', ' {a|{c}}     \n', '    {b|}'].join(','),
            rich: {
              d: {
                color: '#3CDDCF',
              },
              a: {
                color: '#fff',
                align: 'center',
              },
              b: {
                width: 1,
                height: 30,
                borderWidth: 1,
                borderColor: '#234e6c',
                align: 'left',
              },
            },
          },
        },
      },
    ],
  };
};
