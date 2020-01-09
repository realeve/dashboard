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

export const saveLayout = state => {
  if (state.widgets.length === 0) {
    return {
      layouts: {
        lg: [],
      },
    };
  }
  let layout = [];
  state.layouts.lg.forEach(({ h, i, w, x, y }) => {
    let obj = { h, i, w, x, y };
    let item = R.find(item => item.i === i)(state.widgets);
    if (item) {
      layout.push({
        type: item.type,
        ...obj,
      });
    }
  });
  return layout;
};
export const loadLayout = (widgets = getFromLS('dashboard')) => {
  if (!widgets) {
    return {
      layouts: {
        lg: [],
      },
      widgets: [],
    };
  }
  let lg = R.map(({ type, ...item }) => item)(widgets);
  return {
    layouts: { lg },
    widgets,
  };
};
