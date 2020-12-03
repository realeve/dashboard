import React from 'react';
import { mount } from 'enzyme';
import G2Plot from '@/component/g2plot';

const config = {
  chartType: 'bar',
  autoFit: true,
  data: [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
  ],
  xField: 'type',
  yField: 'sales',
};

// umi test ./src/component/g2plot/index.test.js
describe('useChart', () => {
  it('初始化以及销毁', async () => {
    const ref = React.createRef();
    mount(<G2Plot option={config} ref={ref} />);
    expect(ref.current).not.toBeNull();
    const chart = ref.current.getChart();
    // chart的render会报canvas相关错误，故destroy,download等均无效
    // console.log(chart);
    expect(chart.chart.destroyed).toBe(false);
    const a = chart.getChartSize();
    expect(a).toMatchObject({ width: 400, height: 400 });
    expect(chart.toDataURL()).toBeNull();
  });
});
