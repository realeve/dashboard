import React from 'react';
import { create } from 'react-test-renderer';
import { TopIcon, LeftIcon, RightIcon, BottomIcon } from './iconPosition';
test('文本对齐图标', () => {
  let root = create(<TopIcon />);

  expect(root.toJSON()).toMatchSnapshot();

  root.update(<LeftIcon />);
  expect(root.toJSON()).toMatchSnapshot();

  root.update(<RightIcon />);
  expect(root.toJSON()).toMatchSnapshot();

  root.update(<BottomIcon />);
  expect(root.toJSON()).toMatchSnapshot();
});
