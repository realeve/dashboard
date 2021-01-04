import paletteList from './palette';

test('绘画板', () => {
  expect(paletteList).toMatchSnapshot();
});
