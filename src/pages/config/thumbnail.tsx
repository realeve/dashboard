import React, { useEffect, useState } from 'react';
import styles from './thumbnail.less';
import classnames from 'classnames';
import { rangeCfg } from './EditSlider';

import Moveable from 'react-moveable';

// TODO 拖动缩略图
export default ({
  zoom,
  dragPercent,
  visible,
}: {
  visible: boolean;
  zoom: number;
  dragPercent: { x: number; y: number };
}) => {
  const thumbnailSize = { width: 192, height: 108 };
  // 缩放比
  const scale = rangeCfg.min / zoom;

  const [frame] = React.useState({
    translate: [0, 0],
    transformOrigin: '50% 50%',
  });
  const ref = React.useRef(null);

  console.log(dragPercent);
  return (
    <div className={classnames(styles.thumbnail, styles[`thumbnail-${visible ? 'show' : 'hide'}`])}>
      <div className={styles['datav-thumbnail']}>
        <span
          className={styles['select-span']}
          style={{
            // transform: `scale(${scale}) translate(${Math.max(0, dragPercent.x)}%,${
            //   (Math.max(0, dragPercent.y) * thumbnailSize.height) / 100
            // }px)`,
            transform: `scale(${scale})`,
            left: Math.max(0, dragPercent.x) + '%',
            top: (Math.max(0, dragPercent.y) * thumbnailSize.height) / 100,
          }}
          ref={ref}
        />

        <Moveable
          target={ref?.current}
          resizable={false}
          rotatable={false}
          draggable={true}
          origin={false}
          snappable={false}
          throttleDrag={0}
          startDragRotate={0}
          throttleDragRotate={0}
          throttleRotate={0}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          onDragStart={({ set }) => {
            set(frame.translate);
          }}
          onDrag={({ target, beforeTranslate }) => {
            frame.translate = beforeTranslate;
          }}
          onRender={({ target }) => {
            const { translate } = frame;
            target.style.transform = `scale(${scale}) translate(${translate[0] / scale}px, ${
              translate[1] / scale
            }px)`;
          }}
        />
      </div>
    </div>
  );
};
