export default ({ value, half = false }) => {
  let getItem = (percent, color = '#30c3a7') => ({
    //绿色刻度，蓝色刻度precent值是1
    name: '脱贫人数占比',
    type: 'gauge',
    animation: true,
    radius: '90%',
    startAngle: (359.99 * percent) / 100 / (half ? 2 : 1),
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
      length: '10%',
      lineStyle: {
        color,
        width: 2,
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
      { ...getItem(value), z: 1 },
      { ...getItem(100, '#458'), z: 0 },
    ],
  };
};
