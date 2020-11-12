import localforage from 'localforage';

export const loadPanel: (key?: string) => Promise<unknown> = (key = 'panel') =>
  localforage.getItem(key).then((res) => res || []);
export const savePanel = (key = 'panel') => (panel) => localforage.setItem(key, panel);
