import { ScrollBoard } from '@/component/widget';

import { IChartMock, IApiConfig } from '@/component/chartItem/interface';
import * as lib from '../lib';

export let mock: IChartMock = {
  header: ['列1', '列2', '列3'],
  data: [
    ['23', '行1列2', '行1列3'],
    ['43', '行2列2', '行2列3'],
    ['133', '行3列2', '行3列3'],
    ['54', '行4列2', '行4列3'],
    ['32', '行5列2', '行5列3'],
    ['56', '行6列2', '行6列3'],
    ['76', '行7列2', '行7列3'],
    ['543', '行8列2', '行8列3'],
    ['332', '行9列2', '行9列3'],
    ['1121', '行10列2', '行10列3'],
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
        title: '20条',
        value: 20,
      },
    ],
  },
  {
    key: 'index',
    defaultValue: true,
    title: '显示索引列',
    type: 'switch',
  },
  ...lib.getFontConfig(),

  {
    type: 'divider',
    title: '表头样式',
  },
  {
    key: 'headerBGC',
    defaultValue: '#0d5dff',
    title: '颜色',
    type: 'purecolor',
  },
  {
    key: 'headerHeight',
    defaultValue: 35,
    title: '高度',
    step: 5,
    type: 'range',
    min: 20,
    max: 80,
  }, 
  {
    type: 'divider',
    title: '行颜色',
  },
  {
    key: 'oddRowBGC',
    defaultValue: 'rgba(255,255,255,0.1)',
    title: '偶数行',
    type: 'purecolor',
  },
  {
    key: 'evenRowBGC',
    defaultValue: 'transparent',
    title: '奇数行',
    type: 'purecolor',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/08_scroll_board.json',
  interval: 5,
  config: [],
};

export default ({ option: { data, waitTime = 4, carousel = 'page', ...config } }) => {
  return (
    <ScrollBoard
      config={{
        ...data,
        index: true,
        columnWidth: [50],
        align: ['center'],
        carousel,
        waitTime: waitTime * 1000,
        ...config,
      }}
    />
  );
};
