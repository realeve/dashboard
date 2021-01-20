import * as lib from './sunburst';

test('旭日图数据处理', () => {
  expect(lib.seq(1, 12, 4)).toMatchInlineSnapshot(`
    Array [
      1,
      4.666666666666666,
      8.333333333333332,
      11.999999999999998,
    ]
  `);
  expect(() => {
    lib.seq(1, 2, 1);
  }).toThrowError('数据项不能小于2');

  expect(() => {
    lib.seq(2, 2, 2);
  }).toThrowError('起始设置不能相同');

  expect(
    lib.getColSum(
      [
        [2, 2],
        [5, 6],
      ],
      0,
    ),
  ).toBe(7);
});

test('处理旭日图数据项', () => {
  expect(
    lib.handleSunBrustData(
      [
        {
          品种: '0011A',
          工序: '胶印',
          数值: 1,
        },
        {
          品种: '0011A',
          工序: '凹印',
          数值: 2,
        },
        {
          品种: '0012A',
          工序: '凹印',
          数值: 4,
        },
      ],
      ['品种', '工序', '数值'],
      {
        borderWidth: 4,
        borderColor: '#f00',
        borderRadiusInner: 10,
        borderRadiusOutter: 0,
        legend: 0,
        valkey: '数值',
      },
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "children": Array [
          Object {
            "itemStyle": Object {
              "borderColor": "#f00",
              "borderRadius": Array [
                10,
                0,
              ],
              "borderWidth": 4,
            },
            "name": "胶印",
            "value": 1,
          },
          Object {
            "itemStyle": Object {
              "borderColor": "#f00",
              "borderRadius": Array [
                10,
                0,
              ],
              "borderWidth": 4,
            },
            "name": "凹印",
            "value": 2,
          },
        ],
        "itemStyle": Object {
          "borderColor": "#f00",
          "borderRadius": Array [
            10,
            0,
          ],
          "borderWidth": 4,
        },
        "name": "0011A",
        "value": 3,
      },
      Object {
        "children": Array [
          Object {
            "itemStyle": Object {
              "borderColor": "#f00",
              "borderRadius": Array [
                10,
                0,
              ],
              "borderWidth": 4,
            },
            "name": "凹印",
            "value": 4,
          },
        ],
        "itemStyle": Object {
          "borderColor": "#f00",
          "borderRadius": Array [
            10,
            0,
          ],
          "borderWidth": 4,
        },
        "name": "0012A",
        "value": 4,
      },
    ]
  `);

  const res = lib.handleSunBrustData(
    [
      {
        品种: '0011A',
        工序: '胶印',
        数值: 1,
      },
      {
        品种: '0011A',
        工序: '凹印',
        数值: 2,
      },
      {
        品种: '0012A',
        工序: '凹印',
        数值: 4,
      },
    ],
    ['品种', '工序', '数值'],
    {
      borderWidth: 4,
      borderColor: '#f00',
      borderRadiusInner: 10,
      borderRadiusOutter: 0,
      legend: 1,
      valkey: '数值',
    },
  );
  expect(res).toMatchInlineSnapshot(`
    Array [
      Object {
        "children": Array [
          Object {
            "itemStyle": Object {
              "borderColor": "#f00",
              "borderRadius": Array [
                10,
                0,
              ],
              "borderWidth": 4,
            },
            "name": "0011A",
            "value": 1,
          },
        ],
        "itemStyle": Object {
          "borderColor": "#f00",
          "borderRadius": Array [
            10,
            0,
          ],
          "borderWidth": 4,
        },
        "name": "胶印",
        "value": 1,
      },
      Object {
        "children": Array [
          Object {
            "itemStyle": Object {
              "borderColor": "#f00",
              "borderRadius": Array [
                10,
                0,
              ],
              "borderWidth": 4,
            },
            "name": "0011A",
            "value": 2,
          },
          Object {
            "itemStyle": Object {
              "borderColor": "#f00",
              "borderRadius": Array [
                10,
                0,
              ],
              "borderWidth": 4,
            },
            "name": "0012A",
            "value": 4,
          },
        ],
        "itemStyle": Object {
          "borderColor": "#f00",
          "borderRadius": Array [
            10,
            0,
          ],
          "borderWidth": 4,
        },
        "name": "凹印",
        "value": 6,
      },
    ]
  `);
});

test('getLevels', () => {
  expect(lib.getLevels(2, 15, true)).toMatchInlineSnapshot(`
    Array [
      Object {},
      Object {
        "itemStyle": Object {
          "borderWidth": 2,
        },
        "label": Object {
          "rotate": "tangential",
        },
        "r": "80%",
        "r0": "15%",
      },
      Object {
        "itemStyle": Object {
          "borderWidth": 3,
        },
        "label": Object {
          "padding": 3,
          "position": "outside",
          "silent": false,
        },
        "r": "83%",
        "r0": "80%",
      },
    ]
  `);
  expect(lib.getLevels(1, 15, true)).toBeNull();
  expect(lib.getLevels(2, 50, false)).toMatchInlineSnapshot(`
    Array [
      Object {},
      Object {
        "itemStyle": Object {
          "borderWidth": 2,
        },
        "label": Object {
          "rotate": "tangential",
        },
        "r": "65%",
        "r0": "50%",
      },
      Object {
        "itemStyle": Object {
          "borderWidth": 2,
        },
        "label": Object {
          "align": "right",
        },
        "r": "80%",
        "r0": "65%",
      },
    ]
  `);
});

test('旭日图数据处理', () => {
  expect(
    lib.default({
      data: {
        data: [
          {
            品种: '0011A',
            工序: '胶印',
            数值: 1,
          },
          {
            品种: '0011A',
            工序: '凹印',
            数值: 2,
          },
          {
            品种: '0012A',
            工序: '凹印',
            数值: 4,
          },
        ],
        header: ['品种', '工序', '数值'],
      },
      legend: 0,
      y: 2,
      borderRadiusInner: 10,
      borderRadiusOutter: 20,
      innerRadius: 12,
      border: true,
      needRerverse: false,
      theme: 14,
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "color": Array [
        "#fdedbe",
        "#ffdf80",
        "#ffcb33",
        "#ffb200",
        "#ff8c00",
        "#ff6500",
        "#e6450f",
        "#b22c00",
        "#661900",
      ],
      "legend": Object {
        "show": false,
      },
      "series": Object {
        "data": Array [
          Object {
            "children": Array [
              Object {
                "itemStyle": Object {
                  "borderColor": "#080226",
                  "borderRadius": Array [
                    10,
                    20,
                  ],
                  "borderWidth": 1,
                },
                "name": "胶印",
                "value": 1,
              },
              Object {
                "itemStyle": Object {
                  "borderColor": "#080226",
                  "borderRadius": Array [
                    10,
                    20,
                  ],
                  "borderWidth": 1,
                },
                "name": "凹印",
                "value": 2,
              },
            ],
            "itemStyle": Object {
              "borderColor": "#080226",
              "borderRadius": Array [
                10,
                20,
              ],
              "borderWidth": 1,
            },
            "name": "0011A",
            "value": 3,
          },
          Object {
            "children": Array [
              Object {
                "itemStyle": Object {
                  "borderColor": "#080226",
                  "borderRadius": Array [
                    10,
                    20,
                  ],
                  "borderWidth": 1,
                },
                "name": "凹印",
                "value": 4,
              },
            ],
            "itemStyle": Object {
              "borderColor": "#080226",
              "borderRadius": Array [
                10,
                20,
              ],
              "borderWidth": 1,
            },
            "name": "0012A",
            "value": 4,
          },
        ],
        "label": Object {
          "fontSize": undefined,
          "formatter": [Function],
        },
        "levels": Array [
          Object {},
          Object {
            "itemStyle": Object {
              "borderWidth": 2,
            },
            "label": Object {
              "rotate": "tangential",
            },
            "r": "80%",
            "r0": "12%",
          },
          Object {
            "itemStyle": Object {
              "borderWidth": 3,
            },
            "label": Object {
              "padding": 3,
              "position": "outside",
              "silent": false,
            },
            "r": "83%",
            "r0": "80%",
          },
        ],
        "type": "sunburst",
      },
      "tooltip": Object {
        "trigger": "item",
      },
    }
  `);
});
