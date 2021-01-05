import React from 'react';
import EditSlider from './EditSlider';

import { create } from 'react-test-renderer';

test('编辑器右下角缩放', () => {
  let config = {
    zoom: 1,
    showConfig: true,
    hide: false,
    curTool: 'MoveTool',
    editor: null,
    onZoom: (e) => e,
    onToggleThumb: (e) => e,
    onMenuChange: (e) => e,
  };
  let root = create(<EditSlider {...config} />);
  expect(root.toJSON()).toMatchSnapshot();
  config = { ...config, zoom: 1.5, showConfig: false, hide: true };
  root.update(<EditSlider {...config} />);
  expect(root.toJSON()).toMatchSnapshot();

  config = { ...config, zoom: 1.5, showConfig: true, editor: <a>1</a>, curTool: 'hand' };
  root.update(<EditSlider {...config} />);
  expect(root.toJSON()).toMatchSnapshot();
});
