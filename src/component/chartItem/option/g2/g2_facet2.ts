import { textColor } from '../index';
import { getTheme } from '@antv/g2';
import { IG2Config } from '@/component/chartItem/option/g2plot/config';
const defaultTheme = getTheme();

export interface IFacet extends IG2Config {
  type: 'line' | 'bar' | 'column' | 'point';
}

export default ({ data, header, legend = 0, x = 1, y = 2, showLegend = false }: IFacet, chart) => {
  legend = String(legend);
  x = String(x);
  y = String(y);
  chart.data(data, {
    [y]: {
      alias: header[y],
      sync: true,
    },
  });

  if (showLegend) {
    chart.legend({
      attachLast: true,
      position: 'right',
    });
  }

  chart.axis(x, {
    label: {
      textStyle: {
        fill: textColor,
        fontSize: 12,
      },
    },
    tickLine: {
      alignWithLabel: false,
      length: 0,
    },
    line: {
      lineWidth: 0,
    },
  });
  chart.axis(y, {
    label: null,
    title: {
      offset: 30,
      textStyle: {
        fontSize: 12,
        fontWeight: 300,
      },
    },
    grid: {
      lineStyle: {
        lineWidth: 0,
      },
    },
  });

  chart.coordinate().transpose();
  chart
    .interval()
    .position(`${x}*${y}`)
    .color(legend, defaultTheme.colors10)
    .label(y, {
      textStyle: {
        fill: textColor,
      },
      offset: 10,
      formatter: (text) => {
        return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      },
    });

  chart.render();
};
