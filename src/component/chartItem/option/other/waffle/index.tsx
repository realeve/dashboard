import React from 'react';

import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';

import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';
import styles from './index.less';
import * as R from 'ramda';
import { init } from './lib';

import classnames from 'classnames';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'direction',
    title: '图表布局',
    type: 'radio',
    defaultValue: 'vertical',
    option: [
      {
        title: '纵向',
        value: 'vertical',
      },
      {
        title: '横向',
        value: 'horizontal',
      },
    ],
  },
  {
    title: '边距',
    key: 'padding',
    type: 'range',
    min: 0,
    step: 1,
    max: 20,
    defaultValue: 0,
  },
  {
    title: '顺序排列',
    key: 'wrap',
    type: 'switch',
    defaultValue: false,
  },
  {
    title: '紧凑布局',
    key: 'alignContent',
    type: 'switch',
    defaultValue: true,
  },
  {
    title: '单个格子设置',
    type: 'divider',
  },
  {
    title: '大小',
    key: 'boxSize',
    type: 'range',
    min: 10,
    step: 1,
    max: 40,
    defaultValue: 10,
  },
  {
    title: '间距',
    key: 'boxMargin',
    type: 'range',
    min: 1,
    step: 1,
    max: 10,
    defaultValue: 2,
  },
  {
    title: '圆角弧度',
    subTitle: '设为大小的一半时，表示圆形',
    key: 'boxBorderRadius',
    type: 'range',
    min: 0,
    step: 1,
    max: 20,
    defaultValue: 1,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/45_waffle.json',
  interval: 5,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
  ],
};

export default ({
  option: {
    data,
    x = 0,
    direction,
    padding,
    wrap,
    alignContent,
    boxSize,
    boxMargin,
    boxBorderRadius,
  },
}) => {
  let arr = R.range(0, 85);
  let containerStyle: React.CSSProperties =
    direction == 'vertical'
      ? {
          flexDirection: 'row',
        }
      : {
          flexDirection: 'column',
          height: '100%',
        };
  let style: React.CSSProperties = {
    ...containerStyle,
    padding,
    flexWrap: wrap ? 'wrap' : 'wrap-reverse',
    alignContent: alignContent ? 'flex-start' : 'normal',
  };
  return (
    <div className={styles.container} style={style}>
      {arr.map((item) => (
        <div
          className={classnames(styles.box, '_waffle_box')}
          style={{
            width: boxSize,
            height: boxSize,
            margin: boxMargin,
            borderRadius: boxBorderRadius,
          }}
          key={item}
        ></div>
      ))}
    </div>
  );
};
