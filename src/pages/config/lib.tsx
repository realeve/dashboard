/**
 * 2020-12-13
 * 本函数用于在画布的空余区域搜索最佳放置的位置
 */
import * as R from 'ramda';
import type { IPanelConfig as IPanel } from '@/models/common';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';

const rectPadding = 12;
export const defaultRect = {
  top: rectPadding,
  left: rectPadding,
  width: 1920 / 4 - 2.4 * rectPadding,
  height: 1080 / 4 - 2.4 * rectPadding,
};

/**
 * 将style中   233px 转换为 数值型 233
 * @param style 样式内容
 * @param unit 单位
 */
export const parseStyle = (style: string | number, unit = 'px') => {
  const reg = RegExp(unit, 'g');
  return parseInt(String(style).replace(reg, ''), 10);
};

/**
 * 通过translate字符串计算位置
 */
export const calcTranslate = ({
  translate,
  left,
  top,
}: {
  translate?: string;
  left: number;
  top: number;
}) => {
  if (translate) {
    const arr = translate
      .replace(/px/g, '')
      .split(',')
      .map((item) => Number(item));
    left += arr[0];
    top += arr[1];
  }
  return { left: parseInt('' + left, 10), top: parseInt('' + top, 10) };
};

// 默认样式
export interface IRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type IRectPos = {
  isFind: boolean;
} & IRect;

// 放置组件后围成的矩形区域
interface IDistRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type IPanelStyleProps = {
  width: number;
  height: number;
} & IDistRect;
interface IPage {
  width: number | string;
  height: number | string;
}

export type TPanelStyle = Pick<IPanel, 'style' | 'key'>;

interface IFnAutoPosition {
  panel: TPanelStyle[];
  page?: IPage;
  padding?: number;
}

// x轴能否放下：当前的x轴坐标 + 目标矩形的宽度 小于 页面宽度，X轴可放下
export const isXAllowed = (item: IPanelStyleProps, page: IPage, rect: IRect = defaultRect) =>
  item.x2 + rect.width < Number(page.width);

export const isYAllowed = (item: IPanelStyleProps, page: IPage, rect: IRect = defaultRect) =>
  item.y1 + rect.height < Number(page.height);

/**
 * 判断两个矩形是否相交
  (x1,y1)
  ┏━━━━W1━━━━┓ 
  ┃          ┃     
  H1   ❶─────┼──W──────┐   
  ┃          ┃         │
  ┗━━━━━━━━━━┛(x2,y2)  │
                       H
           (a1,b1)┏━━━━┼━━━━━┓ 
                  ┃    │     ┃     
                  H2   ❷     ┃     
                  ┃          ┃     
                  ┗━━━━W2━━━━┛(a2,b2)
  两个矩形相交，则需满足以下条件：              
  1.W > (W1+W2)/2
  2.H > (H1+H2)/2
  据此推导出以下的结果。
  
 * 原理：判断中心点的位置与距离：/public/doc/rect cross.png
 * @param r1 矩形
 * @param r2 矩形
 * 
 * 以下公式中，除以2可省去
  Math.abs((r1.x1 + r1.x2) / 2 - (r2.x1 + r2.x2) / 2) < (r1.x2 + r2.x2 - r1.x1 - r2.x1) / 2 &&
  Math.abs((r1.y1 + r1.y2) / 2 - (r2.y1 + r2.y2) / 2) < (r1.y2 + r2.y2 - r1.y1 - r2.y1) / 2;
 */
export const isRectCross = (r1: IDistRect, r2: IDistRect) =>
  Math.abs(r1.x1 + r1.x2 - r2.x1 - r2.x2) < r1.x2 + r2.x2 - r1.x1 - r2.x1 &&
  Math.abs(r1.y1 + r1.y2 - r2.y1 - r2.y2) < r1.y2 + r2.y2 - r1.y1 - r2.y1;

/** 
(x1,y1)                (x3,y3)
┏━━━━━━━━━┓            ┏━━━━━━━━━┓       
┃   X1    ┃            ┃   X3    ┃       
┃         ┃            ┃         ┃       
┗━━━━━━━━━┛(x2,y2)     ┗━━━━━━━━━┛(x4,y4)

            (a1,b1)
            ┏━━━━━━━━━┓       
            ┃   A     ┃       
            ┃         ┃       
            ┗━━━━━━━━━┛(a2,b2)
矩形A只有与X1,X3都不相交时，允许放置在它所在的位置
*/
/**
 *
 * 当前的rect是否允许放在目标区域
 * @param rect 需要判断的矩形区域
 * @param panel 当前组件列表的位置及尺寸
 */
export const shouldRectPosIn = (rect: IDistRect, panel: IPanelStyleProps[]) => {
  let i = 0;
  let allowed = true;
  while (allowed && i < panel.length) {
    allowed = !isRectCross(panel[i], rect);
    i += 1;
  }
  return allowed;
};

/**
 * 当前所围成的矩形区域是否与其它组件重叠；
 * @param page 页面设置，用于判断是否越界
 * @param panelStyle 需要判断的现有panel
 * @param distPos 初始值
 * @param rect rect默认设置
 * @param direction 查找方向
 */
export const findPosition = (
  direction,
  page: IPage,
  panelStyle: IPanelStyleProps[],
  distPos: IRectPos,
  rect: IRect = defaultRect,
) => {
  if (distPos.isFind) {
    return distPos;
  }
  let newPosition = R.clone<IRectPos>(distPos);
  // 开始轮询，计算是否有位置放置
  panelStyle.forEach((item) => {
    if (newPosition.isFind) {
      return;
    }

    // 如果放在当前位置，所围成的矩形
    const rect1: IDistRect =
      direction === 'right'
        ? {
            x1: item.x2, // 向右放置，起始点从x2起，y轴不变
            y1: item.y1,
            x2: item.x2 + rect.width,
            y2: item.y1 + rect.height,
          }
        : {
            x1: item.x1, // 向下放置，起始点不变，y轴从y2起
            y1: item.y2,
            x2: item.x1 + rect.width,
            y2: item.y2 + rect.height,
          };

    const xAllowed = isXAllowed(item, page);
    const yAllowed = isYAllowed(item, page);

    // x/y轴未越界
    if (!xAllowed || !yAllowed) {
      return;
    }

    // 同时不同其它区域相交
    if (shouldRectPosIn(rect1, panelStyle)) {
      newPosition = {
        isFind: true,
        ...defaultRect,
        top: rect1.y1,
        left: rect1.x1,
      };
    }
  });
  return newPosition;
};

/**
 * 转换面板样式基础配置，只提取与区域判断有关的信息
 * @param param0
 */
export const convertPanel: (param: Omit<IFnAutoPosition, 'page'>) => IPanelStyleProps[] = ({
  panel,
  padding = 16,
}) => {
  const dist = panel.map(({ style }) => {
    const width = parseStyle(style.width);
    const height = parseStyle(style.height);
    let top = parseStyle(style.top);
    let left = parseStyle(style.left);
    const res = calcTranslate({ translate: style?.transform?.translate, left, top });
    left = res.left;
    top = res.top;
    return {
      width,
      height,
      x1: left,
      y1: top,
      x2: left + width + padding,
      y2: top + height + padding,
    };
  });
  // 优先从上方至下，从左至右放置
  dist.sort((a, b) => a.y1 - b.y1);
  return dist;
};

/**
 * 计算新面板最佳的放置位置
 * @param panel 当前的面板列表
 * @param page 页面设置
 * @param padding 组件之间的边距
 */
export const calcPanelPosition = ({
  panel: _panel,
  page = { width: 1920, height: 1080 },
  padding = 25,
}: IFnAutoPosition) => {
  const panel = R.reject<TPanelStyle>((item) =>
    [SCREEN_EDGE_KEY, GROUP_COMPONENT_KEY].includes(item.key),
  )(_panel);

  // 转换当前组件列表已经占领的区域
  const panelStyle = convertPanel({ panel, padding });

  let distPos: IRectPos = {
    isFind: false,
    ...defaultRect,
  };

  // 优先放在右边，查看能否放下
  distPos = findPosition('right', page, panelStyle, distPos);

  // 否则向下搜索
  distPos = findPosition('top', page, panelStyle, distPos);

  const { isFind, ...props } = distPos;
  return props as IRect;
};
