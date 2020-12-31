import * as R from 'ramda';
import type { IPanelConfig} from '@/models/common';
import { GROUP_COMPONENT_KEY } from '@/models/common';

/**
 * https://codesandbox.io/s/k260nyxq9v?file=/index.js:1257-1263
 * beautiful dnd 文档
 */

// a little function to help us with reordering the result
export const reorder: <T>(list: T[], startIndex: number, endIndex: number) => T[] = (
  list,
  startIndex,
  endIndex,
) => {
  const result = R.clone(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export enum MENU_ACTIONS {
  TOP,
  BOTTOM,
  MOVE_PREV,
  MOVE_NEXT,
  LOCK,
  HIDE,
  COPY,
  REMOVE,
  FAVORITE,
  GROUP,
  UN_GROUP,
}

export const MENU_LIST = [
  {
    title: '置顶',
    action: MENU_ACTIONS.TOP,
    icon: 'icon-to-top',
  },
  {
    title: '置底',
    action: MENU_ACTIONS.BOTTOM,
    icon: 'icon-to-bottom',
  },
  {
    title: '上移一层',
    action: MENU_ACTIONS.MOVE_PREV,
    icon: 'icon-move-prev',
  },
  {
    title: '下移一层',
    action: MENU_ACTIONS.MOVE_NEXT,
    icon: 'icon-move-next',
  },
  {
    icon: 'divider1',
  },
  {
    title: '编组',
    action: MENU_ACTIONS.GROUP,
    icon: 'icon-group',
  },
  {
    title: '取消编组',
    action: MENU_ACTIONS.UN_GROUP,
    icon: 'icon-ungroup',
  },
  {
    icon: 'divider0',
  },
  {
    title: '锁定/解锁',
    action: MENU_ACTIONS.LOCK,
    icon: 'icon-lock',
  },
  {
    title: '隐藏/显示',
    action: MENU_ACTIONS.HIDE,
    icon: 'icon-hide',
  },
  {
    icon: 'divider2',
  },
  {
    title: '复制',
    action: MENU_ACTIONS.COPY,
    icon: 'icon-copy',
  },
  {
    title: '删除',
    action: MENU_ACTIONS.REMOVE,
    icon: 'icon-delete',
  },
  // {
  //   title: '收藏',
  //   action: MENU_ACTIONS.FAVORITE,
  //   icon: 'icon-favorite',
  // },
  {
    icon: 'divider3',
  },
];

export const MENU_TYPE = 'CONTEXT_MENU';

export const getShowedPanel = (panel: IPanelConfig[]) => {
  const foldPanel = R.filter(R.propEq<string>('fold', true))(panel);
  const folds = R.pluck('id', foldPanel);
  return R.reject<IPanelConfig>((item) => folds.includes(item.group))(panel);
};

/**
 * 面板重新自动排序
 * @param panel 面板列表
 */
export const reorderPanel = (panel: IPanelConfig[]) => {
  const _groupPanel = R.filter<IPanelConfig>(R.propEq<string>('key', GROUP_COMPONENT_KEY))(panel);
  let groupPanels = R.pluck('id', _groupPanel);
  groupPanels = R.uniq(groupPanels);

  // 不包含子元素的列表
  const _panel = R.reject<IPanelConfig>((item) => groupPanels.includes(item.group))(panel);

  // 最终结果
  let _nextPanel: IPanelConfig[] = [];

  _panel.forEach((item: IPanelConfig) => {
    if (item.key === GROUP_COMPONENT_KEY) {
      // 处理组内移动
      const childrenPanel = R.filter(R.propEq<string>('group', item.id))(panel) as IPanelConfig[];
      _nextPanel = [..._nextPanel, item, ...childrenPanel];
    } else {
      _nextPanel.push(item);
    }
  });
  return _nextPanel;
};
