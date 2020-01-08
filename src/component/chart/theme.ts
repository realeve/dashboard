import * as default_1 from '@antv/g2plot/lib/theme/default';
export default {
  backgroundStyle: {
    fill: '#222e4e',
  },
  defaultColor: '#5B8FF9',
  width: 400,
  height: 400,
  bleeding: [default_1.TOP_BLEEDING, 24, default_1.BOTTOM_BLEEDING, 24],
  padding: 'auto',
  title: {
    padding: [12, 24, 12, 24],
    fontFamily: 'PingFang SC',
    fontSize: 18,
    fontWeight: '200',
    fill: 'rgba(255,255,255,0.65)',
    stroke: 'rgba(0,0,0,0.95)',
    textAlign: 'left',
    textBaseline: 'top',
    lineHeight: 20,
    alignWithAxis: false,
  },
  description: {
    padding: [10, 24, default_1.DESCRIPTION_BOTTOM_MARGIN, 24],
    fontFamily: 'PingFang SC',
    fontSize: 12,
    fill: 'rgba(255, 255, 255, 0.65)',
    stroke: 'rgba(0,0,0,0.95)',
    textAlign: 'left',
    textBaseline: 'top',
    lineHeight: 16,
    alignWithAxis: false,
  },
  axis: {
    y: {
      visible: true,
      position: 'left',
      autoHideLabel: false,
      autoRotateLabel: false,
      autoRotateTitle: true,
      grid: {
        visible: true,
        style: {
          stroke: 'rgba(255, 255, 255, 0.15)',
          lineWidth: 1,
          lineDash: [0, 0],
        },
      },
      line: {
        visible: false,
        style: {
          stroke: 'rgba(255, 255, 255, 0.45)',
          lineWidth: 1,
        },
      },
      tickLine: {
        visible: false,
        style: {
          stroke: 'rgba(255, 255, 255, 0.45)',
          lineWidth: 0.5,
          length: 4,
        },
      },
      label: {
        visible: true,
        offset: 8,
        style: {
          fill: 'rgba(255, 255, 255, 0.45)',
          fontSize: 12,
        },
      },
      title: {
        visible: false,
        offset: 12,
        style: {
          fill: 'rgba(255, 255, 255, 0.65)',
          fontSize: 12,
          textBaseline: 'bottom',
        },
      },
    },
    x: {
      visible: true,
      position: 'bottom',
      autoHideLabel: false,
      autoRotateLabel: false,
      autoRotateTitle: false,
      grid: {
        visible: false,
        style: {
          stroke: 'rgba(255, 255, 255, 0.15)',
          lineWidth: 1,
          lineDash: [0, 0],
        },
      },
      line: {
        visible: false,
        style: {
          stroke: 'rgba(255, 255, 255, 0.45)',
        },
      },
      tickLine: {
        visible: true,
        style: {
          length: 4,
          stroke: 'rgba(255, 255, 255, 0.45)',
          lineWidth: 0.5,
        },
      },
      label: {
        visible: true,
        style: {
          fill: 'rgba(255, 255, 255, 0.65)',
          fontSize: 12,
        },
        offset: 16,
      },
      title: {
        visible: false,
        offset: 12,
        style: {
          fill: 'rgba(255, 255, 255, 0.65)',
          fontSize: 12,
        },
      },
    },
    circle: {
      autoHideLabel: false,
      autoRotateLabel: true,
      autoRotateTitle: true,
      // gridType: 'line',
      grid: {
        style: {
          lineDash: null,
          lineWidth: 1,
          stroke: '#E3E8EC',
        },
      },
      line: {
        style: {
          lineWidth: 1,
          stroke: '#BFBFBF',
        },
      },
      tickLine: {
        style: {
          lineWidth: 1,
          stroke: '#bdc8d3',
          length: 4,
          alignWithLabel: true,
        },
      },
      label: {
        offset: 16,
        style: {
          fill: '#a0a4aa',
          fontSize: 12,
        },
      },
      title: {
        offset: 12,
        style: { fill: '#767b84', fontSize: 12 },
      },
    },
  },
  legend: {
    flipPage: false,
    position: 'bottom-center',
    // 距离panelRange的距离
    innerPadding: [16, 16, 16, 16],
  },
  label: {
    offset: 12,
    style: {
      fill: 'rgba(255, 255, 255, 0.65)',
      lineWidth: 1,
    },
  },
  tooltip: {
    'g2-tooltip': {
      backgroundColor: 'rgba(33,33,33, 0.95)',
      boxShadow: '0px 0px 8px rgba(0,0,0,0.65)',
      color: 'rgba(255, 255, 255, 0.65)',
    },
  },
};