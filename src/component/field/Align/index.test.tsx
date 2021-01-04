import React from 'react';
import { create } from 'react-test-renderer';
import App from './index';
test('文本对齐图标', () => {
  let root = create(<App value={2} onChange={(e) => e} />);
  let tree = root.toJSON();
  expect(tree).toMatchSnapshot();
});
