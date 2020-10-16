import React, { useState, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Moveable, { OnDrag, OnResize } from 'react-moveable';

import KeyController from 'keycon';
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
  resizable?: boolean;
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

export default ({
  guides,
  zoom = 1,
  canvasSize,
  children,
  className,
  style = { width: 800, height: 500 },
  onResize = () => {},
  resizable: parentResizable = false,
  onResizable = () => {},
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

  const [frame, setFrame] = React.useState({
    translate: [0, 0],
    rotate: 0,
    transformOrigin: '50% 50%',
  });

  const [resizable, setResizable] = React.useState(false);
  React.useEffect(() => {
    if (!parentResizable) setResizable(parentResizable);
  }, [parentResizable]);

  // moveable

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
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          if (!resizable) {
            setResizable(true);
            onResizable();
          }
        }}
      >
        {children}
      </div>
      <Moveable
        bounds={{ left: 0, top: 0, right: canvasSize.width, bottom: canvasSize.height }}
        target={dom?.current}
        resizable={resizable}
        rotatable={resizable}
        draggable={resizable}
        origin={resizable}
        snappable={resizable}
        throttleDrag={0}
        throttleRotate={15}
        zoom={zoom}
        verticalGuidelines={guides.v.map(item => item - padding / zoom)}
        horizontalGuidelines={guides.h.map(item => item - padding / zoom)}
        isDisplaySnapDigit={true}
        onDragStart={({ set }) => {
          set(frame.translate);
        }}
        onDrag={({ target, beforeTranslate }) => {
          frame.translate = beforeTranslate;
        }}
        onRotateStart={({ set }) => {
          set(frame.rotate);
        }}
        onRotate={({ beforeRotate }) => {
          frame.rotate = beforeRotate;
        }}
        onRender={({ target }) => {
          const { translate, rotate } = frame;
          target.style.transform =
            `translate(${translate[0]}px, ${translate[1]}px)` + ` rotate(${rotate}deg)`;
        }}
        onResizeStart={({ dragStart }) => {
          dragStart && dragStart.set(frame.translate);
        }}
        onResize={({ target, width, height, drag }) => {
          const beforeTranslate = drag.beforeTranslate;

          frame.translate = beforeTranslate;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
      />
    </div>
  );
};
