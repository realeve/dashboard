import { setStore } from '@/utils/lib';
import * as db from '../services/db';
import * as R from 'ramda';
import * as lib from '@/utils/lib';

const updatePanel = function* ({ panel, call, put }) {
  yield call(db.savePanel(), panel);
  yield put({
    type: 'setStore',
    payload: {
      panel,
    },
  });
};

const updatePage = function* ({ page, call, put }) {
  yield call(db.savePanel('page'), page);
  yield put({
    type: 'setStore',
    payload: {
      page,
    },
  });
};

const copyArray = (idx, array) => {
  let arr = R.clone(array);
  let newItem = R.nth(idx, array);
  newItem.id = lib.noncer();
  return [...arr.slice(0, idx), newItem, ...arr.slice(idx, arr.length)];
};

const namespace = 'common';
export interface IPanelStyle {
  width: number;
  height: number;
  rotate: number;
  transform: string;
}
export interface IPanelConfig {
  type: string; //类型
  title: string; //标题
  image: string; // 缩略图
  id?: string; // 自动生成的ID
  icon?: string; // 图标
  style?: IPanelStyle;
  lock?: boolean; //锁定
  hide?: boolean; // 隐藏

  showTitle?: boolean; // 显示标题
  showBorder?: boolean; // 显示边框
  showBackground?: boolean; // 显示背景
  useGeneralStyle?: boolean; //使用全局设置

  componentConfig?: {
    [key: string]: any;
  }; // 组件自带配置项

  api?: {
    [key: string]: any;
  }; // 接口配置项

  [key: string]: any;
}
export interface ICommonConfig {
  border: string; // 边框样式
  chartBackground: string; // 卡片背景
  head: React.CSSProperties; // 卡片标题栏
}
export interface IPage extends ICommonConfig {
  width: string; // 页面宽
  height: string; // 页面高
  background: string; // 页面背景
}

const panelGeneral: ICommonConfig = {
  border: '边框29', // 边框12,
  chartBackground: 'rgba(3,11,31,0.8)', // 'rgba(38,42,50,0.6)'
  head: {
    background: 'linear-gradient(90deg, #250e66 0%, #102f6e 40%, rgba(0,0,0,0) 70%)',
    fontSize: 20,
    color: '#aec1f9',
    textAlign: 'left',
    padding: 10,
  },
};

export interface ICommon {
  panel: IPanelConfig[];
  selectedPanel: string[];
  page: Partial<IPage>;
}
const defaultState: ICommon = {
  panel: [],
  selectedPanel: [],
  page: {
    width: '1920',
    height: '1080',
    background: '默认',
    ...panelGeneral,
  },
};

export default {
  namespace,
  state: defaultState,
  reducers: {
    setStore,
  },
  effects: {
    *loadPanel({}, { put, call }) {
      let panel = yield call(db.loadPanel);
      yield put({
        type: 'setStore',
        payload: {
          panel,
        },
      });
    },
    *updatePanel({ payload: { panel } }, { put, call }) {
      yield updatePanel({
        panel,
        call,
        put,
      });
    },
    *loadPage({}, { put, call }) {
      let page = yield call(() => db.loadPanel('page'));
      if (!page.width) {
        return;
      }
      yield put({
        type: 'setStore',
        payload: {
          page,
        },
      });
    },
    *updatePage({ payload: { page } }, { put, call, select }) {
      let prevPage = yield select((state) => state[namespace].page);
      yield updatePage({
        page: {
          ...prevPage,
          ...page,
        },
        call,
        put,
      });
    },
    *addPanel({ payload: { panel } }, { put, call, select }) {
      let prevPanel = yield select((state) => state[namespace].panel);
      let panelItem = R.clone(panel);
      panelItem = {
        showTitle: true,
        showBorder: true,
        showBackground: true,
        ajax: true,
        ...panelItem,
        id: panel.id || lib.noncer(),
        icon: `com-font icon-com-${panelItem.type}`,
        general: panelGeneral,
        useGeneralStyle: true,

        // 自定义配置
        componentConfig: {},
        api: {},
      };
      let nextPanel = [...prevPanel, panelItem];
      yield updatePanel({
        panel: nextPanel,
        call,
        put,
      });

      // 默认选中最新添加的面板
      yield put({
        type: 'setStore',
        payload: {
          selectedPanel: [panel.id],
        },
      });
    },
    *removePanel({ payload: { idx } }, { put, call, select }) {
      let prevPanel = yield select((state) => state[namespace].panel);
      let nextPanel = R.reject((item) => idx.includes(item.id))(prevPanel);
      // 默认选中最新添加的面板
      yield put({
        type: 'setStore',
        payload: {
          selectedPanel: [],
        },
      });
      yield updatePanel({
        panel: nextPanel,
        call,
        put,
      });
    },
    // 更新第I个面板的属性
    *updatePanelAttrib({ payload: { idx, attrib } }, { put, call, select }) {
      let panel = yield select((state) => state[namespace].panel);
      let id = R.findIndex(R.propEq('id', idx))(panel);
      let _item = R.nth(id)(panel);
      _item = {
        ..._item,
        ...attrib,
      };
      let _panel = R.update(id, _item, panel);

      yield updatePanel({
        panel: _panel,
        call,
        put,
      });
    },
    // 复制一份
    *copyPanel({ payload: { idx } }, { put, call, select }) {
      let panel = yield select((state) => state[namespace].panel);
      let _panel = copyArray(idx, panel);
      yield updatePanel({
        panel: _panel,
        call,
        put,
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: 'loadPanel',
      });
      dispatch({
        type: 'loadPage',
      });
      return history.listen(() => {
        // 地址变更
      });
    },
  },
};
