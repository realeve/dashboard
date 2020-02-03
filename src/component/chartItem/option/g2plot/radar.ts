import { textColor } from './../index';
import { IG2Config } from './config';

export interface IG2PlotConfig {
  angleField: string;
  radiusField: string;
  seriesField?: string;
  angleAxis: {
    title: {
      text: any;
    };
    label: {
      textStyle: {
        fill: string;
      };
    };
  };
}

export default ({ data, header, legend = 0, x = 1, y = 2 }: IG2Config) => {
  legend = String(legend);
  x = String(x);
  y = String(y);

  let configs: IG2PlotConfig = {
    angleField: x,
    radiusField: y,
    angleAxis: {
      title: {
        text: header[legend],
      },
      label: {
        textStyle: {
          fill: textColor,
        },
      },
    },
  };

  if (typeof legend !== 'undefined') {
    configs.seriesField = legend;
  }

  return {
    data,
    config: {
      configs,
      type: 'Radar',
    },
  };
};
