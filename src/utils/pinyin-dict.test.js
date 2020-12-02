// umi test ./src/utils/pinyin-dict.test.js
import pinyin from './pinyin-dict';
test('list', () => {
  expect(pinyin.a).toHaveLength(3);
});
