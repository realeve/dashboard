import React, { useMemo } from 'react';
import type { IScrollBoardProps } from '@/component/widget/ScrollBoard';
import ScrollBoard from '@/component/widget/ScrollBoard';
import * as lib from '../lib';
import type { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';

export const mock: IChartMock = {
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

export const config: IChartConfig[] = [
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
  {
    key: 'formatIndex',
    defaultValue: true,
    title: '格式化索引列',
    type: 'switch',
  },
  {
    key: 'beautyFont',
    defaultValue: false,
    title: '使用系统默认字体',
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
  url: '1197/54d0a53345.array?status=0', // 'http://localhost:8000/mock/08_scroll_board.json',
  interval: 5,
  cache: 2,
  config: [],
};

export type IScrollBoard = {
  data: IChartMock;
} & Omit<IScrollBoardProps, 'data' | 'header'>;
type IScrollTable = {
  option: IScrollBoard;
  onClick?: (e: any) => void;
  style: React.CSSProperties;
};
// TODO 讲述如何引进页面重新渲染
export default ({
  option: { data, waitTime = 4, ...config },
  onClick = () => {},
  style = {},
}: IScrollTable) =>
  useMemo(
    () => (
      <ScrollBoard
        config={{
          ...data,
          columnWidth: [50],
          align: ['center'],
          waitTime: waitTime * 1000,
          ...config,
        }}
        onClick={onClick}
        style={style}
      />
    ),
    [JSON.stringify(config), data?.hash],
  );

// 使用 PureComponent实现

// class ScrollTable extends React.PureComponent<IScrollTable> {
//   shouldComponentUpdate({ option: { data, ...nextConfig } }: IScrollTable) {
//     let dataChange = data.hash !== this.props.option.data.hash;
//     let { data: _data, ...prevConfig } = this.props.option;
//     let configChange = !R.equals(prevConfig, nextConfig);
//     return dataChange || configChange;
//   }

//   render() {
//     let { data, waitTime = 4, ...config } = this.props.option;
//     return (
//       <ScrollBoard
//         config={{
//           ...data,
//           columnWidth: [50],
//           align: ['center'],
//           waitTime: waitTime * 1000,
//           ...config,
//         }}
//         onClick={this.props.onClick}
//         style={this.props.style}
//       />
//     );
//   }
// }

// export default ScrollTable;
