import localforage from 'localforage';

localforage.config({
  name: 'dashboard',
  storeName: 'tbl_dashboard', // Should be alphanumeric, with underscores.
  description: 'dashboard 离线数据',
});

/**
 * 2020-11-13 在此处使用localforage会导致数据存取出现异常，如整体拖动的情况下，只有部分生效
 */

export const loadPanel: (key?: string) => Promise<unknown> = (key = 'panel') =>
  JSON.parse(window.localStorage.getItem(key) || '[]');
export const savePanel = (key = 'panel') => (panel) =>
  window.localStorage.setItem(key, JSON.stringify(panel));
