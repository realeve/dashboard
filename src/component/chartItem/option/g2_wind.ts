import { textColor } from './index';
import * as R from 'ramda';
// JSON.stringify(data.map(item => Object.values(item)));
export interface IG2Config {
  data: (string | number)[][];
  header: string[];
  legend?: string | number;
  x?: string | number;
  y?: string | number;
  showLegend?: boolean;
  [key: string]: any;
}
export default (
  { data, header, legend = 0, x = 1, y = 2, showLegend = true }: IG2Config,
  chart,
) => {
  legend = String(legend);
  x = String(x);
  y = String(y);

  let val = R.pluck([y])(data);
  let xLen = R.map(item => item.length)(R.pluck([x])(data));

  //别名
  chart.scale(header.map(alias => ({ alias })));

  chart.source(data, {
    [y]: {
      nice: false,
      alias: header[y],
      max: Math.max(...val),
    },
  });

  chart.axis(y, false);
  chart.axis(x, {
    line: null,
    tickLine: null,
    label: {
      textStyle: {
        textAlign: 'right', // 文本对齐方向，可取值为： start middle end
        fill: textColor, // 文本的颜色
        textBaseline: 'middle', // 文本基准线，可取 top middle bottom，默认为middle
      },
      offset: 5,
    },
    offset: 5,
  });

  if (showLegend) {
    chart.legend({
      position: 'top-center',
    });
  }

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
  chart.facet('mirror', {
    fields: [legend],
    autoSetAxis: false,
    transpose: true,
    ...showTitle,
    // 自动调整两侧间距
    padding: [10, 5 + 13 * Math.max(...xLen), 0, 0],
    eachView: function eachView(view, facet) {
      const facetIndex = facet.colIndex;
      if (facetIndex === 0) {
        view.axis(false);
      }
      const color = facetIndex === 0 ? '#1890ff' : '#2fc25b';
      view
        .intervalStack()
        .position(`${x}*${y}`)
        .color(legend, [color, '#ebedf0'])
        // .size(30)
        .label(y, function(val) {
          let offset = -4;
          let shadowBlur = 2;
          let textAlign = facetIndex === 1 ? 'end' : 'start';
          let fill = 'white';
          if (val < 15) {
            offset = 4;
            textAlign = facetIndex === 1 ? 'start' : 'end';
            fill = textColor;
            shadowBlur = 0;
          }
          return {
            offset,
            textStyle: {
              fill,
              shadowBlur,
              shadowColor: 'rgba(0, 0, 0, .45)',
              textAlign,
            },
          };
        });
    },
  });

  chart.render();
};
