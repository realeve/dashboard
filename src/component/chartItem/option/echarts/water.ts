import { IChartMock, IApiConfig } from '@/component/chartItem/interface';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '水球图_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'valueFontSize',
    defaultValue: 30,
    title: '值字号',
    step: 2,
    type: 'range',
    min: 20,
    max: 80,
  },
  {
    key: 'percentFontSize',
    defaultValue: 16,
    title: '百分比字号',
    step: 2,
    type: 'range',
    min: 0,
    max: 40,
  },
  {
    key: 'titleFontSize',
    defaultValue: 16,
    title: '标题字号',
    step: 2,
    type: 'range',
    min: 0,
    max: 60,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/04_progress_bar.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
  ],
};

export default ({
  data: _data,
  x = 0,
  valueFontSize = 30,
  percentFontSize = 16,
  titleFontSize = 16,
}) => {
  let value = _data.data[0][x];
  let data = [value / 100, value / 100, value / 100];

  let option = {
    title: {
      text: `${value.toFixed(0)}{a| %}`,
      textStyle: {
        fontSize: valueFontSize,
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        color: '#bcb8fb',
        rich: {
          a: {
            fontSize: percentFontSize,
          },
        },
      },
      x: 'center',
      y: '35%',
    },
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: '60%',
        children: [
          {
            type: 'text',
            z: 100,
            left: '10',
            top: 'middle',
            style: {
              fill: '#aab2fa',
              text: _data.title,
              fontSize: titleFontSize,
              fontFamily: 'Microsoft Yahei',
            },
          },
        ],
      },
    ],
    series: [
      {
        type: 'liquidFill',
        radius: '80%',
        center: ['50%', '50%'],
        //  shape: 'roundRect',
        data: data,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0.5,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: 'rgba(68, 145, 253, 0)',
              },
              {
                offset: 0.5,
                color: 'rgba(68, 145, 253, .25)',
              },
              {
                offset: 0,
                color: 'rgba(68, 145, 253, 1)',
              },
            ],
            globalCoord: false,
          },
        },
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 20,
            borderColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(69, 73, 240, 0.05)',
                },
                {
                  offset: 0.5,
                  color: 'rgba(69, 73, 240, .25)',
                },
                {
                  offset: 1,
                  color: 'rgba(69, 73, 240, 1)',
                },
              ],
              globalCoord: false,
            },
            shadowBlur: 10,
            shadowColor: '#000',
          },
        },
        color: ['rgba(31, 222, 225, 0.6)', 'rgba(31, 222, 225, .4)', 'rgba(58, 71, 212, 0.2)'],
        label: {
          normal: {
            formatter: '',
          },
        },
      },
    ],
  };
  return option;
};
