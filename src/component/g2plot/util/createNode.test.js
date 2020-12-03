updatimport createNode from './createNode';
import { mount } from 'enzyme';
import sinon from 'sinon';

// umi test ./src/component/g2plot/util/createNode.test.ts
test('创建结点', () => {
  const Tooltip = createNode('b');
  const wrapper = mount(<Tooltip />);
  expect(wrapper.find('.g2-tooltip').length).toBe(1);
});
