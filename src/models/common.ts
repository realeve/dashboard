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

const namespace = 'common';
export interface IPanelStyle {
  width: number;
  height: number;
  rotate: number;
  transform: string;
}
export interface IPanelConfig {
  type: string;
  title: string;
  image: string;
  id?: string;
  icon?: string;
  style?: IPanelStyle;
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
