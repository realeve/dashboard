import React, { useEffect, useState, Suspense } from 'react';
import styles from './index.less';
import { useSetState, useDebounce } from 'react-use';
import HeaderComponent from './header';
import type { IHideProps } from './panel/setting';
import { getDefaultStyle } from '@/component/Editor/lib';
import type { TQuickTool } from '@/component/Editor/types';
import { generateId } from '@/component/Editor/utils/utils';
import ChartItem from './canvas/chartItem';
import type { IChartConfig } from './panel/components/db';
import { connect } from 'react-redux';
import type { ICommon, IPage, IPanelConfig } from '@/models/common';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';
import * as R from 'ramda';

import type { Dispatch } from 'redux';
import * as lib from '@/utils/lib';

import localforage from 'localforage';

import { calcPanelPosition } from './lib';
import classnames from 'classnames';
import { Spin } from 'Antd';
import { Prompt } from 'umi';

const Editor = React.lazy(() => import('@/component/Editor/Editor'));
const ComponentPanel = React.lazy(() => import('./panel/components'));
const LayerPanel = React.lazy(() => import('./panel/LayerPanel'));
const Setting = React.lazy(() => import('./panel/setting'));
const Thumbnail = React.lazy(() => import('@/component/Editor/Thumbnail/'));
const EditSlider = React.lazy(() => import('./EditSlider'));

export type IPanelItem = {
  style: React.CSSProperties;
  id: string;
  title: string;
} & IChartConfig;

// 添加组件
// 当属性名中有 scenaIgnore 时，禁止selectTo选中
export const addPanel = (
  editor: React.MutableRefObject<any>,
  { style: _style, ...config }: IPanelConfig,
) => {
  if (config.key === GROUP_COMPONENT_KEY) {
    return;
  }
  const { 'transform-origin': transformOrigin, ...style } = _style;

  editor?.current?.append(
    <div
      className={classnames(styles.chartWrapper, {
        scenaIgnore: SCREEN_EDGE_KEY === config.key,
      })}
      style={{ ...R.omit(['transform'], style), transformOrigin }}
    >
      <ChartItem chartid={config.id} />
    </div>,
    { id: config.id, name: config.title, style, type: config.key },
  );
};

const initState: IHideProps = {
  layer: true,
  components: false,
  toolbox: false,
  config: false,
};

const Index = ({
  dispatch,
  curHistoryIdx,
  selectedPanel,
  page,
  curTool,
  history,
  panel: _panel,
}: {
  panel: IPanelConfig[];
  dispatch: Dispatch;
  history: { panel: IPanelConfig[]; title: string | null }[];
  curHistoryIdx: number;
  page: IPage;
  selectedPanel: string[];
  curTool: TQuickTool;
}) => {
  const panel = history[curHistoryIdx]?.panel || _panel;
  const panelIds = R.pluck('id', panel);

  // 面板默认显示状态设置
  const [hide, setHide] = useSetState(initState);

  useEffect(() => {
    // 存储
    localforage.getItem<IHideProps>('panel_show').then((res) => {
      res && setHide(res);
    });
  }, []);

  const [hash, setHash] = useState(() => generateId());

  const [zoom, setZoom] = useState(0.7);

  const updateZoom = (nextZoom: number) => {
    localforage.setItem('zoom', nextZoom);
    setZoom(nextZoom);
  };

  const editor = React.useRef<any>(null);
  const [instance, setInstance] = React.useState<any | null>(null);

  // 当前editor上的keys

  const [panelKeys, setPanelKeys] = useState<string[]>([]);

  const initPanel = () => {
    if (!editor?.current) {
      return;
    }
    // onMount,载入初始panel
    let nextKeys = panelKeys.slice();
    panel.forEach((item) => {
      if (nextKeys.includes(item.id)) {
        return;
      }
      nextKeys = [...nextKeys, item.id];
      addPanel(editor, item);
    });
    // console.log({ nextKeys, panelIds });
    nextKeys = R.uniq(nextKeys);
    // 每次添加后，都设置为最近一次的panelId
    setPanelKeys(nextKeys);
  };
  useEffect(initPanel, [panelIds.join(',')]);

  const initSelectedPanel = () => {
    editor?.current?.setSelectedTargets(
      editor?.current.viewport.current!.getElements(selectedPanel),
      true,
    );
  };
  // 选择组件
  useEffect(initSelectedPanel, [selectedPanel.join(',')]);

  useEffect(() => {
    if (!editor.current || instance) {
      return;
    }
    localforage.getItem('zoom').then((e: number) => {
      setZoom(e || 1);
    });
    setInstance(editor.current);
    initSelectedPanel();
    initPanel();
  }, [editor.current]);

  // const [prevHistory, setPrevHistory] = useState(curHistoryIdx);
  // useEffect(() => {
  //   setPrevHistory(curHistoryIdx);
  //   if (prevHistory < curHistoryIdx) {
  //     return;
  //   }
  //   console.log('需要清空');
  //   console.log('添加对应的panel');
  // }, [curHistoryIdx]);

  useEffect(() => {
    // 页面动画变更完后再变更hash, CSS动画执行时长为300ms,增加10ms再执行
    const tid = window.setTimeout(() => {
      // 记录页面有变更
      setHash(generateId());
    }, 310);

    // 存储
    localforage.setItem('panel_show', hide);

    return () => {
      window.clearTimeout(tid);
    };
  }, [hide]);

  // 更新当前的菜单
  const setCurTool = (tool: TQuickTool) => {
    let append = {};
    if (tool === 'hand') {
      append = { selectedPanel: [] };
    }
    dispatch({
      type: 'common/setStore',
      payload: {
        curTool: tool,
        ...append,
      },
    });
  };

  // 拖动的相对距离
  const [dragPercent, setDragPercent] = useState({ x: 0, y: 0 });

  const [thumbVisible, toggleThumb] = useState(true);

  const removePanel = (idx: string[]) => {
    editor?.current.removeByIds(idx);
    dispatch({
      type: 'common/removePanel',
      payload: {
        idx,
      },
    });

    // 移除记录的id列表
    const _panelKeys = R.reject<string>((item) => idx.includes(item))(panelKeys);
    setPanelKeys(_panelKeys);
  };

  /**
   * 面板中复制组件
   * @param ids id列表
   */
  const onPaste = (ids: string[]) => {
    // 粘贴添加组件
    const newPanel: IPanelConfig[] = [];
    ids.forEach((id) => {
      const item = R.find<IPanelConfig>(R.propEq<string>('id', id))(panel);
      const _item = { ...item, id: lib.noncer() };
      // addPanel(editor, _item);
      newPanel.push(_item);
    });
    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: [...panel, ...newPanel],
      },
    });
  };

  const getThumbnail = (scale: number = 0.2, filename) =>
    editor.current.getThumbnail(scale / zoom, 0.8, filename);

  const getLockedPanel = () =>
    panel.filter((item) => item.lock || item.hide).map((item) => item.id);

  const calcNextSelectedPanel = (curSelectedPanel: string[]) => {
    // 此处处理多个组件共同选择的问题；
    let nextPanel = curSelectedPanel;
    const lockedPanel = getLockedPanel();
    if (curSelectedPanel.length > 0) {
      // 2020-11-11 group所在ID的组件需要一并被选择
      let groupIds: string[] = [];

      panel.forEach((item) => {
        if (curSelectedPanel.includes(item.id) && item.group) {
          const items = panel.filter((p) => p.group === item.group);
          const groupPanel = items.map((p) => p.id);
          const groupId = items.map((p) => p.group);
          nextPanel = [...nextPanel, ...groupPanel];
          groupIds = [...groupIds, ...groupId];
        }
      });
      nextPanel = R.uniq(nextPanel);
      groupIds = R.uniq(groupIds).filter((item) => item);

      // 需判断当前groupId下是否只有1项
      const arr = panel.filter((p) => groupIds.includes(p.group));
      if (groupIds.length === 1 && arr.length > 1) {
        nextPanel = [...groupIds, ...nextPanel];
      }
    }

    // 移除隐藏或锁定的组件
    const nextSelectedPanel = nextPanel.filter((item) => !lockedPanel.includes(item));
    return R.uniq(nextSelectedPanel);
  };

  const [changedPanel, setChangedPanel] = useState([]);

  useDebounce(
    () => {
      changedPanel.forEach(({ id: idx, next: style }) => {
        dispatch({
          type: 'common/updatePanelAttrib',
          payload: {
            idx,
            attrib: { style },
            recordHistory: true,
            historyTitle: '调整位置/尺寸',
          },
        });
      });
    },
    500,
    [changedPanel],
  );

  // 载入json配置文件手动编辑
  const onLoadConfig = ({ page: localPage, panel: localPanel }) => {
    dispatch({
      type: 'common/setStore',
      payload: {
        page: localPage,
        panel: localPanel,
        history: [],
        curHistoryIdx: 0,
        recordHistory: false,
      },
    });
  };

  /** 被遮挡区域的总宽度 */
  const hideWidth = React.useMemo(() => {
    let width = 30;
    if (!hide.layer) {
      width += 200;
    }
    if (!hide.components) {
      width += 233;
    }
    if (!hide.config) {
      width += 332;
    }
    return width;
  }, [hide]);

  return (
    <div className={styles.editor}>
      <Prompt message="确定要离开本页面？当前的配置项系统已自动保存" />
      <HeaderComponent
        getThumbnail={getThumbnail}
        setHide={setHide}
        hide={hide}
        title={page.title}
        author={page.author}
        onLoadConfig={onLoadConfig}
      />
      <div className={styles.main}>
        <Suspense fallback={<Spin spinning />}>
          <LayerPanel setHide={setHide} hide={hide} onRemove={removePanel} />
        </Suspense>
        {/* <HistoryManager hide={hide} /> */}
        <Suspense fallback={<Spin spinning />}>
          <ComponentPanel
            setHide={setHide}
            hide={hide}
            onAddPanel={(newPanel) => {
              const autoStyle = calcPanelPosition({ panel, page });
              // console.log(autoStyle);
              const style = getDefaultStyle(autoStyle);
              // 2020-12-12 根据当前的panel项自动计算合适的位置
              const nextPanel = { style, ...newPanel };
              dispatch({
                type: 'common/addPanel',
                payload: { panel: nextPanel },
              });
              // addPanel(editor, nextPanel);
            }}
            onAddBusiness={(business) => {
              // 添加一组panel
              dispatch({
                type: 'common/updatePanel',
                payload: {
                  panel: [...panel, ...business],
                  recordHistory: true,
                  historyTitle: `添加业务组件 - ${business[0].title}`,
                },
              });
              // business.forEach((nextPanel) => {
              //   addPanel(editor, nextPanel);
              // });
            }}
          />
        </Suspense>

        <div className={styles['right-edit-main']}>
          {/* <Toolbox hide={hide} /> */}
          <div className={styles['editor-panel-wp']}>
            <Suspense fallback={<Spin spinning />}>
              <Editor
                ref={editor}
                dispatch={dispatch}
                debug={true}
                zoom={zoom}
                onZoom={updateZoom}
                domHash={hash}
                selectMenu={setCurTool}
                curTool={curTool}
                setCurTool={setCurTool}
                onRemove={removePanel}
                onPaste={onPaste}
                // background={page.background}
                // width={page.width}
                // height={page.height}
                page={page}
                hideWidth={hideWidth}
                lockedPanel={getLockedPanel()}
                calcNextSelectedPanel={calcNextSelectedPanel}
                onSelect={(nextPanel) => {
                  dispatch({
                    type: 'common/setStore',
                    payload: {
                      selectedPanel: calcNextSelectedPanel(nextPanel),
                    },
                  });
                }}
                onChange={setChangedPanel}
                // onGuidesChange={e => {
                //   console.log(e, '辅助线');
                // }}
                onDrag={setDragPercent}
              />
            </Suspense>
            <Suspense fallback={<Spin spinning />}>
              <Thumbnail
                onScroll={(e) => {
                  editor?.current?.scrollTo(e);
                }}
                panel={panel}
                page={page}
                visible={thumbVisible && !hide.toolbox}
                zoom={zoom}
                dragPercent={dragPercent}
                showConfig={!hide.config}
              />
            </Suspense>
          </div>
          <Suspense fallback={<Spin spinning />}>
            <EditSlider
              zoom={zoom}
              onZoom={updateZoom}
              editor={instance}
              onMenuChange={setCurTool}
              curTool={curTool}
              onToggleThumb={() => {
                toggleThumb(!thumbVisible);
              }}
              hide={hide.toolbox}
              showConfig={!hide.config}
            />
          </Suspense>

          <Suspense fallback={<Spin spinning />}>
            <Setting
              setHide={setHide}
              hide={hide}
              onChange={(e, type) => {
                // 调整大小
                if (type === 'size') {
                  const key = Object.keys(e);
                  editor?.current.setProperty(key, `${Object.values(e)[0]}px`, true);
                }
                // console.log(e, type);
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default connect(({ common }: { common: ICommon }) => common)(Index);
