import React from 'react';
import G2Plot from '@/component/g2plot';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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
describe('g2plot', () => {
  test('初始化以及销毁', async () => {
    const { container, rerender } = render(<G2Plot renderer="svg" option={config} />);
    expect(container.innerHTML).toMatchSnapshot();

    rerender(<G2Plot renderer="svg" option={config} loading />);

    expect(container.querySelector('title')).toHaveTextContent('Loading...');

    const { chartType, ...option } = config;
    rerender(<G2Plot renderer="svg" option={option} />);

    expect(container.innerHTML).toMatchSnapshot();

    rerender(<G2Plot renderer="svg" option={{ chartType: 'unknown', ...option }} />);

    expect(container.innerHTML).toMatchSnapshot();
  });
});
