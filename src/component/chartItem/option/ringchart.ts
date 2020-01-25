import echarts from 'echarts';
export default ({ value, title = '' }) => {
  let _title = {
    text: value,
    textStyle: {
      color: '#01c4a3',
      fontSize: 40,
    },
    itemGap: -10, // 主副标题距离
    left: 'center',
    top: 'center',
  };
  if (title.length > 0) {
    _title = {
      ..._title,
      subtext: title,
      subtextStyle: {
        color: '#f2f2f2',
        fontSize: 14,
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
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
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
        barWidth: 40,
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
        barWidth: 40,
        barGap: '-100%', // 两环重叠
        z: 1,
      },
    ],
  };
};
