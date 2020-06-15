import React, { useEffect, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { useSetState } from 'react-use';

import Moveable from 'react-moveable';

import HeaderComponent from './header';
import ComponentPanel from './panel/components';
import LayerPanel from './panel/layer';
import BeautyPanel from './panel/beauty';
import FilterPanel from './panel/filterManager';
import Ruler from './ruler';
import Setting from './panel/setting';
import Thumbnail from './thumbnail';
import Toolbox from './toolbox';
import EditSlider from './EditSlider';
import CanvasComponent from './canvas';

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
          <Toolbox hide={hide} />
          <div className={styles['editor-panel-wp']}>
            <Ruler zoom={zoom} canvasSize={canvasSize} />
            <CanvasComponent zoom={zoom} canvasSize={canvasSize} />
            <Thumbnail zoom={zoom} />
          </div>
          <EditSlider />
        </div>
        <Setting setHide={setHide} hide={hide} />
      </div>
    </div>
  );
};
