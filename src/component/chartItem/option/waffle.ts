import { View } from '@antv/data-set';

export default ({ data }, chart) => {
  let maxCount = 100;
  const dv = new View().data(data).transform({
    type: 'waffle',
    maxCount,
    rows: 5,
  });

  chart.data(dv);
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
  chart
    .point()
    .position('x*y')
    .shape('square')
    .size('_hStep', hStep => Math.min(100 * 0.4 * hStep, 15))
    .color('name');

  chart.render();
};
