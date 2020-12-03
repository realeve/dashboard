import createNode from './createNode';

// umi test ./src/component/g2plot/util/createNode.test.ts
test('创建结点', () => {
  const Tooltip = createNode(null);
  expect(Tooltip.className).toBe('g2-tooltip');
});
