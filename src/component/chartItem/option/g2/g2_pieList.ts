import { IG2Config } from './g2_wind';
import { getTheme } from '@antv/g2';
const defaultTheme = getTheme();

export default (
  { data: val, header, x = 0, y = 1, max = 100, innerPercent = 75 }: IG2Config,
  chart,
) => {
  const data = val.map((item) => ({ type: item[x], value: item[y] }));

  chart.data(data);
  chart.legend(false);
  //别名
  chart.scale({
    type: {
      alias: header[x],
    },
    value: {
      alias: header[y],
    },
  });

  chart.tooltip(false);

  chart.facet('list', {
    fields: ['type'],
    padding: 5,
    cols: 2,
    showTitle: false,
    eachView: function eachView(view, facet) {
      const data = facet.data;
      data.push({ type: '其他', value: max - data[0].value });
      view.data(data);
      view.coordinate('theta', {
        radius: 1,
        innerRadius: innerPercent / 100,
      });

      // list 模式下，需要手工计算行列
      let idx = facet.rowIndex * facet.columnValuesLength + facet.columnIndex;

      view
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', [defaultTheme.colors10[idx], '#eceef133'])
        .style({
          opacity: 1,
        });
      view.interaction('element-active');

      view.annotation().text({
        position: ['50%', '50%'],
        content: (obj) => {
          return obj[0].type + '\n' + obj[0].value + '%';
        },
        style: {
          fill: '#fff',
          fontSize: 14,
          shadowBlur: 0,
          textAlign: 'center',
        },
      });
    },
  });

  chart.render();
};
