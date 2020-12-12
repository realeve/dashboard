import * as R from 'ramda';
import { defaultRect } from '@/component/Editor/Editor';
import { parseStyle, calcTranslate } from '@/pages/index/lib';
import { IPanelConfig as IPanel } from '@/models/common';

// 默认样式
export interface IRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// 放置组件后围成的矩形区域
interface IDistRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface IPanelStyleProps extends IDistRect {
  width: number;
  height: number;
}

interface IFnAutoPosition {
  panel: IPanel[];
  page?: { width: number | string; height: number | string };
  padding?: number;
}
/**
 * 计算新面板最佳的放置位置
 * @param panel 当前的面板列表
 * @param page 页面设置
 * @param padding 组件之间的边距
 */
export const calcPanelPosition = ({
  panel,
  page = { width: 1920, height: 1080 },
  padding = 8,
}: IFnAutoPosition) => {
  // 获取默认样式
  let rect: IRect = R.clone(defaultRect);

  // 转换当前组件列表已经占领的区域
  let panelStyle: IPanelStyleProps[] = panel.map(({ style }) => {
    let width = parseStyle(style.width),
      height = parseStyle(style.height),
      top = parseStyle(style.top),
      left = parseStyle(style.left);
    let res = calcTranslate({ translate: style?.transform?.translate, left, top });
    (left = res.left), (top = res.top);
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
  panelStyle.sort((a, b) => a.y1 - b.y1);

  let distPos = {
    isFind: false,
    ...defaultRect,
  };

  // x轴能否放下：当前的x轴坐标 + 目标矩形的宽度 小于 页面宽度，X轴可放下
  const isXAllowed = (item: IPanelStyleProps) => item.x2 + rect.width < Number(page.width);
  const isYAllowed = (item: IPanelStyleProps) => item.y1 + rect.height < Number(page.height);
  // 开始轮询，计算是否有位置放置
  panelStyle.forEach((item, idx) => {
    if (distPos.isFind) {
      return;
    }

    // 当前所围成的矩形区域是否与其它组件重叠；

    // 如果放在当前位置，所围成的矩形
    let rectNeedJudge: IDistRect = {
      x1: item.x2,
      y1: item.y1,
      x2: item.x2 + rect.width,
      y2: item.y1 + rect.height,
    };
    console.log({ rectNeedJudge });

    // 当前区域后续的组件列表，用于判断是否允许放置当前组件
    let rest = panelStyle; //.slice(idx + 1);

    let xAllowed = isXAllowed(item),
      yAllowed = isYAllowed(item);
    let success = xAllowed && yAllowed;
    if (!success) {
      if (!xAllowed) {
        // X轴不允许，另起一行
        distPos = {
          ...distPos,
          top: rect.top + item.height + padding,
        };
      }
      if (!yAllowed) {
        distPos = {
          ...distPos,
          left: rect.left + item.width + padding,
        };
      }
    } else {
      success = shouldRectPosIn(rectNeedJudge, rest);
    }

    // TODO 此处的逻辑需继续处理

    console.log({ success, rest });
    // 当前点会相交
    if (success) {
      distPos = {
        isFind: true,
        ...defaultRect,
        top: item.y1,
        left: item.x2,
      };
    }
  });

  let { isFind, ...props } = distPos;
  return props as IRect;
};

/**
 * 当前的rect是否允许放在目标区域
 * @param rect 需要判断的矩形区域
 * @param panel 当前组件列表的位置及尺寸
 *
 *  x,y————————
 *  |         |
 *  |         |
 *  __________x2,y2
 *
 *  只要目标矩形任意一个顶点在以上方框之内视为无效
 */
export const shouldRectPosIn = (rect: IDistRect, panel: IPanelStyleProps[]) => {
  let allowed = true;
  for (let i = 0; i < panel.length && allowed; i++) {
    let item = panel[i];
    allowed = !isRectCross(item, rect);
  }
  return allowed;
};

/**
 * 两个矩形是否相交
 * 原理：判断重点的位置：/public/doc/rect cross.png
 * @param r1 矩形
 * @param r2 矩形
 */
export const isRectCross = (r1: IDistRect, r2: IDistRect) =>
  Math.abs((r1.x1 + r1.x2) / 2 - (r2.x1 + r2.x2) / 2) <= (r1.x2 + r2.x2 - r1.x1 - r2.x1) / 2 &&
  Math.abs((r1.y1 + r1.y2) / 2 - (r2.y1 + r2.y2) / 2) <= (r1.y2 + r2.y2 - r1.y1 - r2.y1) / 2;
