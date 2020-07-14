import { setStore } from '@/utils/lib';
import * as db from '../services/db';
import * as R from 'ramda';
import * as lib from '@/utils/lib';

const updatePanel = function*({ panel, call, put }) {
  yield call(db.savePanel, panel);
  yield put({
    type: 'setStore',
    payload: {
      panel,
    },
  });
};

const copyArray = (idx, array) => {
  let arr = R.clone(array);
  let newItem = arr[idx];
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
  [key: string]: any;
}
export interface ICommon {
  panel: IPanelConfig[];
}
const defaultState: ICommon = {
  panel: [],
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
    *addPanel({ payload: { panel } }, { put, call, select }) {
      let prevPanel = yield select(state => state[namespace].panel);
      let panelItem = R.clone(panel);
      panelItem = {
        ...panelItem,
        id: lib.noncer(),
        icon: `com-font icon-com-${panelItem.type}`,
      };
      let nextPanel = [...prevPanel, panelItem];
      yield updatePanel({
        panel: nextPanel,
        call,
        put,
      });
    },
    *removePanel({ payload: { idx } }, { put, call, select }) {
      let prevPanel = yield select(state => state[namespace].panel);
      let nextPanel = R.remove(idx, 1, prevPanel);
      yield updatePanel({
        panel: nextPanel,
        call,
        put,
      });
    },
    // 更新第I个面板的属性
    *updatePanelAttrib({ payload: { idx, attrib } }, { put, call, select }) {
      let panel = yield select(state => state[namespace].panel);
      let _item = R.nth(idx)(panel);
      _item = {
        ..._item,
        ...attrib,
      };
      let _panel = R.update(idx, _item, panel);
      yield updatePanel({
        panel: _panel,
        call,
        put,
      });
    },
    // 复制一份
    *copyPanel({ payload: { idx } }, { put, call, select }) {
      let panel = yield select(state => state[namespace].panel);
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
      return history.listen(() => {
        // 地址变更
      });
    },
  },
};
