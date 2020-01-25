import echarts from 'echarts';

export default ({ value, x = 0, y = 1 }) => {
  let xData = [],
    yData = [];
  value.forEach(item => {
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
        barWidth: '20px',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
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
            barBorderRadius: [30, 30, 30, 30],
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
            position: ['-8', '-60'],
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
