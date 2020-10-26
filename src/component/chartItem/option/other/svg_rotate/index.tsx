import React from 'react';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';

import { textColor } from '@/component/chartItem/option';
import Background from './background';
import styles from './index.less';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'suffix',
    title: '单位',
    defaultValue: '%',
    valueType: 'text',
  },
  {
    type: 'divider',
    title: '文本设置',
  },
  {
    key: 'showTitle',
    title: '显示标题',
    type: 'switch',
    defaultValue: false,
  },
  {
    key: 'fontColor',
    defaultValue: '#fff',
    title: '文本颜色',
    type: 'purecolor',
  },
  {
    key: 'fontSize',
    defaultValue: 40,
    title: '字号',
    step: 1,
    type: 'range',
    min: 12,
    max: 100,
  },
  {
    type: 'divider',
    title: '圆环颜色',
  },
  {
    key: 'st2',
    defaultValue: '#f890ab',
    title: '一环',
    type: 'purecolor',
  },
  {
    key: 'st0',
    defaultValue: '#08ade5',
    title: '二环',
    type: 'purecolor',
  },
  {
    key: 'st1',
    defaultValue: '#80bfe8',
    title: '三环',
    type: 'purecolor',
  },
  {
    type: 'divider',
    title: '圆环转动速度（单位:秒/每圈）',
  },
  {
    key: 'speed2',
    defaultValue: 9,
    title: '一环',
    step: 1,
    type: 'range',
    min: 1,
    max: 100,
  },
  {
    key: 'speed0',
    defaultValue: 10,
    title: '二环',
    step: 1,
    type: 'range',
    min: 1,
    max: 100,
  },
  {
    key: 'speed1',
    defaultValue: 40,
    title: '三环',
    step: 1,
    type: 'range',
    min: 1,
    max: 100,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/24_svg_rotate.json',
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
    data: { data, title },
    x = 0,
    suffix = '%',
    fontColor = textColor,
    showTitle = false,
    fontSize = 40,
    ...imgOption
  },
}) => {
  let value = data[0][x];
  return (
    <div className={styles.widgetDecotation}>
      <div className={styles.borderImg}>
        <Background {...imgOption} />
      </div>
      <div style={{ textAlign: 'center', width: '100%' }}>
        {showTitle && (
          <>
            <span className={styles.title}>{title}</span>
            <br />
          </>
        )}
        <span style={{ color: fontColor, fontSize }}>
          {value}
          {suffix}
        </span>
      </div>
    </div>
  );
};
