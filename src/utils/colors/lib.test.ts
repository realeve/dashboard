import * as lib from './lib';

// umi test ./src/utils/colors/lib.test.ts
test('获取颜色中文名', () => {
  expect(lib.getColorName('rgb(242,146,12)')).toMatchObject({
    title: '杏黄',
    color: [242, 142, 22],
  });
  expect(lib.getColorName('#7B9F45')).toMatchObject({
    title: '乌苏木绿',
    color: [141, 178, 85],
  });
  expect(lib.getColorName('#2B3513')).toMatchObject({
    title: '象牙黑',
    color: [41, 36, 33],
  });
  expect(lib.getColorName('#6E3311')).toMatchObject({
    title: '筍皮棕',
    color: [115, 46, 18],
  });
  expect(lib.getColorName('#845C1E')).toMatchObject({
    title: '蜴蜊绿',
    color: [131, 94, 29],
  });
});
