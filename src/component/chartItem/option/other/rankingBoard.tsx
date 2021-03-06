import ScrollRankingBoard from '@/component/widget/ScrollRankingBoard';
import type { IChartMock, IApiConfig } from '@/component/chartItem/interface';
import * as lib from '../lib';
import { array2Json } from '@/utils/lib';

export const mock: IChartMock = {
  header: ['name', 'value'],
  data: [
    {
      name: '周口',
      value: 55,
    },
    {
      name: '南阳',
      value: 120,
    },
    {
      name: '西峡',
      value: 78,
    },
    {
      name: '驻马店',
      value: 66,
    },
    {
      name: '新乡',
      value: 80,
    },
    {
      name: '信阳',
      value: 45,
    },
    {
      name: '漯河',
      value: 29,
    },
    {
      name: '漯河2',
      value: 129,
    },
    {
      name: '漯河3',
      value: 59,
    },
    {
      name: '漯河4',
      value: 19,
    },
  ],
  title: '滚动表单_mock数据',
  rows: 10,
  hash: 'mockdata',
};

export const config = [
  {
    key: 'waitTime',
    defaultValue: 4,
    title: '翻页间隔(秒)',
    step: 1,
    type: 'range',
    min: 0,
    max: 60,
  },
  {
    key: 'carousel',
    defaultValue: 'page',
    title: '滚动模式',
    type: 'radio',
    option: [
      {
        title: '整页',
        value: 'page',
      },
      {
        title: '单条数据',
        value: 'single',
      },
    ],
  },
  {
    key: 'rowNum',
    defaultValue: 5,
    title: '每页数据',
    type: 'radio',
    option: [
      {
        title: '5条',
        value: 5,
      },
      {
        title: '10条',
        value: 10,
      },
      {
        title: '15条',
        value: 15,
      },
      {
        title: '20条',
        value: 20,
      },
    ],
  },
  {
    key: 'unit',
    defaultValue: '',
    placeholder: '输入数值后显示的单位',
    title: '数值单位',
    valueType: 'text',
    type: 'input',
  },
  ...lib.getFontConfig(),
  {
    key: 'padding',
    defaultValue: 6,
    title: '组件边距',
    step: 1,
    type: 'range',
    min: 0,
    max: 40,
  },
  {
    key: 'barHeight',
    defaultValue: 16,
    title: '柱高度',
    step: 1,
    type: 'range',
    min: 1,
    max: 60,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/08_scroll_board.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

export default ({
  option: { data: _data, waitTime = 4, carousel = 'page', x: _x = 0, y: _y = 1, ...props },
}) => {
  const data = array2Json(_data);
  const x = data.header[_x];
  const y = data.header[_y];

  return (
    <ScrollRankingBoard
      config={{
        ...data,
        data: data.data.filter((item) => item[y] > 0),
        index: true,
        columnWidth: [50],
        align: ['center'],
        carousel,
        waitTime: waitTime * 1000,
        ...props,
        x,
        y,
      }}
    />
  );
};
