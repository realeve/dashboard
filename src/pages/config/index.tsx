import React, { useEffect, useState, Suspense } from 'react';
import styles from './index.less';
import { useSetState } from 'react-use';
import HeaderComponent from './header';
import { IHideProps } from './panel/setting';
import { getDefaultStyle } from '@/component/Editor/lib';
import { TQuickTool } from '@/component/Editor/types';
import { generateId } from '@/component/Editor/utils/utils';
import { connect } from 'dva';
import ChartItem from './canvas/chartItem';
import { IChartConfig } from './panel/components/db';
import {
  ICommon,
  GROUP_COMPONENT_KEY,
  SCREEN_EDGE_KEY,
  IPage,
  IPanelConfig,
} from '@/models/common';
import * as R from 'ramda';

import { Dispatch } from 'redux';
import * as lib from '@/utils/lib';

import localforage from 'localforage';

import { useDebounce } from 'react-use';

import { calcPanelPosition } from './lib';
import classnames from 'classnames';
import { Spin } from 'Antd';

const Editor = React.lazy(() => import('@/component/Editor/Editor'));
const ComponentPanel = React.lazy(() => import('./panel/components'));
const LayerPanel = React.lazy(() => import('./panel/LayerPanel'));
const Setting = React.lazy(() => import('./panel/setting'));
const Thumbnail = React.lazy(() => import('@/component/Editor/Thumbnail/'));
const EditSlider = React.lazy(() => import('./EditSlider'));

export interface IPanelItem extends IChartConfig {
  style: React.CSSProperties;
  id: string;
  title: string;
}

// 添加组件
// 当属性名中有 scenaIgnore 时，禁止selectTo选中
export const addPanel = (
  editor: React.MutableRefObject<any>,
  { style, ...config }: IPanelConfig,
) => {
  if (config.key === GROUP_COMPONENT_KEY) {
    return;
  }
  editor?.current?.append(
    <div
      className={classnames(styles.chartWrapper, {
        scenaIgnore: SCREEN_EDGE_KEY == config.key,
      })}
      style={style}
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
  let panel = history[curHistoryIdx]?.panel || _panel;
  let panelIds = R.pluck('id', panel);

  // 面板默认显示状态设置
  const [hide, setHide] = useSetState(initState);

  useEffect(() => {
    // 存储
    localforage.getItem<IHideProps>('panel_show').then((res) => {
      res && setHide(res);
    });
  }, []);

  const [hash, setHash] = useState(generateId());

  const [zoom, setZoom] = useState(0.7);

  const updateZoom = (zoom: number) => {
    localforage.setItem('zoom', zoom);
    setZoom(zoom);
  };

  const editor = React.useRef<any>(null);
  const [instance, setInstance] = React.useState<any | null>(null);

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

  const initSelectedPanel = () => {
    editor?.current?.setSelectedTargets(
      editor?.current.viewport.current!.getElements(selectedPanel),
      true,
    );
  };

  useEffect(initPanel, [panelIds.join(',')]);

  // 选择组件
  useEffect(initSelectedPanel, [selectedPanel.join(',')]);

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
  const setCurTool = (curTool: TQuickTool) => {
    let append = {};
    if (curTool == 'hand') {
      append = { selectedPanel: [] };
    }
    dispatch({
      type: 'common/setStore',
      payload: {
        curTool,
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
    // 更新缩略图
    editor?.current.updateThumbnail();

    // 移除记录的id列表
    let _panelKeys = R.reject<string>((item) => idx.includes(item))(panelKeys);
    setPanelKeys(_panelKeys);
  };

  /**
   * 面板中复制组件
   * @param ids id列表
   */
  const onPaste = (ids: string[]) => {
    // 粘贴添加组件
    let newPanel: IPanelConfig[] = [];
    ids.forEach((id) => {
      let item = R.find<IPanelConfig>(R.propEq<string>('id', id))(panel);
      let _item = { ...item, id: lib.noncer() };
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

  const calcNextSelectedPanel = (selectedPanel) => {
    // 此处处理多个组件共同选择的问题；
    let nextPanel = selectedPanel;
    let lockedPanel = getLockedPanel();
    if (selectedPanel.length > 0) {
      // 2020-11-11 group所在ID的组件需要一并被选择
      let groupIds: string[] = [];

      panel.filter((item) => {
        if (selectedPanel.includes(item.id) && item.group) {
          let items = panel.filter((p) => p.group == item.group);
          let groupPanel = items.map((p) => p.id);
          let groupId = items.map((p) => p.group);
          nextPanel = [...nextPanel, ...groupPanel];
          groupIds = [...groupIds, ...groupId];
        }
      });
      nextPanel = R.uniq(nextPanel);
      groupIds = R.uniq(groupIds).filter((item) => item);

      // 需判断当前groupId下是否只有1项
      let arr = panel.filter((p) => groupIds.includes(p.group));
      if (groupIds.length === 1 && arr.length > 1) {
        nextPanel = [...groupIds, ...nextPanel];
      }
    }

    // 移除隐藏或锁定的组件
    let nextSelectedPanel = nextPanel.filter((item) => !lockedPanel.includes(item));
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
            recordHistory: false,
          },
        });
      });
      // 更新缩略图
      editor?.current.updateThumbnail();
    },
    500,
    [changedPanel],
  );

  // 载入json配置文件手动编辑
  const onLoadConfig = ({ page, panel }) => {
    dispatch({
      type: 'common/setStore',
      payload: {
        page,
        panel,
        history: [],
        curHistoryIdx: 0,
        recordHistory: false,
      },
    });
  };

  return (
    <div className={styles.editor}>
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
              let autoStyle = calcPanelPosition({ panel, page });
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
                  historyTitle: '添加业务组件 - ' + business[0].title,
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
                lockedPanel={getLockedPanel()}
                calcNextSelectedPanel={calcNextSelectedPanel}
                onSelect={(selectedPanel) => {
                  dispatch({
                    type: 'common/setStore',
                    payload: {
                      selectedPanel: calcNextSelectedPanel(selectedPanel),
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
                  let key = Object.keys(e);
                  editor?.current.setProperty(key, Object.values(e)[0] + 'px', true);
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
