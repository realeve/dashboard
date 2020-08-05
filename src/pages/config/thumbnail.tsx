import React, { useEffect, useState } from 'react';
import styles from './thumbnail.less';
import classnames from 'classnames';

export default ({ zoom }) => {
  return (
    <div className={classnames(styles.thumbnail, styles['thumbnail-show'])}>
      <div className={styles['datav-thumbnail']}>
        <span
          className={styles['select-span']}
          style={{ transform: `scale(${Math.min(1, zoom)}) translate(0px, 0px)` }}
        />
      </div>
    </div>
  );
};
