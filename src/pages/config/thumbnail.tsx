import React, { useEffect, useState } from 'react';
import styles from './thumbnail.less';
import classnames from 'classnames';
// import { rangeCfg } from './EditSlider';

import Moveable from 'react-moveable';

import { IPage } from '@/models/common';
import { useSetState } from 'react-use';
import * as R from 'ramda';

// TODO 拖动缩略图
interface IThumbnailProps {
  visible: boolean;
  zoom: number;
  dragPercent: { x: number; y: number };
  page: IPage;
}
export default ({ zoom, dragPercent, visible, page }: IThumbnailProps) => {
  const thumbnailSize = { width: Number(page.width) / 10, height: Number(page.height) / 10 };
  // 缩放比
  // const scale = rangeCfg.min / zoom;
  let offset = 1.5;
  const [frame, setFrame] = useSetState({
    translate: [0, 0],
    transformOrigin: '50% 50%',
  });
  const ref = React.useRef(null);

  useEffect(() => {
    let maxOffset = 100 * (1 - 1 / offset);
    let beforeTranslate = [
      (R.clamp(0, maxOffset, dragPercent.x) * thumbnailSize.width) / 100,
      (R.clamp(0, maxOffset, dragPercent.y) * thumbnailSize.height) / 100,
    ];
    setFrame({
      translate: beforeTranslate,
    });
    ref.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
  }, [dragPercent]);

  console.log(frame.translate, dragPercent);
  return (
    <div
      className={classnames(styles.thumbnail, styles[`thumbnail-${visible ? 'show' : 'hide'}`])}
      style={thumbnailSize}
    >
      <div className={styles['datav-thumbnail']}>
        <span
          className={styles['select-span']}
          style={{
            transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`,
            width: thumbnailSize.width / offset,
            height: thumbnailSize.height / offset,
          }}
          ref={ref}
        />
        <Moveable
          target={ref?.current}
          snappable={true}
          bounds={{ left: 0, top: 0, right: thumbnailSize.width, bottom: thumbnailSize.height }}
          draggable={true}
          origin={false}
          onDragStart={({ set }) => {
            set(frame.translate);
          }}
          onDrag={({ target, beforeTranslate }) => {
            setFrame({ translate: beforeTranslate });
            target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
          }}
        />
      </div>
    </div>
  );
};
