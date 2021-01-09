import color from './themeColor';
// const FONT_FAMILY =  '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"';
const FONT_FAMILY =
  '"Unica One","-apple-system", "Segoe UI", Roboto, "Helvetica Neue", Arial,\n  "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"';

export default {
  backgroundColor: 'transparent',
  color: color.COLOR_PLATE_8,
  animationDuration: 1500,
  // animationEasing: 'elasticOut',
  // animationEasingUpdate: 'elasticOut',
  // animationDelay: (idx) => idx * 100,
  // animationDelayUpdate: (idx) => idx * 100,
  singleAxis: {
    top: 50,
    bottom: 50,
    type: 'time',
    axisTick: {},
    axisLabel: {
      color: '#222',
      // textStyle: {
      //   color: '#222',
      // },
    },
    axisLine: {
      lineStyle: {
        color: '#aaa',
        width: 2,
      },
    },
    axisPointer: {
      animation: true,
      label: {
        show: true,
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        opacity: 0.2,
      },
    },
  },
  title: {
    itemGap: 8,
    textStyle: {
      fontWeight: 'lighter',
      color: '#666',
      fontSize: 24,
    },
    subtextStyle: {
      color: '#666',
    },
  },
  darkMode: true,
  toolbox: {
    color: ['rgb(38,185,139)', 'rgb(38,185,139)', 'rgb(38,185,139)', 'rgb(38,185,139)'],
    left: 'left',
  },
  legend: {
    top: 35,
    left: 'right',
  },
  tooltip: {
    backgroundColor: 'rgba(48, 54, 64, 0.8)',
    padding: 12,
    extraCssText:
      'box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 4px;border-radius: 3px;border:none;opacity: 0.95;backdrop-filter: saturate(180%) blur(20px);',
    textStyle: {
      color: '#E0E0E3',
      fontSize: 12,
      lineHeight: 1.5,
    },
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: '#aaa',
      },
      crossStyle: {
        color: '#aaa',
      },
      shadowStyle: {
        color: 'rgba(128,200,128,0.1)',
      },
      label: {
        backgroundColor: '#6a7985',
        color: '#fff',
      },
    },
  },
  grid: {
    borderWidth: 0,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    containLabel: true,
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#aaa',
        width: 2,
      },
    },
    boundaryGap: true,
    splitLine: {
      show: false,
    },
    nameTextStyle: {
      fontSize: 16,
      color: '#555',
    },
    axisLabel: {
      color: '#222',
      // textStyle: {
      //   color: '#222',
      // },
    },
    splitArea: {
      show: false,
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#222',
      // textStyle: {
      //   color: '#222',
      // },
    },
    nameTextStyle: {
      fontSize: 16,
      color: '#555',
    },
    splitLine: {
      lineStyle: {
        color: ['#ddd'],
        width: 1,
        type: 'dashed',
      },
      show: true,
    },
    splitArea: {
      show: false,
    },
  },
  timeline: {
    lineStyle: {
      color: 'rgb(38,185,139)',
    },
    controlStyle: {
      color: 'rgb(38,185,139)',
      // normal: {
      //   color: 'rgb(38,185,139)',
      // },
      // emphasis: {
      //   color: 'rgb(38,185,139)',
      // },
    },
  },
  bar: {
    itemStyle: {
      borderRadius: 1,
      emphasis: {
        borderRadius: 1,
      },
    },
  },
  line: {
    smooth: false,
    symbol: 'emptyCircle',
    symbolSize: 6,
    itemStyle: {
      barBorderColor: 'rgba(0,0,0,0)',
      label: {
        show: true,
      },
      lineStyle: {
        width: 8,
        type: 'solid',
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowBlur: 5,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    lineStyle: {
      width: 8,
      type: 'solid',
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowBlur: 5,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    },
    showAllSymbol: true,
  },
  radar: {
    clickable: true,
    legendHoverLink: true,
    polarIndex: 0,
    itemStyle: {
      label: {
        show: false,
      },
      lineStyle: {
        width: 2,
        type: 'solid',
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowBlur: 1,
        shadowOffsetX: 1,
        shadowOffsetY: 1,
      },
      areaStyle: {
        type: 'default',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    splitLine: {
      lineStyle: {
        color: ['#ddd'],
      },
    },
    symbolSize: 5,
    symbol: 'emptyCircle',
  },
  pie: {
    clickable: true,
    legendHoverLink: true,
    center: ['50%', '50%'],
    radius: [0, '75%'],
    clockWise: true,
    startAngle: 90,
    minAngle: 0,
    selectedOffset: 10,
    itemStyle: {
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 1,
      label: {
        show: true,
        position: 'inner',
        formatter: '{b}',
        textStyle: {
          fontSize: 12,
        },
      },
      labelLine: {
        show: false,
        length: 20,
        lineStyle: {
          width: 1,
          type: 'solid',
        },
      },
      emphasis: {
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
          length: 20,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
      },
    },
  },
  textStyle: {
    fontFamily: FONT_FAMILY, // : "等线,微软雅黑, Arial, Verdana"
  },
};
