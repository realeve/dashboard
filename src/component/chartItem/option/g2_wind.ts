import { textColor } from './index';
import * as R from 'ramda';
export { IG2Config } from './g2plot/config';

import { IG2Config } from './g2plot/config';

export default (
  { data, header, legend = 0, x = 1, y = 2, showLegend = true, direction = 'vertical' }: IG2Config,
  chart,
) => {
  legend = String(legend);
  x = String(x);
  y = String(y);
  const isVertical = direction === 'vertical';

  let xLen = R.map(item => item.length)(R.pluck([x])(data));

  //别名
  chart.scale(header.map(alias => ({ alias })));
  let yConfig = {
    nice: false,
    alias: header[y],
    sync: true,
  };

  chart.source(data, {
    [y]: yConfig,
  });

  chart.axis(
    y,
    isVertical
      ? false
      : {
          grid: null,
          label: {
            textStyle: {
              fill: textColor, // 文本的颜色
            },
          },
        },
  );

  let textStyle = {
    fill: textColor, // 文本的颜色
    fontSize: 12,
  };

  chart.axis(x, {
    line: null,
    tickLine: null,
    label: {
      textStyle: isVertical
        ? textStyle
        : {
            ...textStyle,
            textAlign: isVertical ? 'right' : 'center', // 文本对齐方向，可取值为： start middle end
            textBaseline: 'middle', // 文本基准线，可取 top middle bottom，默认为middle
          },
      offset: isVertical ? 5 : 15,
    },
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

  if (isVertical) {
    chart.coord().transpose();
  }

  chart.facet('mirror', {
    fields: [legend],
    autoSetAxis: false,
    transpose: isVertical,
    ...showTitle,
    // 自动调整两侧间距
    padding: isVertical ? [10, 5 + 13 * Math.max(...xLen), 0, 0] : [0, 0, 30, 0],
    eachView: function eachView(view, facet) {
      const facetIndex = facet[isVertical ? 'colIndex' : 'rowIndex'];
      if ((isVertical && facetIndex === 0) || (!isVertical && facetIndex > 0)) {
        view.axis(x, false);
      }
      const color = facetIndex === 0 ? '#1890ff' : '#2fc25b';
      view
        .interval()
        .position(`${x}*${y}`)
        .color(legend, [color, '#ebedf0'])
        .label(y, function(val) {
          if (!isVertical) {
            return {
              offset: 10,
              textStyle: {
                fill: val < 15 ? textColor : '#fff',
              },
            };
          }
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
