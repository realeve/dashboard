import * as R from 'ramda';

export interface IPanelItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 判断哪些面板需要更新
 * @param prevPanel 上一次的面板
 * @param nextPanel 新的面板
 */
export const diff = (prevPanel: IPanelItem[], nextPanel: IPanelItem[]) => {
  const prevIds = R.pluck('id', prevPanel);
  const nextIds = R.pluck('id', nextPanel);
  const result = R.difference(nextPanel, prevPanel);

  // 新增
  const add = R.reject<IPanelItem>((item) => prevIds.includes(item.id))(result);

  // 变化

  const change = R.filter<IPanelItem>((item) => prevIds.includes(item.id))(result);

  const remove = R.difference(prevIds, nextIds);
  return { remove, change, add };
};
