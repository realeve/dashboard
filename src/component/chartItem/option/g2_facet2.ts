import { textColor } from './index';
import * as R from 'ramda';
import G2 from '@antv/g2';
import { IG2Config } from './g2_wind';
interface IFacet extends IG2Config {
  type: 'line' | 'bar';
}

export default (
  { data, header, type = 'bar', legend = 0, x = 1, y = 2, showLegend = false }: IG2Config,
  chart,
) => {
  legend = String(legend);
  x = String(x);
  y = String(y);

  chart.source(data);

  if (showLegend) {
    chart.legend({
      position: 'bottom-center',
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
      }
    : { showTitle: false };

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
      view.axis(y, {
        grid: null,
      });

      view.axis(y, false);

      const color = getColor(facet.rowValue);

      let chartType = type === 'bar' ? 'interval' : 'line';
      view[chartType]()
        .shape('smooth')
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
