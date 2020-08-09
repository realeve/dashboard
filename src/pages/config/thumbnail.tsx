import React, { useEffect, useState } from 'react';
import styles from './thumbnail.less';
import classnames from 'classnames';
import { rangeCfg } from './EditSlider';
export default ({ zoom, dragPercent }: { zoom: number; dragPercent: { x: number; y: number } }) => {
  const thumbnailSize = { width: 191, height: 112 };
  // 缩放比
  const scale = rangeCfg.min / zoom; 
  return (
    <div className={classnames(styles.thumbnail, styles['thumbnail-show'])}>
      <div className={styles['datav-thumbnail']}>
        <span
          className={styles['select-span']}
          style={{
            transform: `scale(${scale}) `,
            left: Math.max(0, dragPercent.x) + '%',
            top: (Math.max(0, dragPercent.y) * thumbnailSize.height) / 100,
          }}
        />
      </div>
    </div>
  );
};
