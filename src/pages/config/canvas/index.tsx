import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import MoveableItem from './MoveableItem';

export default ({ canvasSize, zoom, guides }) => {
  return (
    <div
      className={styles['canvas-panel']}
      style={{ ...canvasSize, transform: `scale(${zoom}) translate(0px, 0px)` }}
    >
      <MoveableItem zoom={zoom} guides={guides} canvasSize={canvasSize}>
        001
      </MoveableItem>
      <MoveableItem zoom={zoom} guides={guides} canvasSize={canvasSize}>
        002
      </MoveableItem>
    </div>
  );
};
