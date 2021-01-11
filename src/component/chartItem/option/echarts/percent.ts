import 'echarts/lib/chart/gauge';

export default ({ value, half = false, width = 2, length = 10, color = '#30c3a7' }) => {
  const getItem = (percent, lineColor = '#30c3a7') => ({
    // 绿色刻度，蓝色刻度precent值是1
    type: 'gauge',
    animation: true,
    radius: half ? '140%' : '95%',
    startAngle: (359.99 * percent) / 100 / (half ? 2 : 1),
    center: ['50%', half ? '90%' : '50%'],
    endAngle: 0,
    clockwise: false,
    min: 0,
    max: 100,
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    splitNumber: 0.36 * percent,
    splitLine: {
      show: true,
      length: `${length}%`,
      lineStyle: {
        color: lineColor,
        width,
      },
    },
    axisLine: {
      show: false,
    },
    pointer: {
      show: false,
    },
    detail: {
      show: false,
    },
  });

  return {
    series: [
      { ...getItem(value, color), z: 1 },
      { ...getItem(100, '#458'), z: 0 },
    ],
  };
};
