import { setStore, Store, handleHistoryPanel } from '@/utils/lib';
import * as db from '../services/db';
import * as R from 'ramda';
import * as lib from '@/utils/lib';
import { TQuickTool } from '@/component/Editor/types';
import { getTblBusinessCategory } from '@/pages/config/panel/business/db';
import { reorderPanel } from '@/pages/config/panel/layer';
import { getConfig as getDashboardConfigByUrl } from '@/pages/index/lib';

// TODO 删除、复制组件的功能需要调整
const updatePanel = function* ({ panel, call, put, ...props }) {
  yield call(db.savePanel(), panel);
  console.log(props);
  yield put({
    type: 'setStore',
    payload: {
      panel,
      ...props,
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

const copyArray = (idx: number, array: IPanelConfig[]) => {
  let arr = R.clone(array);
  let newItem = R.nth(idx, array);
  let _arr = R.clone(array);

  // 处理成组组件复制的问题
  let childrenArr = [],
    isGroup = newItem.key === GROUP_COMPONENT_KEY;
  if (isGroup) {
    childrenArr = R.filter<IPanelConfig>(R.propEq<string>('group', newItem.id))(
      _arr,
    ) as IPanelConfig[];
  }
  newItem.id = lib.noncer();
  if (isGroup) {
    childrenArr = R.map<IPanelConfig, IPanelConfig>((item) => {
      item.group = newItem.id;
      item.id = lib.noncer();
      return item;
    })(childrenArr);
  }

  return [...arr, newItem, ...childrenArr];
};

// 分组组件的key
export const GROUP_COMPONENT_KEY = 'group_rect';

export const getGroupRect: () => IPanelConfig = () => {
  let id = lib.noncer();
  return {
    id,
    icon: 'datav-font icon-group layer-item-icon',
    key: GROUP_COMPONENT_KEY,
    title: '组',
    engine: 'other',
    fold: true,
  };
};

const namespace = 'common';
export interface IPanelStyle {
  width: number;
  height: number;
  // rotate: number | string;
  transform: string;
}

export interface IApiProps {
  legend?: number;
  x?: number;
  y?: number;
  show?: boolean;
  url?: string;
  interval?: number;
  api_type?: string;
  mock?: string;
  dateType?: string;
  [key: string]: any;
}

// 渲染引擎
export type TChartEngine = 'echarts' | 'g2' | 'g2plot' | 'other';
export interface IPanelConfig {
  edit_id?: number; // 编辑状态下的业务组件 id;
  engine?: TChartEngine;
  type?: string; //类型
  title: string; //标题
  image?: string; // 缩略图
  id: string; // 自动生成的ID
  icon?: string; // 图标
  style?: React.CSSProperties;
  lock?: boolean; //锁定
  hide?: boolean; // 隐藏

  business?: boolean; // 是否为业务组件，业务组件不允许调节ajax信息

  group?: string; // 父组件
  fold?: boolean; // 是否折叠

  showTitle?: boolean; // 显示标题
  showBorder?: boolean; // 显示边框
  showBackground?: boolean; // 显示背景
  useGeneralStyle?: boolean; //使用全局设置

  componentConfig?: {
    [key: string]: any;
  }; // 组件自带配置项

  api?: IApiProps; // 接口配置项

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

  author: string; // 作者
  title: string; // 业务名称
  padding: number; // 辅助线边距

  screen_x: number; //屏幕数量，X轴
  screen_y: number; // 屏幕数量，Y轴
  screen_edge_width: number; //屏幕拼接边缘宽度
  showEdgeTag: boolean; //是否显示拼接位置标签
  showEdge: boolean; //显示拼接区域

  thumbnail: string; // 缩略图
}

/**
 * page:页面配置
 * panel:面板配置
 * rec_time:创建时间
 */
export interface IDashboard {
  page: IPage;
  panel: IPanelConfig[];
  rec_time?: string;
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

export interface IBusinessCategory {
  title: string;
  icon: string;
  list: string[];
}

export interface IHistoryProps {
  history: { panel: IPanelConfig[]; title: string | null }[]; // 历史记录，只记录panel变更情况
  curHistoryIdx: number; //当前历史记录的指针
}
export interface ICommon extends IHistoryProps {
  panel: IPanelConfig[]; // 配置页面中面板列表
  selectedPanel: string[]; // 当前选中面板
  page: Partial<IPage>; // 当前页面设置
  curTool: TQuickTool; // 当前的工具
  businessCategory: IBusinessCategory[]; //业务组件两级分类
  pathname: string;
  history: { panel: IPanelConfig[]; title: string | null }[];
  curHistoryIdx: number;
}
const defaultState: ICommon = {
  pathname: '',
  history: [],
  curHistoryIdx: 0,
  panel: [],
  selectedPanel: [],
  page: {
    width: '1920',
    height: '1080',
    background: '默认',
    author: '管理员',
    title: '仪表盘',
    padding: 15, //边距
    screen_edge_width: 6, //拼接边距
    screen_x: 4, // 横向4块屏
    screen_y: 4, // 纵向4块屏
    showEdgeTag: true, // 默认显示拼接标签
    showEdge: true, //是否显示拼接区域
    thumbnail: '', // 缩略图
    ...panelGeneral,
  },
  curTool: 'MoveTool',
  businessCategory: [],
};

// 历史记录最大存储的条数
export const MAX_HISTORY_STEP = 50;

export default {
  namespace,
  state: defaultState,
  reducers: {
    setStore(prevState, _store: Store) {
      let { type, recordHistory, historyTitle, ...storeCopy } = R.clone(_store.payload);
      let nextState = setStore(prevState, { payload: storeCopy });
      return handleHistoryPanel(prevState, nextState, _store);
    },
  },
  effects: {
    *loadBusinessCategory({}, { put, call }) {
      let businessCategory = yield call(getTblBusinessCategory);
      yield put({
        type: 'setStore',
        payload: {
          businessCategory,
        },
      });
    },
    *loadPanel({}, { put, call }) {
      let panel = yield call(db.loadPanel);
      yield put({
        type: 'setStore',
        payload: {
          panel,
        },
      });
    },
    *updatePanel({ payload: { panel, recordHistory = true } }, { put, call }) {
      let nextPanel = R.uniq(panel);
      yield updatePanel({
        panel: nextPanel,
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
    // 编辑指定的json文件
    *loadPageOnline({ payload: { file, callback } }, { put, call }) {
      let res = yield call(getDashboardConfigByUrl, file);
      if (res.type !== 'online') {
        return;
      }

      let { page, panel } = res;

      // 加载配置项到本地
      yield call(db.savePanel('page'), page);
      yield call(db.savePanel('panel'), panel);
      yield put({
        type: 'setStore',
        payload: {
          page,
          panel,
        },
      });
      callback?.();
    },

    // 清空页面数据
    *clearPage({}, { put, call }) {
      let { page } = R.clone(defaultState);
      yield call(db.savePanel('page'), page);
      yield call(db.savePanel('panel'), []);
      yield put({
        type: 'setStore',
        payload: {
          page,
          panel: [],
          selectedPanel: [],
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
    *addGroupPanel(
      { payload: { panel } }: { payload: { panel: string[] } },
      { put, call, select },
    ) {
      // 只有一项时无需分组；
      if (panel.length < 2) {
        return;
      }
      let prevPanel: IPanelConfig[] = yield select((state) => state[namespace].panel);
      let panelItem = getGroupRect();

      let idx = R.findIndex<IPanelConfig>((item) => item.id === panel[0])(prevPanel);
      // :bug: 当只有1项时，idx-1 ==0，在最前方添加组
      if (idx == 0) {
        idx = 1;
      }

      let nextPanel = R.insert(idx - 1, panelItem, prevPanel);

      // 设置panel中的id列表的父一级;
      nextPanel = nextPanel.map((item) => {
        if (panel.includes(item.id)) {
          item.group = panelItem.id;
        }
        return item;
      });

      // 重新排序
      nextPanel = reorderPanel(nextPanel);

      yield updatePanel({
        panel: nextPanel,
        call,
        put,
        selectedPanel: [panelItem.id],
        recordHistory: true,
        historyTitle: '组件分组',
      });
    },
    *unGroup({ payload: { id } }: { payload: { id: string } }, { put, call, select }) {
      let prevPanel: IPanelConfig[] = yield select((state) => state[namespace].panel);
      let item = R.find<IPanelConfig>(R.propEq('id', id))(prevPanel);
      const isGroupComponent = item.key === GROUP_COMPONENT_KEY;

      // 当前的groupId,测试是否有空组
      let groupId = item.group;

      let unpackPanel = isGroupComponent
        ? R.reject(R.propEq<string>('id', id))(prevPanel)
        : prevPanel;

      // 支持将组内的数据清除
      unpackPanel = R.map(({ group, ...item }: IPanelConfig) =>
        group === id || (!isGroupComponent && item.id === id) ? item : { group, ...item },
      )(unpackPanel);

      // 判断从组内item取消时，是否有空组;
      if (!isGroupComponent) {
        let unpackItem = R.find(R.propEq<string>('group', groupId))(unpackPanel);
        if (!unpackItem) {
          // 如果存在空组,删除group;
          unpackPanel = R.reject(R.propEq('id', groupId))(unpackPanel);
        }
      }

      yield updatePanel({
        panel: unpackPanel,
        call,
        put,
        selectedPanel: [],
        recordHistory: true,
        historyTitle: '取消组件分组',
      });
    },
    *addPanel({ payload: { panel } }, { put, call, select }) {
      let prevPanel = yield select((state) => state[namespace].panel);
      let panelItem = R.clone(panel);
      // console.log(panel);
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
        // 默认选中最新添加的面板
        selectedPanel: [panel.id],
        recordHistory: true,
        historyTitle: '添加组件 - ' + panelItem.title,
      });
    },
    *removePanel({ payload: { idx } }, { put, call, select }) {
      let prevPanel: IPanelConfig[] = yield select((state) => state[namespace].panel);
      let item = R.find<IPanelConfig>((item) => idx.includes(item.id))(prevPanel);
      // 移除打包组件需要考虑一并移除子组件
      // 此处需要以item.group来判断 ，否则会导致全部删除的bug
      let idList = item?.group ? [...idx, item.group] : idx;
      let nextPanel = R.reject<IPanelConfig>(
        (item) => idList.includes(item.id) || idList.includes(item.group),
      )(prevPanel);

      // 默认选中最新添加的面板
      // yield put({
      //   type: 'setStore',
      //   payload: {
      //   },
      // });
      yield updatePanel({
        panel: nextPanel,
        call,
        put,
        recordHistory: true,
        historyTitle: '删除组件 - ' + item.title,
        selectedPanel: [],
      });
    },
    // 更新第I个面板的属性
    *updatePanelAttrib(
      { payload: { idx, attrib, recordHistory = true, historyTitle = null } },
      { put, call, select },
    ) {
      let panel = yield select((state) => state[namespace].panel);
      let _panel = R.clone(panel);

      if (typeof idx === 'string') {
        let id = R.findIndex(R.propEq('id', idx))(panel);
        let _item: {} = R.nth(id)(panel);
        _item = {
          ..._item,
          ...attrib,
        };
        _panel = R.update(id, _item, panel);
      } else {
        // 更新一组id的属性
        _panel = _panel.map((item) => {
          if (idx.includes(item.id)) {
            return { ...item, ...attrib };
          }
          return item;
        });
      }

      yield updatePanel({
        panel: _panel,
        call,
        put,
        recordHistory,
        historyTitle,
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
        recordHistory: true,
        historyTitle: '复制组件 - ' + _panel[0].title,
      });
      // 页面需要刷新,使用 Editor 添加失败
      window.location.reload();
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // 配置页时才加载信息，首页不加载
        if (['/config', '/config/'].includes(pathname)) {
          if (query.file) {
            dispatch({
              type: 'loadPageOnline',
              payload: {
                file: query.file,
              },
            });
          } else {
            dispatch({
              type: 'loadPanel',
            });
            dispatch({
              type: 'loadPage',
            });
          }

          dispatch({
            type: 'loadBusinessCategory',
          });
        }

        dispatch({
          type: 'setStore',
          payload: { pathname },
        });
      });
    },
  },
};
