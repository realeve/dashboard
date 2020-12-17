import React, { useEffect, useRef, useMemo, useState } from 'react';
import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import styles from './index.less';
import { init } from './lib';
export { mock } from './mock';
import { isArray } from '@antv/util';
import * as R from 'ramda';
import { connect } from 'dva';
import MoveableCanvas from '@/component/MoveableCanvas';
import { ICommon } from '@/models/common';
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
    title: '缩放画布',
    key: 'zoomable',
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
    title: '冠字顺号模式',
    subTitle: '冠字后面未印刷的产品标灰，有跳号的标红',
    key: 'gzMode',
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
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

let colorArr = ['#ddd', '#2f3', '#ff7373'];

export const handleData = ({
  x: _x = 0,
  y: _y = 1,
  legend: _legend = 2,
  data: { data, header },
  gzMode,
}) => {
  let dataType = isArray(data[0]);
  let x = dataType ? _x : header[_x],
    y = dataType ? _y : header[_y],
    legend = dataType ? _legend : header[_legend];
  let res = R.clone(data);

  // 从此id开始产品未印刷，小于它的视为跳号
  let idx = res.length;
  if (gzMode) {
    let id = R.reverse(data).findIndex(R.propEq(y, 1));
    idx = idx - id;
  }
  return res.map((item, i) => {
    let color = colorArr[item[y]] || '#23d';
    if (gzMode) {
      // 前面未印刷的产品，显示红色
      if (i < idx && item[y] == 0) {
        color = colorArr[2];
      }
    }
    return {
      ...item,
      backgroundColor: color,
      title: (item[legend] ? `(${item[legend]}) ` : '') + item[x],
      legend: item[legend],
    };
  });
};

const WaffleChart = ({
  option: {
    data: _data,
    x,
    y,
    legend,
    direction,
    padding,
    wrap,
    alignContent,
    boxSize,
    boxMargin,
    boxBorderRadius,
    gzMode,
    zoomable,
  },
  curTool,
}) => {
  // 在移动时，data将重新计算，此处可使用useMemo
  let data = useMemo(() => {
    return handleData({ x, y, legend, data: _data, gzMode });
  }, [x, y, legend, _data.hash, gzMode]);

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
    width: 500,
    height: 500,
  };

  const ref = useRef(null);

  useEffect(() => {
    ref.current &&
      init({
        selector: ref.current.children,
        duration: 0.2,
        eachtime: 0.01,
        axis: 'x',
      });
  }, []);

  const [zoom, setZoom] = useState(1);

  return (
    <MoveableCanvas moveable={curTool !== 'moveTool'} zoomable={zoomable} onZoom={setZoom}>
      <div className={styles.container} style={style} ref={ref}>
        {data.map((item) => (
          <div
            className={styles.box}
            style={{
              width: boxSize,
              height: boxSize,
              margin: boxMargin,
              borderRadius: boxBorderRadius,
              backgroundColor: item.backgroundColor,
            }}
            title={item.title}
            key={item.title}
          >
            {zoom > 2 && (
              <div
                style={{
                  color: '#333',
                  fontSize: 4,
                  lineHeight: '7px',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {item.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </MoveableCanvas>
  );
};

export default connect(({ common: { curTool } }: { common: ICommon }) => ({ curTool }))(
  WaffleChart,
);
