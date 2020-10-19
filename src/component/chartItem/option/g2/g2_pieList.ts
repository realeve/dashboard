import insertCss from 'insert-css';
import G2 from '@antv/g2';
import { IG2Config } from './g2_wind';
import { textColor } from '../index';

export default (
  { data: val, header, title = '', x = 0, y = 1, max = 100, innerPercent = 75 }: IG2Config,
  chart,
) => {
  const data = val.map(item => ({ type: item[x], value: item[y] }));

  insertCss(`
    .g2-guide-html {
        width: 50px;
        height: 50px;
        vertical-align: middle;
        text-align: center;
        line-height: 0.1
    }

    .g2-guide-html .title {
        font-size: 14px;
        color: ${textColor};
        font-weight: 300;
    }

    .g2-guide-html .value {
        font-size: 20px;
        color: #eee; 
        margin-top: 20px;
        font-weight: normal;
    }
`);

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

  chart.tooltip({
    // itemTpl: '<li><strong>{name}</strong>: {value}</li>',
    showTitle: false,
  });

  chart.facet('rect', {
    fields: ['type'],
    padding: 20,
    showTitle: false,
    eachView: function eachView(view, facet) {
      const data = facet.data;
      data.push({ type: '其他', value: max - data[0].value });
      view.source(data);
      view.coord('theta', {
        radius: 1,
        innerRadius: innerPercent / 100,
      });
      view
        .interval().adjust('stack')
        .position('value')
        .color('type', [G2.Global.colors[facet.colIndex], '#eceef133'])
        .opacity(1)
        .tooltip('type*value', (name, value) => {
          return {
            name: data[0].type,
            value: data[0].value,
          };
        });
      view.guide().html({
        position: ['50%', '50%'],
        html: `
        <div class="g2-guide-html">
          <p class="title">${data[0].type}</p>
          <p class="value">${data[0].value}%</p>
        </div>
      `,
      });
    },
  });

  chart.render();
};
