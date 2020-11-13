import React, { useEffect, useState } from 'react';
import { IPage } from '@/models/common';
import styles from './index.less';

let getEdgeArr = (width: number, screenNum: number) => {
  if (screenNum < 2) {
    return [];
  }
  let step = width / screenNum;
  let arr = [];
  for (let i = 1; step * i < width; i++) {
    arr.push(i * step);
  }
  return arr;
};

const getEdgeLine = (page: {
  screen_x: string | number;
  screen_y: string | number;
  width: string | number;
  height: string | number;
}) => {
  let screen_x = Number(page.screen_x),
    screen_y = Number(page.screen_y),
    width = Number(page.width),
    height = Number(page.height);

  return {
    vertical: getEdgeArr(width, screen_x),
    horizontal: getEdgeArr(height, screen_y),
  };
};

const EdgeLine = ({ direction = 'horizontal', data, screen_edge_width, showEdgeTag = true }) => {
  let isHorizontal = direction == 'horizontal';
  let style = !isHorizontal
    ? {
        width: screen_edge_width,
        height: '100%',
      }
    : {
        height: screen_edge_width,
        width: '100%',
      };
  return (
    <div
      className={`datav-manager datav-${direction} scena-guides scena-${direction}`}
      style={{ width: '100%', height: '100%' }}
    >
      <div className="datav-guides" style={{ transform: 'translateX(-10px)', height: '100%' }}>
        {data.map((item) => (
          <div
            className={styles.screenEdge + ` datav-${direction}`}
            key={item + 'px'}
            style={{
              transform:
                direction === 'vertical'
                  ? `translate(${item}px,-30px)`
                  : `translate(-20px,${item}px)`,
              ...style,
            }}
          >
            {showEdgeTag && <span>{item}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ({
  page: { screen_x, screen_y, screen_edge_width, width, height, showEdgeTag },
}: {
  page: IPage;
}) => {
  const [state, setState] = useState({
    vertical: [],
    horizontal: [],
  });

  useEffect(() => {
    let arr = getEdgeLine({ screen_x, screen_y, width, height });
    setState(arr);
  }, [JSON.stringify({ screen_x, screen_y, screen_edge_width, width, height })]);

  return (
    <>
      <EdgeLine
        data={state.vertical}
        showEdgeTag={showEdgeTag}
        screen_edge_width={screen_edge_width}
        direction="vertical"
      />
      <EdgeLine
        data={state.horizontal}
        screen_edge_width={screen_edge_width}
        direction="horizontal"
        showEdgeTag={showEdgeTag}
      />
    </>
  );
};
