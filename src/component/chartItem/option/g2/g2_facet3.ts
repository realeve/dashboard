import { textColor } from '../index';
import * as R from 'ramda';
import G2 from '@antv/g2';
import { chartType, IFacet } from './g2_facet2';
export default (
  { data, header, type = 'bar', legend = 0, x = 1, y = 2, showLegend = false }: IFacet,
  chart,
) => {
  legend = String(legend);
  x = String(x);
  y = String(y);

  chart.data(data, {
    [legend]: {
      sync: type !== 'line',
    },
    [y]: {
      sync: true,
    },
  });

  if (showLegend) {
    chart.legend({
      position: 'top-center',
      attachLast: true,
    });
  }

  let legendData = R.compose(R.uniq, R.pluck(legend))(data);
  const getColor = idx => {
    let colors = G2.Global.colors;
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
  } else if (['line', 'bar', 'point'].includes(type)) {
    let xLen = R.uniq(R.pluck(x, data)).length;
    chart.scale(x, {
      range: [0, 1],
      tickCount: xLen > 4 ? 4 : xLen,
    });
  }

  chart.facet(type === 'point' ? 'list' : 'rect', {
    fields: [legend],
    ...showTitle,
    // 自动调整间距
    padding: [10, 0, 0, 5 + 13 * 4],
    cols: legendData.length > 4 ? 4 : legendData.length, // 超过4个换行
    eachView: function eachView(view, facet) {
      if (['line', 'bar', 'point'].includes(type) || facet.colIndex === 0) {
        view.axis(['line', 'bar', 'point'].includes(type) ? y : x, {
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

      if (['line', 'bar', 'point'].includes(type)) {
        view.axis(x);
      } else {
        if (facet.colIndex === 0) {
          view.axis(y, false);
        } else {
          view.axis(false);
        }
      }

      const color = type === 'point' ? G2.Global.colors : getColor(facet.colIndex);

      let chartView = view[chartType[type]]()
        .shape(type === 'point' ? 'circle' : 'smooth')
        .opacity(0.8)
        .position(`${x}*${y}`)
        .color(legend, color);

      if (type !== 'point') {
        chartView.label(y, function(value) {
          const offset = ['line', 'bar', 'point'].includes(type) ? 10 : value < 25 ? 10 : -4;
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
      }
    },
  });
  chart.render();
};
