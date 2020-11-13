import React from 'react';
import { IPage } from '@/models/common';
import styles from './index.less';

let getEdgeArr = (width: string | number, screenNum: string | number) => {
  if (Number(screenNum) < 2) {
    return [];
  }
  let step = Number(width) / Number(screenNum),
    arr = [];
  for (let i = 1; step * i < Number(width); i++) {
    arr.push(i * step);
  }
  return arr;
};

const EdgeLine = ({ direction = 'horizontal', data, screen_edge_width, showEdgeTag = true }) => {
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
        data={getEdgeArr(page.width, page.screen_x)}
        showEdgeTag={page.showEdgeTag}
        screen_edge_width={page.screen_edge_width}
        direction="vertical"
      />
      <EdgeLine
        data={getEdgeArr(page.height, page.screen_y)}
        screen_edge_width={page.screen_edge_width}
        direction="horizontal"
        showEdgeTag={page.showEdgeTag}
      />
    </>
  );
};
