import React from 'react';
import { IPage } from '@/models/common';
import styles from './index.less';
/**
 * 计算分屏线的距离及位置
 * @param width 总宽度
 * @param screenNum 分为几个屏幕
 * @param lineWidth 线宽
 */
let getEdgeArr = (
  width: string | number,
  screenNum: string | number,
  lineWidth: string | number = 2,
) => {
  if (Number(screenNum) < 2) {
    return [];
  }
  let step = Number(width) / Number(screenNum),
    arr = [],
    lWidth = Number(lineWidth);
  for (let i = 1; step * i < Number(width); i++) {
    // 此处需要考虑线的宽度，让分割线居中
    arr.push(i * step - Math.floor(lWidth / 2));
  }
  return arr;
};

const EdgeLine = ({
  direction = 'horizontal',
  data,
  screen_edge_width,
  showEdgeTag = true,
  screen_edge_background = 'rgba(0, 0, 0, 0.5)',
}) => {
  let isHorizontal = direction == 'horizontal';
  return (
    <div className={`scena-guides scena-${direction}`} style={{ width: '100%', height: '100%' }}>
      <div className="datav-guides" style={{ transform: 'translateX(-10px)', height: '100%' }}>
        {data.map((item) => (
          <div
            className={styles.screenEdge + ` datav-${direction}`}
            key={item + 'px'}
            style={{
              transform: !isHorizontal
                ? `translate(${item}px,-30px)`
                : `translate(-20px,${item}px)`,
              [isHorizontal ? 'height' : 'width']: screen_edge_width,
              [!isHorizontal ? 'height' : 'width']: '100%',
              background: screen_edge_background,
            }}
          >
            {showEdgeTag && <span>{item}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ({ page }: { page: IPage }) => {
  return (
    <>
      <EdgeLine
        data={getEdgeArr(page.width, page.screen_x, page.screen_edge_width)}
        showEdgeTag={page.showEdgeTag}
        screen_edge_width={page.screen_edge_width}
        direction="vertical"
        screen_edge_background={page.screen_edge_background}
      />
      <EdgeLine
        data={getEdgeArr(page.height, page.screen_y, page.screen_edge_width)}
        screen_edge_width={page.screen_edge_width}
        direction="horizontal"
        showEdgeTag={page.showEdgeTag}
        screen_edge_background={page.screen_edge_background}
      />
    </>
  );
};
