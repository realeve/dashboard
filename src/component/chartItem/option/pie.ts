import color from '@/component/echarts/themeColor';
export default ({ value, title, x = 0, y = 1 }) => {
  let _color = ['#afa3f5', '#00d488', '#3feed4', '#3bafff', '#f1bb4c', ...color.COLOR_PLATE_8];
  let data = value.map(item => ({
    value: item[y],
    name: item[x],
  }));

  return {
    // title: [
    //   {
    //     text: title,
    //     x: 'center',
    //     y: 'center',
    //     padding: [0, 0, 0, -20],
    //     textStyle: {
    //       fontSize: 22,
    //       color: ['#fff'],
    //       rich: {
    //         align: 'right',
    //       },
    //     },
    //     subtextStyle: {
    //       color: '#7D838D',
    //       fontSize: 12,
    //     },
    //   },
    // ],
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
        radius: ['55%', '81%'],
        center: ['50%', '50%'],
        type: 'pie',
        labelLine: {
          normal: {
            show: true,
            length: 15,
            length2: 120,
            lineStyle: {
              color: '#9aa8d4',
            },
            align: 'right',
          },
          color: '#000',
          emphasis: {
            show: true,
          },
        },
        label: {
          position: 'outer',
          alignTo: 'edge',
          margin: 20,
          normal: {
            formatter: function(params) {
              return `{nameStyle|${params.name}} {rate|${params.percent}%}`;
            },
            padding: [0, -100],
            height: 45,
            rich: {
              nameStyle: {
                fontSize: 14,
                color: '#9aa8d4',
                align: 'left',
              },
              rate: {
                fontSize: 16,
                color: '#1ab4b8',
                align: 'left',
              },
            },
          },
          //   emphasis: {
          //     show: true,
          //     textStyle: {
          //       fontSize: '20',
          //       fontWeight: 'bold',
          //     },
          //   },
        },
        data,
      },
      // 边框的设置
      {
        radius: ['75%', '81%'],
        center: ['50%', '50%'],
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
            color: 'rgba(250,250,250,0.5)',
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
