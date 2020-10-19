import { textColor } from '../index';
import G2 from '@antv/g2';
import { IG2Config } from './g2_wind';
export interface IFacet extends IG2Config {
  type: 'line' | 'bar' | 'column' | 'point';
}
export let chartType = {
  bar: 'interval',
  line: 'line',
  point: 'point',
  column: 'interval',
};
const lineNBar = (
  { data, header, type = 'bar', legend = 0, x = 1, y = 2, showLegend = false }: IFacet,
  chart,
) => {
  legend = String(legend);
  x = String(x);
  y = String(y);

  chart.data(data, {
    [y]: {
      alias: header[y],
      sync: true,
    },
    [legend]: {
      sync: type !== 'line',
    },
  });

  if (showLegend) {
    chart.legend({
      position: type === 'point' ? 'top-center' : 'bottom-center',
      attachLast: true,
    });
  }

  const getColor = idx => {
    let colors = G2.Global.colors;
    return colors[idx % colors.length];
  };

  // chart.coord().transpose();

  let showTitle = {
    rowTitle: {
      offsetX: 15,
      style: {
        fontSize: 12,
        rotate: 90,
        textAlign: 'center',
        fill: '#8d8d8d',
      },
    },
    showTitle: true,
  };

  chart.facet('rect', {
    fields: [null, legend],
    ...showTitle,
    autoSetAxis: true, // 自动设置坐标轴的文本，避免重复和遮挡
    padding: 5, // 每个view 之间的间距
    eachView: function eachView(view, facet) {
      view.axis(x, {
        label: {
          textStyle: {
            fill: textColor,
            fontSize: 12,
          },
        },
        tickLine: null,
        line: {
          lineWidth: 0.5,
        },
        grid: null,
      });

      view.axis(y, false);

      const color = type === 'point' ? G2.Global.colors : getColor(facet.rowIndex);
      view[chartType[type]]()
        .shape(type === 'point' ? 'circle' : 'smooth')
        .opacity(0.8)
        .position(`${x}*${y}`)
        .color(legend, color)
        .label(y, {
          offset: 10,
          textStyle: {
            fill: textColor,
            fontSize: 12,
          },
        });
    },
  });

  chart.render();
};

const column = (
  { data, header, type = 'column', legend = 0, x = 1, y = 2, showLegend = false }: IFacet,
  chart,
) => {
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

  chart.coord().transpose();
  chart
    .interval()
    .position(`${x}*${y}`)
    .color(legend, G2.Global.colors)
    .label(y, {
      textStyle: {
        fill: textColor,
      },
      offset: 10,
      formatter: text => {
        return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      },
    });

  chart.render();
};

export default (props, chart) => {
  let method = ['line', 'bar', 'point'].includes(props.type) ? lineNBar : column;
  method(props, chart);
};
