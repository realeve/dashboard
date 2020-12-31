import React, { forwardRef } from 'react';
import styles from './index.less';
import { useMeasure } from 'react-use';

/**
 * 计算分屏线的距离及位置
 * @param width 总宽度
 * @param screenNum 分为几个屏幕
 * @param lineWidth 线宽
 */
const getEdgeArr = (
  _width: string | number,
  screenNum: string | number,
  lineWidth: string | number = 2,
) => {
  const width = Math.ceil(Number(_width));
  if (Number(screenNum) < 2 || width === 0) {
    return [];
  }
  const step = width / Number(screenNum);
  const arr = [];
  const lWidth = Number(lineWidth);
  for (let i = 1; step * i < width; i++) {
    // 此处需要考虑线的宽度，让分割线居中
    arr.push(i * step - Math.floor(lWidth / 2));
  }
  return arr;
};

interface EdgeLineProps {
  direction?: 'horizontal' | 'vertical';
  data: any[];
  screen_edge_width: number;
  showEdgeTag?: boolean;
  screen_edge_background?: string;
}
const EdgeLine: React.ForwardRefExoticComponent<
  EdgeLineProps & React.RefAttributes<HTMLDivElement>
> = forwardRef(
  (
    {
      direction = 'horizontal',
      data,
      screen_edge_width,
      showEdgeTag = true,
      screen_edge_background = 'rgba(0, 0, 0, 0.5)',
    },
    ref,
  ) => {
    const isHorizontal = direction === 'horizontal';
    return (
      <div
        ref={ref}
        className={`scena-guides scena-${direction}`}
        style={{ width: '100%', height: '100%' }}
      >
        <div className="datav-guides" style={{ transform: 'translateX(-10px)', height: '100%' }}>
          {data.map((item) => (
            <div
              className={`${styles.screenEdge} datav-${direction}`}
              key={`${item}px`}
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
  },
);

export interface IScreenEdgeProps {
  screen_edge_background: string;
  screen_edge_width: number;
  screen_x: number;
  screen_y: number;
  showEdge: boolean;
  showEdgeTag: boolean;
}
export default ({ page }: { page: IScreenEdgeProps }) => {
  const [refHeight, { height }] = useMeasure();
  const [refWidth, { width }] = useMeasure();
  return (
    <>
      <EdgeLine
        ref={refHeight}
        data={getEdgeArr(width, page.screen_x, page.screen_edge_width)}
        showEdgeTag={page.showEdgeTag}
        screen_edge_width={page.screen_edge_width}
        direction="vertical"
        screen_edge_background={page.screen_edge_background}
      />
      <EdgeLine
        ref={refWidth}
        data={getEdgeArr(height, page.screen_y, page.screen_edge_width)}
        screen_edge_width={page.screen_edge_width}
        direction="horizontal"
        showEdgeTag={page.showEdgeTag}
        screen_edge_background={page.screen_edge_background}
      />
    </>
  );
};
