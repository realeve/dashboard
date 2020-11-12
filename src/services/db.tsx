import localforage from 'localforage';

localforage.config({
  name: 'dashboard',
  storeName: 'tbl_dashboard', // Should be alphanumeric, with underscores.
  description: 'dashboard 离线数据',
});

export const loadPanel: (key?: string) => Promise<unknown> = (key = 'panel') =>
  localforage.getItem(key).then((res) => res || []);
export const savePanel = (key = 'panel') => (panel) => localforage.setItem(key, panel);
