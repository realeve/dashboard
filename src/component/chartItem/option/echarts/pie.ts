import colors from '@/component/echarts/themeColor';

import 'echarts/lib/chart/pie';

export type circlePos = 'inner' | 'outter';
export default ({ data: value, x = 0, y = 1, circlePos = 'inner', roseType = '' }) => {
  const color = ['#afa3f5', '#00d488', '#3feed4', '#3bafff', '#f1bb4c', ...colors.COLOR_PLATE_8];
  const data = value.map((item) => ({
    value: item[y],
    name: item[x],
  }));

  const radius =
    circlePos === 'inner'
      ? [
          ['50%', '90%'],
          ['50%', '60%'],
        ]
      : [
          ['35%', '81%'],
          ['73%', '84%'],
        ];

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    color,
    grid: {
      right: '10%',
    },
    legend: {
      show: false,
      orient: 'vertical',
      top: 'bottom',
      icon: 'circle',
      right: '1%',
      textStyle: {
        color: '#f2f2f2',
      },
    },
    series: [
      {
        radius: radius[0],
        center: ['50%', '50%'],
        type: 'pie',
        z: 0,
        roseType,
        labelLine: {
          show: false,
        },
        animation: true,
        label: {
          show: false,
        },
        data,
      },
      {
        radius: radius[1],
        center: ['50%', '50%'],
        z: 1,
        type: 'pie',
        label: {
          show: false,
          emphasis: {
            show: false,
          },
        },
        labelLine: {
          show: false,
          emphasis: {
            show: false,
          },
        },
        animation: false,
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: '#fff',
          opacity: 0.5,
        },
        data: [
          {
            value: 1,
          },
        ],
      },
    ],
  };
};
