import { IG2Config } from './config';

const chartType = {
  line: 'Line',
  bar: 'Column',
  column: 'Bar',
};

export interface IG2PlotConfig {
  smooth: boolean;
  label: {
    visible: boolean;
    type: string;
    autoScale?: boolean;
  };
  legend: {
    visible: boolean;
    position: string;
  };
  point: {
    visible: boolean;
    shape: string;
  };
  xField: string;
  yField: string;
  xAxis: {
    title: {
      text: any;
    };
    autoHideLabel?: boolean;
  };
  yAxis: {
    title: {
      text: any;
    };
    label: {
      formatter: (v: any) => string;
    };
  };
  seriesField?: string | number;
  groupField?: string | number;
  stackField?: string | number;
  connectedArea?: {
    visible: boolean;
    triggerOn: boolean;
  };
  // 缩略图
  interactions?: {
    type: string;
    cfg: {
      start?: number;
      end?: number;
      type?: string;
    };
  }[];
  step?: 'hv' | 'vh' | 'vhv' | 'hvh';
}

export default ({
  data,
  header,
  type = 'line',
  legend = 0,
  x = 1,
  y = 2,
  showLegend = true,
  point = true,
  smooth = true,
  group = false,
  stack = false,
  area = false,
  thumbnail = false,
  step = null,
  labelStyle = null,
  percent = false,
}: IG2Config) => {
  // handle data index
  legend = String(legend);
  x = String(x);
  y = String(y);
  if (header.length < 3) {
    legend = undefined;
  }

  // 条形图需要交换x,y轴
  if (type === 'column') {
    let temp = x;
    x = y;
    y = temp;
  }

  let _type = chartType[type];

  let configs: IG2PlotConfig = {
    smooth,
    label: {
      visible: true,
      type: labelStyle || (percent || area ? 'area' : 'line'),
      autoScale: true,
    },
    legend: {
      visible: showLegend,
      position: area ? 'right-top' : 'top',
    },
    point: {
      visible: point,
      shape: 'point',
    },
    xField: x,
    yField: y,
    xAxis: {
      title: {
        text: header[x],
      },
      autoHideLabel: true,
    },
    yAxis: {
      title: {
        text: header[y],
      },
      label: {
        // 数值格式化为千分位
        formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
      },
    },
  };

  if (area) {
    _type = 'Area';
    stack = true;
  }

  if (step) {
    _type = 'Step' + _type;
    if (Boolean(step) === true) {
      step = 'hv';
    }

    // step 模式下不支持Group
    stack = false;
    group = false;
    configs = {
      ...configs,
      step,
    };
  }

  if (group) {
    configs.groupField = legend;
    _type = 'Group' + _type;
  }

  if (stack) {
    configs = {
      ...configs,
      stackField: legend,
      connectedArea: {
        visible: true,
        triggerOn: false,
      },
    };

    _type = 'Stack' + _type;
  }

  if (!group && !stack && typeof legend !== 'undefined') {
    configs.seriesField = legend;
  }

  if (percent) {
    if (type === 'line') {
      _type = 'PercentageStackArea';
    } else if (type === 'bar') {
      _type = 'PercentageStackColumn';
    } else if (type === 'column') {
      _type = 'PercentageStackBar';
    }
  }

  if (thumbnail) {
    let thumbCfg =
      type === 'column'
        ? {
            type: 'scrollbar',
            cfg: {
              type: 'horizontal',
            },
          }
        : {
            type: 'slider',
            cfg: {
              start: 0,
              end: 1,
            },
          };

    configs = {
      ...configs,
      interactions: [thumbCfg],
    };
  }

  return {
    data,
    config: {
      configs,
      type: _type,
    },
  };
};