import React, { useEffect, useState } from 'react';
import styles from './index.less';
import MoveableItem from './MoveableItem';
import * as R from 'ramda';

export default ({ canvasSize, zoom, guides }) => {
  const [canvasItem, setCanvasItem] = useState([]);
  useEffect(() => {
    let obj = JSON.parse(
      window.localStorage.getItem('canvas') || '[{"style":{"width":640,"height":400,"rotate":0}}]',
    );
    setCanvasItem(obj);
  }, []);

  const onResize = (idx: number) => e => {
    let prevItem = R.clone(canvasItem);
    let prevStyle = prevItem[idx].style;

    let width = e.width || prevStyle.width;
    let height = e.height || prevStyle.height;
    let rotate = e.rotate || prevStyle.rotate;

    prevItem[idx] = {
      ...prevItem[idx],
      style: {
        ...prevStyle,
        width,
        height,
        rotate,
        transform: e.transform,
      },
    };
    setCanvasItem(prevItem);
    window.localStorage.setItem('canvas', JSON.stringify(prevItem));
  };

  return (
    <div
      className={styles['canvas-panel']}
      style={{ ...canvasSize, transform: `scale(${zoom}) translate(0px, 0px)` }}
    >
      {canvasItem.map((item, idx) => (
        <MoveableItem
          zoom={zoom}
          guides={guides}
          canvasSize={canvasSize}
          style={item.style}
          onResize={onResize(idx)}
          key={idx}
        >
          001
        </MoveableItem>
      ))}
    </div>
  );
};
