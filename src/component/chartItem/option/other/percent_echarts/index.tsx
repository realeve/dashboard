import React, { useEffect, Suspense } from 'react';
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import styles from './index.less';
import Circle from './circle';
import Percent from './percent';

import { useMeasure, useSetState } from 'react-use';

const CountUp = React.lazy(() => import('react-countup'));

export const mock: IChartMock = {
  data: [[85.7]],
  title: 'MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    type: 'divider',
    title: '圆环转动速度（单位:秒/每圈）',
  },
  {
    key: 'speed',
    defaultValue: 40,
    title: '转动速度',
    step: 1,
    type: 'range',
    min: 1,
    max: 100,
  },
  {
    key: 'st1',
    defaultValue: '#69bffe',
    title: '一环',
    type: 'purecolor',
  },
  {
    key: 'st2',
    defaultValue: '#f37b1d',
    title: '二环',
    type: 'purecolor',
  },
  {
    key: 'lineWidth',
    defaultValue: 10,
    title: '圆环宽度',
    type: 'range',
    min: 2,
    max: 30,
    step: 1,
  },
  {
    type: 'divider',
    title: '文字样式(需刷新页面生效)',
  },
  {
    key: 'fontSize',
    defaultValue: 20,
    title: '字号',
    step: 1,
    type: 'range',
    min: 12,
    max: 100,
  },
  {
    key: 'fontWeight',
    defaultValue: 'normal',
    title: '加粗',
    type: 'radio',
    option: [
      {
        title: <div style={{ fontWeight: 'lighter', fontSize: 20 }}>Aa</div>,
        value: 'lighter',
      },
      {
        title: <div style={{ fontWeight: 'normal', fontSize: 20 }}>Aa</div>,
        value: 'normal',
      },
      {
        title: <div style={{ fontWeight: 'bold', fontSize: 20 }}>Aa</div>,
        value: 'bold',
      },
      {
        title: <div style={{ fontWeight: 'bolder', fontSize: 20 }}>Aa</div>,
        value: 'bolder',
      },
    ],
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/25_percent_echarts.json',
  interval: 5,
  cache: 2,
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
    data: { data, header },
    x = 0,
    lineWidth = 10,
    fontSize = 25,
    fontWeight = 'normal',
    st1 = '#69bffe',
    st2 = '#f37b1d',
    speed = 40,
  },
}) => {
  const [domRef, { width }] = useMeasure();
  let [val, setVal] = useSetState({
    start: 0,
    end: data[0][x],
    name: header[x],
  });
  useEffect(() => {
    setVal({
      start: val.end,
      end: data[0][x],
    });
  }, [data]);

  return (
    <div className={styles.pie_charts}>
      <div className={styles.border}>
        <Circle fill={st1} speed={speed} />
      </div>
      <div className={styles.border} ref={domRef}>
        <Percent fill={st2} lineWidth={lineWidth} size={width} value={val.end} />
        <div className={styles.tip}>
          <div className={styles.name} style={{ color: st2, fontSize: fontSize * 0.7 }}>
            {header[x]}
          </div>
          <Suspense fallback={null}>
            <CountUp
              {...val}
              decimals={2}
              suffix="%"
              style={{ color: st2, fontSize, fontWeight }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
