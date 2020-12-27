import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import { IChartMock, IApiConfig } from '@/component/chartItem/interface';
export let mock: IChartMock = {
  data: [[45.7]],
  title: '百分比环图_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'valueFontSize',
    defaultValue: 40,
    title: '值字号',
    step: 2,
    type: 'range',
    min: 20,
    max: 80,
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
  {
    key: 'barWidth',
    defaultValue: 40,
    title: '圆环宽度',
    step: 2,
    type: 'range',
    min: 10,
    max: 100,
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

export const defaultOption = {
  renderer: 'svg',
};

export default ({ data: _data, x = 0, valueFontSize = 40, titleFontSize = 16, barWidth = 40 }) => {
  let value = _data.data[0][x];
  let title = _data.title;
  let _title = {
    text: value,
    textStyle: {
      color: '#01c4a3',
      fontSize: valueFontSize,
    },
    itemGap: -10, // 主副标题距离
    left: 'center',
    top: 'center',
  };
  if (title.length > 0 && titleFontSize > 0) {
    _title = {
      ..._title,
      subtext: title,
      subtextStyle: {
        color: '#f2f2f2',
        fontSize: titleFontSize,
      },
    };
  }

  return {
    title: _title,
    angleAxis: {
      max: 100,
      clockwise: true, // 逆时针
      // 隐藏刻度线
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    radiusAxis: {
      type: 'category',
      // 隐藏刻度线
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    polar: {
      center: ['50%', '50%'],
      radius: '160%', //图形大小
    },
    series: [
      {
        type: 'bar',
        data: [
          {
            name: '比例',
            value: value,
            itemStyle: {
              normal: {
                color: new LinearGradient(1, 0, 0, 0, [
                  {
                    offset: 0,
                    color: '#aaf14f',
                  },
                  {
                    offset: 1,
                    color: '#0acfa1',
                  },
                ]),
              },
            },
          },
        ],
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: barWidth,
        barGap: '-100%', // 两环重叠
        z: 2,
      },
      {
        // 灰色环
        type: 'bar',
        data: [
          {
            value: 100,
            itemStyle: {
              color: '#e2e2e2',
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 5,
              shadowOffsetY: 2,
            },
          },
        ],
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: barWidth,
        barGap: '-100%', // 两环重叠
        z: 1,
      },
    ],
  };
};
