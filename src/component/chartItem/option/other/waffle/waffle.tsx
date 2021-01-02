import React, { useEffect, useRef, useMemo, useState } from 'react';
import type { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import styles from './index.less';
import { init } from './lib';
import { connect } from 'react-redux';
import MoveableCanvas from '@/component/MoveableCanvas';
import type { ICommon } from '@/models/common';
import { Tooltip } from 'antd';
import { useInterval } from 'react-use';
import { SEARCH_PREFIX } from '@/utils/setting';
import classnames from 'classnames';
import { handleData } from './util';

export { mock } from './mock';
// title:冠字华夫图

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
    title: '移动画布',
    key: 'moveable',
    type: 'switch',
    defaultValue: false,
  },
  {
    title: '循环显示异常车号',
    key: 'intervalTooltip',
    type: 'switch',
    defaultValue: true,
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
    defaultValue: 16,
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
    defaultValue: 8,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/45_waffle.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'x',
      title: '冠字',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: '生产状态',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'legend',
      title: '产品品种',
      defaultValue: 2,
      min: 0,
    },
    {
      key: 'cart',
      title: '车号',
      defaultValue: 3,
      min: 0,
    },
  ],
};

// {zoom > 2 && (
//   <div
//     style={{
//       color: '#333',
//       fontSize: 4,
//       lineHeight: '7px',
//       width: '100%',
//       height: '100%',
//       display: 'flex',
//       alignItems: 'center',
//       textAlign: 'center',
//     }}
//   >
//     {item.title}
//   </div>
// )}

const WaffleChart = ({
  option: {
    data: _data,
    x,
    y,
    legend,
    cart,
    direction,
    padding,
    wrap,
    alignContent,
    boxSize,
    boxMargin,
    boxBorderRadius,
    gzMode,
    zoomable,
    intervalTooltip,
    moveable,
  },
  curTool,
  style,
}) => {
  // 在移动时，data将重新计算，此处可使用useMemo
  /* eslint-disable */
  const { data, warnNum } = useMemo(() => handleData({ x, y, legend, cart, data: _data, gzMode }), [
    x,
    y,
    legend,
    cart,
    _data.hash,
    gzMode,
  ]);
  /* eslint-disable */

  const containerStyle: React.CSSProperties =
    direction === 'vertical'
      ? {
          flexDirection: 'row',
        }
      : {
          flexDirection: 'column',
          height: '100%',
        };
  const _style: React.CSSProperties = {
    ...containerStyle,
    padding,
    flexWrap: wrap ? 'wrap' : 'wrap-reverse',
    alignContent: alignContent ? 'flex-start' : 'normal',
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

  const [visibleIdx, setVisibleIdx] = useState(0);
  const [curIdx, setCurIdx] = useState(-1);

  useInterval(
    () => {
      setVisibleIdx((visibleIdx + 1) % (warnNum + 1));
    },
    warnNum < 2 || !intervalTooltip ? 0 : 5000,
  );

  return (
    <MoveableCanvas style={style} moveable={moveable && curTool !== 'MoveTool'} zoomable={zoomable}>
      <div className={styles.container} style={_style} ref={ref}>
        {data.map((item, i) => {
          const Item = (
            <div
              className={classnames(styles.box, {
                [styles.active]: item._warn && visibleIdx === item._warnIdx,
              })}
              style={{
                width: boxSize,
                height: boxSize,
                margin: boxMargin,
                borderRadius: boxBorderRadius,
                backgroundColor: item.backgroundColor,
                boxShadow: item._warn ? `0px 0px 8px 3px #d23` : 'unset',
              }}
              key={item.title}
              onMouseEnter={() => {
                setCurIdx(i);
              }}
              title={item.title}
            />
          );
          return item._warn ? (
            <Tooltip
              align={{
                offset: [-11, 2],
              }}
              placement="topLeft"
              color="rgba(44,31,84,0.9)"
              title={
                <div style={{ lineHeight: '12px', padding: '10px 10px 0 10px' }}>
                  {item.cart && (
                    <p>
                      车号:{' '}
                      <a
                        href={SEARCH_PREFIX + item.cart}
                        target="_blank"
                        style={{ color: '#ddd' }}
                        rel="nofollow"
                      >
                        {item.cart}
                      </a>
                    </p>
                  )}
                  {item.title && <p>冠字: {item.title}</p>}
                  {item.legend && <p>品种: {item.legend}</p>}
                </div>
              }
              key={item.title}
              visible={visibleIdx === item._warnIdx || curIdx === i}
              overlayStyle={{ transform: `translate(0,-10px)` }}
            >
              {Item}
            </Tooltip>
          ) : (
            Item
          );
        })}
      </div>
    </MoveableCanvas>
  );
};

export default connect(({ common: { curTool } }: { common: ICommon }) => ({ curTool }))(
  WaffleChart,
);
