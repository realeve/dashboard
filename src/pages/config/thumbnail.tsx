import React, { useEffect, useState } from 'react';
import styles from './thumbnail.less';
import classnames from 'classnames';

import Moveable from 'react-moveable';

import { IPage } from '@/models/common';
import { useSetState } from 'react-use';
import * as R from 'ramda';

/**
 * 获取缩略图的宽度及可用的最大边距，推导过程见  /public/缩略图推导.png
 * @param x 序号
 * @returns x:尺寸缩放系数
 * @returns y:边框缩放系数
 */
const getThumbnailParam = (x: number) => {
  return {
    x: (x + 1) / 2,
    y: (5 * x - 1) / (3 * x + 3),
  };
};

// 缩略图缩放系数
const SCALE_PARAM = 10;

// -[x] 拖动缩略图
interface IThumbnailProps {
  visible: boolean;
  zoom: number;
  dragPercent: { x: number; y: number };
  page: IPage;
  onScroll: (e: { x: number; y: number }) => void;
  showConfig: boolean;
}
export default ({ zoom, dragPercent, visible, page, onScroll, showConfig }: IThumbnailProps) => {
  const thumbnailSize = {
    width: Number(page.width) / SCALE_PARAM,
    height: Number(page.height) / SCALE_PARAM,
  };
  // 缩放比
  // const scale = rangeCfg.min / zoom;

  let offset, moveParam, res;
  if (zoom < 0.7) {
    res = getThumbnailParam(1);
    (offset = res.x), (moveParam = res.y);
  } else if (zoom < 0.8) {
    res = getThumbnailParam(2);
    (offset = res.x), (moveParam = res.y);
  } else if (zoom < 1.0) {
    res = getThumbnailParam(3);
    (offset = res.x), (moveParam = res.y);
  } else if (zoom < 1.2) {
    res = getThumbnailParam(4);
    (offset = res.x), (moveParam = res.y);
  } else if (zoom <= 1.6) {
    res = getThumbnailParam(5);
    (offset = res.x), (moveParam = res.y);
  }

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
  }, [dragPercent, offset]);

  return (
    <div
      className={classnames(styles.thumbnail, styles[`thumbnail-${visible ? 'show' : 'hide'}`])}
      style={{ ...thumbnailSize, right: showConfig ? 337 : 5 }}
    >
      <div
        className={styles['datav-thumbnail']}
        style={{
          backgroundImage: page.thumbnail.length > 0 ? `url(${page.thumbnail})` : null,
        }}
      >
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
          bounds={{
            left: 0,
            top: 0,
            right: thumbnailSize.width * moveParam,
            bottom: thumbnailSize.height * moveParam,
          }}
          draggable={true}
          origin={false}
          onDragStart={({ set }) => {
            set(frame.translate);
          }}
          onDrag={({ target, beforeTranslate }) => {
            setFrame({ translate: beforeTranslate });
            target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;

            // 左上角滚动的位置
            onScroll &&
              onScroll({
                x: beforeTranslate[0] * SCALE_PARAM * (zoom - 0.15) - 100,
                y: beforeTranslate[1] * SCALE_PARAM * (zoom - 0.15) - 100,
              });
          }}
        />
      </div>
    </div>
  );
};
