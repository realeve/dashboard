import * as R from 'ramda';
export const getFromLS = key => {
  let ls = {};
  if (global.localStorage) {
    ls = JSON.parse(global.localStorage.getItem(key) || '{}');
  }
  return ls['_' + key];
};

export const saveToLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      key,
      JSON.stringify({
        ['_' + key]: value,
      }),
    );
  }
};

export const saveLayout = ({ widgets, layouts, ...state }) => {
  if (widgets.length === 0) {
    return {
      layouts: {
        lg: [],
      },
    };
  }
  let layout = [];
  layouts.lg.forEach(({ h, i, w, x, y }) => {
    let obj = { h, i, w, x, y };
    let item = R.find(item => item.i === i)(widgets);
    if (item) {
      layout.push({
        config: item.config,
        ...obj,
      });
    }
  });
  return { layout, ...state };
};
export const loadLayout = (state = getFromLS('dashboard')) => {
  if (!state) {
    return {
      layouts: {
        lg: [],
      },
      widgets: [],
    };
  }

  let { layout: widgets, ...props } = state;

  let lg = R.map(({ type, ...item }) => item)(widgets);
  return {
    layouts: { lg },
    widgets,
    ...props,
  };
};
