import { View } from '@antv/data-set';

export default ({ data: val, x = 0, y = 1 }, chart) => {
  let data = val.map(item => ({ name: item[x], value: item[y] }));
  let sum = val.map(item => item[y]).reduce((a, b) => a + b, 0);
  let percent = {};
  data.forEach(item => {
    percent[item.name] = ((item.value / sum) * 100).toFixed(2);
  });

  let maxCount = 100;
  const dv = new View().source(data).transform({
    type: 'waffle',
    maxCount,
    rows: 5,
  });

  chart.source(dv);
  chart.scale({
    x: { nice: false },
    y: { nice: false },
  });
  chart.axis(false);
  chart.legend('name', {
    position: 'bottom',
  });
  chart.legend('_hStep', false);
  chart.legend('_wStep', false);

  chart.tooltip({
    itemTpl:
      '<li><strong>{name}</strong>: {value} <span style="color:#e23">({percent}%)</span></li>',
    showTitle: false,
  });

  chart
    .point()
    .position('x*y')
    .shape('square')
    .size('_hStep', hStep => Math.min(100 * 0.4 * hStep, 15))
    .color('name')
    .tooltip('name*value', (name, value) => {
      return { name, value, percent: percent[name] };
    });

  chart.render();
};
