import React, { useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import HeaderComponent from './header';
import ComponentPanel from './componentPanel';

import { useSetState } from 'react-use';

export default () => {
  const [hide, setHide] = useSetState({
    layer: false,
    components: false,
    toolbox: false,
    config: false,
  });
  return (
    <div className={styles.editor}>
      <HeaderComponent setHide={setHide} hide={hide} />
      <div className={styles.main}>
        <div
          className={classnames(styles['layer-panel-wp'], {
            [styles.hide]: hide.layer,
          })}
        >
          图层
        </div>
        <ComponentPanel
          className={classnames({
            [styles.hide]: hide.components,
          })}
        />

        <div className={styles['right-edit-main']}>
          <div
            className={classnames(styles['toolbox-panel-wp'], {
              [styles['toolbox-hide']]: hide.toolbox,
            })}
          >
            <div className={styles['toolbox-panel']}>工具栏</div>
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
        <div
          className={classnames(styles['config-panel-wp'], {
            [styles.hide]: hide.config,
          })}
        >
          工具栏右侧
        </div>
      </div>
    </div>
  );
};
