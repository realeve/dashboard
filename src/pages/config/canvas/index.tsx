import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';

export default ({ canvasSize, zoom }) => {
  return (
    <div
      className={styles['canvas-panel']}
      style={{ ...canvasSize, transform: `scale(${zoom}) translate(0px, 0px)` }}
    />
  );
};
