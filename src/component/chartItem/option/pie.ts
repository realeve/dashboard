import color from '@/component/echarts/themeColor';
export type circlePos = 'inner' | 'outter';
export default ({ data: value, title, x = 0, y = 1, circlePos = 'inner', roseType = '' }) => {
  let _color = ['#afa3f5', '#00d488', '#3feed4', '#3bafff', '#f1bb4c', ...color.COLOR_PLATE_8];
  let data = value.map(item => ({
    value: item[y],
    name: item[x],
  }));

  let radius =
    circlePos === 'inner'
      ? [
          ['50%', '90%'],
          ['50%', '60%'],
        ]
      : [
          ['35%', '81%'],
          ['73%', '81%'],
        ];

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    color: _color,
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
      // 主要展示层的
      {
        radius: radius[0],
        center: ['50%', '50%'],
        type: 'pie',
        z: 0,
        roseType,
        labelLine: {
          normal: {
            show: false,
          },
        },
        animation: true,
        label: {
          // position: 'center',
          show: false,
          // formatter: function(params) {
          //   return `{rate|${params.percent}%}\n\n{nameStyle|${params.name}}`;
          // },
          // height: 45,
          // rich: {
          //   nameStyle: {
          //     fontSize: 16,
          //     color: '#9aa8d4',
          //     align: 'left',
          //   },
          //   rate: {
          //     fontSize: 20,
          //     color: '#1ab4b8',
          //     align: 'center',
          //   },
          // },
        },
        data,
      },
      // 边框的设置
      {
        radius: radius[1],
        center: ['50%', '50%'],
        z: 1,
        type: 'pie',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        animation: false,
        tooltip: {
          show: false,
        },
        itemStyle: {
          normal: {
            color: '#fff',
            opacity: 0.5,
          },
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
