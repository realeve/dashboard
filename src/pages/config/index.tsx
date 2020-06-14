import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { useSetState } from 'react-use';
import HeaderComponent from './header';
import ComponentPanel from './panel/components';
import LayerPanel from './panel/layer';
import BeautyPanel from './panel/beauty';
import FilterPanel from './panel/filterManager';
import Ruler from './ruler';
import Setting from './panel/setting';

export default () => {
  const [hide, setHide] = useSetState({
    layer: false,
    components: false,
    toolbox: false,
    config: true,
    beauty: true,
    filter: true,
  });

  const [zoom, setZoom] = useState(0.7);
  const [canvasSize, setCanvasSize] = useSetState({
    width: 1920,
    height: 1080,
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
            <Ruler zoom={zoom} canvasSize={canvasSize} />
            <div
              className={styles['canvas-panel']}
              style={{ ...canvasSize, transform: `scale(${zoom}) translate(0px, 0px)` }}
            />
            <div className={classnames(styles.thumbnail, styles['thumbnail-show'])}>
              <div className={styles['datav-thumbnail']}>
                <span
                  className={styles['select-span']}
                  style={{ transform: `scale(${zoom}) translate(0px, 0px)` }}
                />
              </div>
            </div>
          </div>
          <div className={styles['edit-slider']} />
        </div>
        <Setting setHide={setHide} hide={hide} />
      </div>
    </div>
  );
};
