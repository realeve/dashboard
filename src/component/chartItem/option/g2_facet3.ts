import { textColor } from './index';
import * as R from 'ramda';
import G2 from '@antv/g2';
import { IG2Config } from './g2_wind';
export default (
  { data, header, legend = 0, x = 1, y = 2, showLegend = false }: IG2Config,
  chart,
) => {
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

  chart.coord().transpose();

  chart.facet('rect', {
    fields: [legend],
    ...showTitle,
    // 自动调整间距
    padding: [10, 0, 0, 5 + 13 * 4],
    eachView: function eachView(view, facet) {
      if (facet.colIndex === 0) {
        view.axis(x, {
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

        view.axis(y, false);
      } else {
        view.axis(false);
      }

      const color = getColor(facet.colValue);
      view
        .interval()
        .position(`${x}*${y}`)
        .color(legend, color)
        // .size(20)
        .label(y, function(value) {
          const offset = value < 25 ? 10 : -4;
          const fill = value < 25 ? textColor : '#ffffff';
          const textAlign = value < 25 ? 'start' : 'end';
          return {
            offset,
            textStyle: {
              fill,
              fontSize: 12,
              textAlign,
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
