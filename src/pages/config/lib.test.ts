import * as lib from './lib';

// umi test ./src/pages/config/lib.test.ts
const panel = [
  {
    style: {
      transform: { translate: '-65px,-65px' },
      top: '80px',
      left: '80px',
      width: '600px',
      height: '320px',
    },
  },
  {
    style: {
      transform: { translate: '-65px,300px' },
      top: '80px',
      left: '80px',
      width: '600px',
      height: '320px',
    },
  },
  {
    style: {
      transform: { translate: '-65px,652px' },
      top: '80px',
      left: '80px',
      width: '600px',
      height: '320px',
    },
  },
  {
    style: {
      transform: { translate: '570px,-65px' },
      top: '80px',
      left: '80px',
      width: '600px',
      height: '320px',
    },
  },
];

test('基础样式转换', () => {
  expect(lib.convertPanel({ panel, padding: 16 })).toMatchObject([
    { width: 600, height: 320, x1: 15, y1: 15 },
    { width: 600, height: 320, x1: 650, y1: 15 },
    { width: 600, height: 320, x1: 15, y1: 380 },
    { width: 600, height: 320, x1: 15, y1: 732 },
  ]);
  expect(lib.parseStyle('223.11px')).toBe(223);
  expect(lib.parseStyle('223.11px', 'px')).toBe(223);
  expect(lib.parseStyle('223.11mm', 'mm')).toBe(223);
});
