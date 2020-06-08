import React, { useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { useSetState } from 'react-use';
import HeaderComponent from './header';
import ComponentPanel from './panel/components';
import LayerPanel from './panel/layer';
import BeautyPanel from './panel/beauty';
import FilterPanel from './panel/filterManager';

export default () => {
  const [hide, setHide] = useSetState({
    layer: false,
    components: false,
    toolbox: false,
    config: false,
    beauty: true,
    filter: true,
  });

  return (
    <div className={styles.editor}>
      <HeaderComponent setHide={setHide} hide={hide} />
      <div className={styles.main}>
        <LayerPanel setHide={setHide} hide={hide} />
        <BeautyPanel setHide={setHide} hide={hide} />
        <FilterPanel setHide={setHide} hide={hide} />
        <ComponentPanel setHide={setHide} hide={hide} />

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
