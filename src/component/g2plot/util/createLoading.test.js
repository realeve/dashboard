import React from 'react';
import ChartLoading from './createLoading';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// umi test ./src/component/g2plot/util/createLoading.test.js
// 详情可参考学习：https://enzymejs.github.io/enzyme/docs/installation/index.html
test('<ChartLoading/>', () => {
  const { container, rerender } = render(<ChartLoading type="bar" />);

  expect(container.querySelector('title')).toHaveTextContent('Loading...');

  rerender(<ChartLoading loadingTemplate={'a'} />);
  expect(container.firstChild.innerHTML).toBe('a');

  rerender(<ChartLoading type="unknown" />);
  expect(container.querySelectorAll('rect')).toHaveLength(11);
});
