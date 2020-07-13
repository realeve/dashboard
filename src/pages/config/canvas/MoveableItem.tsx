import React, { useState, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Moveable, { OnDrag, OnResize } from 'react-moveable';

import { useDebounce, useSetState } from 'react-use';

const padding = 30;
export interface IMoveableItem {
  guides?: {
    v: number[];
    h: number[];
  };
  zoom?: number;
  canvasSize?: {
    width: number;
    height: number;
  };
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onResize?: (e: any) => void;
  [key: string]: any;
}

// 处理transform,浮点数
const handleTransform = (str: string) => {
  let matrix =
    str
      .match(/matrix(\S| )+/)[0]
      .match(/(\d|\,|\.|\-)+/)[0]
      .split(',') || [];
  matrix = matrix.map(item => Number(item).toFixed(1));

  // let arr = matrix.slice(-2);
  // let arr2 = str.match(/translate(\S| )+/)[0].match(/(\d|\.)+/g);
  // arr = arr.map((item, idx) => Number(item) + Number(arr2[idx]));
  // let distArr = [...matrix.slice(0, -2), ...arr];
  // return `matrix(${distArr.join(',')})`;

  let translate = str.split('translate')[1];
  return `matrix(${matrix.join(',')}) translate${translate}`;
};

const baseCfg = {
  resizable: true,
  rotatable: true,
  renderDirections: ['s', 'se', 'e'],
};
export default ({
  guides,
  zoom = 1,
  canvasSize,
  children,
  className,
  style = { width: 800, height: 500 },
  onResize = () => {},
}: IMoveableItem) => {
  const dom = useRef(null);
  const [rotate, setRotate] = useState(0);

  // 使用curStyle 暂存数据，无操作500ms以后向父组件触发。
  const [curStyle, setCurStyle] = useSetState({});
  useDebounce(
    () => {
      onResize(curStyle);
    },
    500,
    [JSON.stringify(curStyle)],
  );

  return (
    <div className={styles.moveableItem}>
      <div
        ref={dom}
        className={classnames(styles.wrap, className)}
        style={{
          width: (style?.width || 800) * zoom,
          height: (style?.height || 500) * zoom,
          transform: style.transform,
        }}
      >
        {children}
      </div>
      <Moveable
        bounds={{ left: 0, top: 0, right: canvasSize.width, bottom: canvasSize.height }}
        target={dom?.current}
        draggable={true}
        snappable={true}
        {...baseCfg}
        throttleDrag={0}
        zoom={zoom}
        verticalGuidelines={guides.v.map(item => item - padding / zoom)}
        horizontalGuidelines={guides.h.map(item => item - padding / zoom)}
        onDrag={({ target, left, top, transform, ...props }: OnDrag) => {
          target.style.transform = transform;
          // target!.style.left = `${left}px`;
          // target!.style.top = `${top}px`;
          setCurStyle({
            transform: handleTransform(transform),
          });
        }}
        throttleResize={0}
        onResize={({ target, width, height, delta }: OnResize) => {
          delta[0] && (target!.style.width = `${width}px`);
          delta[1] && (target!.style.height = `${height}px`);

          setCurStyle({
            width: (width / zoom).toFixed(0),
            height: (height / zoom).toFixed(0),
          });
        }}
        // keepRatio={true}
        throttleRotate={0}
        onRotate={({ target, delta }) => {
          let nextRotate = rotate + delta;
          setRotate(nextRotate);
          let transform =
            target.style.transform.split('rotate')[0] + ' rotate(' + nextRotate + 'deg)';
          target.style.transform = transform;

          setCurStyle({
            transform: handleTransform(transform),
            rotate: nextRotate,
          });
        }}
      />
    </div>
  );
};
