import React, { useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
export default () => {
  return (
    <div className={styles.edit}>
      <div className={styles.header}>工具</div>
      <div className={styles.main}>
        <div className={styles['component-panel']}>组件面板</div>
        <div className={styles['right-edit-main']}>
          <div className={styles['toolbox-panel-wp']}>
            <div className={styles['toolbox-panel']}>工具</div>
          </div>
          <div className={styles['editor-panel-wp']}>
            <div className={styles.rulerh}></div>
            <div className={styles.rulerv}></div>
            <div className={styles.guide}></div>
            <div
              className={styles['canvas-panel']}
              style={{ transform: 'scale(0.7) translate(0px, 0px)' }}
            >
              内容
            </div>
            <div className={classnames(styles.thumbnail, styles['thumbnail-show'])}>
              <div className={styles['datav-thumbnail']}>
                <span className={styles['select-span']}></span>
              </div>
            </div>
          </div>
          <div className={styles['edit-slider']}></div>
        </div>
      </div>
    </div>
  );
};
