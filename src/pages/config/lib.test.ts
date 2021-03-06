import * as lib from './lib';

// umi test ./src/pages/config/lib.test.ts
const panel: lib.TPanelStyle[] = [
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
  expect(lib.parseStyle('223.11px')).toBe(223);
  expect(lib.parseStyle('223.11px', 'px')).toBe(223);
  expect(lib.parseStyle('223.11mm', 'mm')).toBe(223);

  expect(lib.calcTranslate({ translate: '1.1px,2.1px', left: 3, top: 4 })).toMatchObject({
    left: 4,
    top: 6,
  });

  expect(lib.calcTranslate({ left: 3, top: 4 })).toMatchObject({
    left: 3,
    top: 4,
  });

  const panelStyle = [
    { x1: 15, y1: 15 },
    { x1: 650, y1: 15 },
    { x1: 15, y1: 380 },
    { x1: 15, y1: 732 },
  ];
  expect(lib.convertPanel({ panel, padding: 16 })).toMatchObject(panelStyle);

  expect(lib.convertPanel({ panel })).toMatchObject(panelStyle);
});

const page = { width: 300, height: 300 };
test('越界判定', () => {
  expect(
    lib.isXAllowed(
      {
        x1: 0,
        y1: 0,
        x2: 210,
        y2: 210,
        width: 100,
        height: 100,
      },
      page,
      {
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      },
    ),
  ).toBeFalsy();

  expect(
    lib.isYAllowed(
      {
        x1: 0,
        y1: 210,
        x2: 210,
        y2: 310,
        width: 100,
        height: 100,
      },
      page,
      {
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      },
    ),
  ).toBeFalsy();

  expect(
    lib.isXAllowed(
      {
        x1: 0,
        y1: 0,
        x2: 190,
        y2: 190,
        width: 100,
        height: 100,
      },
      page,
      {
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      },
    ),
  ).toBeTruthy();

  expect(
    lib.isYAllowed(
      {
        x1: 0,
        y1: 0,
        x2: 190,
        y2: 190,
        width: 100,
        height: 100,
      },
      page,
      {
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      },
    ),
  ).toBeTruthy();
});

test('判断矩形相交', () => {
  /*
  模式1，两个矩形在X或轴相交
     ┏━━━━━━┓
  ┏━━╋━━━┓  ┃
  ┃  ┃   ┃  ┃
  ┗━━╋━━━┛  ┃
     ┗━━━━━━┛
*/
  expect(
    lib.isRectCross({ x1: 0, y1: 0, x2: 100, y2: 100 }, { x1: 10, y1: 0, x2: 110, y2: 100 }),
  ).toBeTruthy();

  /*
  模式2，两个矩形左上角的点相交
  ┏━━━━━━┓
  ┃  ┏━━━╋━━━┓
  ┗━━╋━━━┛   ┃
     ┗━━━━━━━┛
*/
  expect(
    lib.isRectCross({ x1: 0, y1: 0, x2: 100, y2: 100 }, { x1: 10, y1: 10, x2: 110, y2: 110 }),
  ).toBeTruthy();

  /*
  模式3，两个矩形相互包含
  ┏━━━━━━━━━━┓ 
  ┃  ┏━━━━┓  ┃ 
  ┃  ┃    ┃  ┃ 
  ┃  ┗━━━━┛  ┃ 
  ┗━━━━━━━━━━┛ 
*/
  expect(
    lib.isRectCross({ x1: 0, y1: 0, x2: 100, y2: 100 }, { x1: 10, y1: 10, x2: 90, y2: 90 }),
  ).toBeTruthy();

  /*
  模式4，两个矩形相离（不相交）
  ┏━━━━━━━━━━┓ 
  ┃          ┃     ┏━━━━┓ 
  ┃          ┃     ┃    ┃ 
  ┃          ┃     ┗━━━━┛ 
  ┗━━━━━━━━━━┛ 
*/
  expect(
    lib.isRectCross({ x1: 0, y1: 0, x2: 10, y2: 10 }, { x1: 15, y1: 15, x2: 30, y2: 30 }),
  ).toBeFalsy();
});

test('判断新的组件是否允许设置到指定的位置', () => {
  expect(
    lib.shouldRectPosIn(
      {
        x1: 110,
        y1: 10,
        x2: 210,
        y2: 110,
      },
      [
        {
          x1: 10,
          y1: 10,
          x2: 90,
          y2: 90,
          width: 80,
          height: 80,
        },
        {
          x1: 210,
          y1: 10,
          x2: 290,
          y2: 90,
          width: 80,
          height: 80,
        },
      ],
    ),
  ).toBeTruthy();

  expect(
    lib.shouldRectPosIn(
      {
        x1: 110,
        y1: 10,
        x2: 210,
        y2: 110,
      },
      [
        {
          x1: 10,
          y1: 10,
          x2: 90,
          y2: 90,
          width: 80,
          height: 80,
        },
        {
          x1: 110,
          y1: 10,
          x2: 190,
          y2: 90,
          width: 80,
          height: 80,
        },
      ],
    ),
  ).toBeFalsy();
});

test('寻找最佳放置的位置', () => {
  const res = { top: 15, left: 1275 };
  expect(lib.calcPanelPosition({ panel })).toMatchObject(res);
  expect(
    lib.calcPanelPosition({ panel, page: { width: 1920, height: 1080 }, padding: 25 }),
  ).toMatchObject(res);

  expect(
    lib.calcPanelPosition({
      panel: [
        {
          style: {
            transform: { translate: '0,0' },
            top: '10px',
            left: '1300px',
            width: '600px',
            height: '320px',
          },
        },
      ],
    }),
  ).toMatchObject({ left: 12, top: 12 });
});
