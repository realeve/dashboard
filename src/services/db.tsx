export const loadPanel = async (key = 'panel') => {
  let obj = JSON.parse(window.localStorage.getItem(key) || `[]`);
  return obj;
};

export const savePanel = (key = 'panel') => panel => {
  window.localStorage.setItem(key, JSON.stringify(panel));
};
