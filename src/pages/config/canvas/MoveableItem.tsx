import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Moveable, { OnDrag, OnResize, OnScale } from 'react-moveable';
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
  [key: string]: any;
}

export default ({
  guides,
  zoom = 1,
  canvasSize,
  children,
  className,
  style = { width: 192, height: 108 },
  ...props
}: IMoveableItem) => {
  const dom = useRef(null);
  const [rotate, setRotate] = useState(0);
  return (
    <div className={styles.moveableItem}>
      <div ref={dom} className={classnames(styles.wrap, className)} style={style}>
        {children}
      </div>
      <Moveable
        snappable={true}
        bounds={{ left: 0, top: 0, right: canvasSize.width, bottom: canvasSize.height }}
        target={dom?.current}
        draggable={true}
        throttleDrag={0}
        zoom={zoom}
        verticalGuidelines={guides.v.map(item => item - padding / zoom)}
        horizontalGuidelines={guides.h.map(item => item - padding / zoom)}
        onDrag={({ target, left, top, transform }: OnDrag) => {
          target.style.transform = transform;
          console.log(left, top, transform, '存储位置信息');
        }}
        renderDirections={['s', 'se', 'e']}
        resizable={true}
        throttleResize={0}
        onResize={({ target, width, height, delta }: OnResize) => {
          delta[0] && (target!.style.width = `${width}px`);
          delta[1] && (target!.style.height = `${height}px`);
        }}
        /* scalable */
        /* Only one of resizable, scalable, warpable can be used. */
        // scalable={true}
        // throttleScale={0}
        // onScale={({ target, scale, dist, delta, transform, clientX, clientY }: OnScale) => {
        //   target!.style.transform = transform;
        // }}
        // keepRatio={true}
        rotatable={true}
        throttleRotate={0}
        onRotate={({ target, delta }) => {
          let nextRotate = rotate + delta;
          setRotate(nextRotate);
          target.style.transform =
            target.style.transform.split('rotate')[0] + ' rotate(' + nextRotate + 'deg)';
        }}
      />
    </div>
  );
};
