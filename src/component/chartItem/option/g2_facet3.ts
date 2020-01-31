import { textColor } from './index';
import * as R from 'ramda';
import G2 from '@antv/g2';
import { IG2Config } from './g2_wind';
interface IFacet extends IG2Config {
  type: 'line' | 'bar' | 'column';
}

export default (
  { data, header, type = 'bar', legend = 0, x = 1, y = 2, showLegend = false }: IFacet,
  chart,
) => {
  let chartType = ['column', 'bar'].includes(type) ? 'interval' : 'line';
  legend = String(legend);
  x = String(x);
  y = String(y);

  chart.source(data);

  if (showLegend) {
    chart.legend({
      position: 'top-center',
      attachLast: true,
    });
  }
  if (['line', 'bar'].includes(type)) {
    let max = Math.max(...R.pluck(y)(data));
    chart.scale(y, {
      max,
    });
  }

  let legendData = R.compose(R.uniq, R.pluck(legend))(data);
  const getColor = type => {
    let colors = G2.Global.colors;
    let idx = R.findIndex(item => item == type)(legendData);
    return colors[idx % colors.length];
  };

  let showTitle = !showLegend
    ? {
        colTitle: {
          offsetY: -15,
          style: {
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 300,
            fill: textColor,
          },
        },
        showTitle: true,
      }
    : { showTitle: false };

  if (type === 'column') {
    chart.coord().transpose();
  } else if (['line', 'bar'].includes(type)) {
    chart.scale(x, {
      range: [0, 1],
      tickCount: 4,
    });
  }

  chart.facet('rect', {
    fields: [legend],
    ...showTitle,
    // 自动调整间距
    padding: [10, 0, 0, 5 + 13 * 4],
    eachView: function eachView(view, facet) {
      if (['line', 'bar'].includes(type) || facet.colIndex === 0) {
        view.axis(['line', 'bar'].includes(type) ? y : x, {
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
          grid: null,
        });
      }

      if (['line', 'bar'].includes(type)) {
        view.axis(x);
      } else {
        if (facet.colIndex === 0) {
          view.axis(y, false);
        } else {
          view.axis(false);
        }
      }

      const color = getColor(facet.colValue);

      view[chartType]()
        .shape('smooth')
        .opacity(0.8)
        .position(`${x}*${y}`)
        .color(legend, color)
        .label(y, function(value) {
          const offset = ['line', 'bar'].includes(type) ? 10 : value < 25 ? 10 : -4;
          const fill = value < 25 ? textColor : '#ffffff';
          const textAlign = value < 25 ? 'start' : 'end';
          return {
            offset,
            textStyle: {
              fill,
              fontSize: 12,
              // textAlign,
              fontWeight: 300,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
            },
          };
        });
    },
  });
  chart.render();
};
