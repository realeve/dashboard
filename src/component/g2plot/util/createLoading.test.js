import ChartLoading from './createLoading';
import { mount } from 'enzyme';

// umi test ./src/component/g2plot/util/createLoading.test.js
// 详情可参考学习：https://enzymejs.github.io/enzyme/docs/installation/index.html
test('<ChartLoading/>', () => {
  const wrapper1 = mount(<ChartLoading type="bar" />);
  expect(wrapper1.find('svg')).toHaveLength(1);

  const wrapper2 = mount(<ChartLoading loadingTemplate={'a'} />);
  expect(wrapper2.find('svg')).toHaveLength(0);

  const wrapper3 = mount(<ChartLoading type="unknown" />);
  expect(wrapper3.find('rect')).toHaveLength(11);
});
