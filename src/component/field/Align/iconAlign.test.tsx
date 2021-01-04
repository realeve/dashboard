import React from 'react';
import { create } from 'react-test-renderer';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from './iconAlign';
test('文本对齐图标', () => {
  let root = create(<AlignLeftIcon />);

  expect(root.toJSON()).toMatchSnapshot();

  root.update(<AlignCenterIcon />);
  expect(root.toJSON()).toMatchSnapshot();

  root.update(<AlignRightIcon />);
  expect(root.toJSON()).toMatchSnapshot();
});
