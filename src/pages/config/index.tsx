import React, { useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import HeaderComponent from './header';
import ComponentPanel from './componentPanel';
export default () => {
  return (
    <div className={styles.edit}>
      <HeaderComponent />
      <div className={styles.main}>
        <div className={styles['layer-panel-wp']}>图层</div>
        <ComponentPanel />

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
                <span
                  className={styles['select-span']}
                  style={{ transform: 'scale(0.7) translate(0px, 0px)' }}
                ></span>
              </div>
            </div>
          </div>
          <div className={styles['edit-slider']}></div>
        </div>
        <div className={styles['config-panel-wp']}>工具栏右侧</div>
      </div>
    </div>
  );
};
