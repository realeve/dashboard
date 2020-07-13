export const loadPanel = async () => {
  let obj = JSON.parse(window.localStorage.getItem('panel') || `[]`);
  return obj;
};

export const savePanel = async panel => {
  window.localStorage.setItem('panel', JSON.stringify(panel));
};
