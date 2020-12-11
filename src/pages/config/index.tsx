import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useSetState } from 'react-use';

import HeaderComponent from './header';
import ComponentPanel from './panel/components';
import LayerPanel from './panel/LayerPanel';

import HistoryManager from './panel/historyManager';

import Setting, { IHideProps } from './panel/setting';
import Thumbnail from './thumbnail';
// import Toolbox from './toolbox';
import EditSlider from './EditSlider';

import Editor, { getDefaultStyle, generateId, TQuickTool } from '@/component/Editor';
import { connect } from 'dva';
import ChartItem from './canvas/chartItem';
import { IChartConfig } from './panel/components/db';
import { ICommon, GROUP_COMPONENT_KEY, IPage, IPanelConfig } from '@/models/common';
import * as R from 'ramda';

import { Dispatch } from 'redux';
import * as lib from '@/utils/lib';

import localforage from 'localforage';

export interface IPanelItem extends IChartConfig {
  style: React.CSSProperties;
  id: string;
  title: string;
}

// 添加内容
export const addPanel = (
  editor: React.MutableRefObject<Editor>,
  { style, ...config }: IPanelConfig,
) => {
  editor?.current.append(
    <div style={style} className={styles.chartWrapper}>
      <ChartItem chartid={config.id} />
    </div>,
    { id: config.id, name: config.title, style },
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
  panel,
  selectedPanel,
  page,
  curTool,
}: {
  dispatch: Dispatch;
  panel: IPanelConfig[];
  page: IPage;
  selectedPanel: string[];
  curTool: TQuickTool;
}) => {
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

  const editor = React.useRef<Editor>(null);
  const [instance, setInstance] = React.useState<Editor | null>(null);
  useEffect(() => {
    if (instance) {
      return;
    }

    localforage.getItem('zoom').then((e: number) => {
      setZoom(e || 1);
    });

    editor.current && setInstance(editor.current);

    // onMount,载入初始panel
    panel.map((item) => {
      item.key != GROUP_COMPONENT_KEY && addPanel(editor, item);
    });

    // setting selected panel.
    if (panel.length > 0) {
      let lastPanel = R.last<IPanelConfig>(panel);
      let inValid = lastPanel.lock || lastPanel.hide;

      // 如果锁定了或者隐藏，不允许选择
      !inValid &&
        dispatch({
          type: 'common/setStore',
          payload: {
            selectedPanel: [lastPanel.id],
          },
        });
    }
  }, [editor]);

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

  // 选择组件
  useEffect(() => {
    editor?.current.setSelectedTargets(
      editor?.current.viewport.current!.getElements(selectedPanel),
      true,
    );
  }, [selectedPanel.join(',')]);

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
      addPanel(editor, _item);
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
      if (groupIds.length === 1) {
        nextPanel = [...groupIds, ...nextPanel];
      }
    }

    // 移除隐藏或锁定的组件
    return nextPanel.filter((item) => !lockedPanel.includes(item));
  };

  return (
    <div className={styles.editor}>
      <HeaderComponent
        getThumbnail={getThumbnail}
        setHide={setHide}
        hide={hide}
        title={page.title}
        author={page.author}
      />
      <div className={styles.main}>
        <LayerPanel setHide={setHide} hide={hide} onRemove={removePanel} />
        {/* <HistoryManager hide={hide} /> */}
        <ComponentPanel
          setHide={setHide}
          hide={hide}
          onAddPanel={(panel) => {
            const style = getDefaultStyle();
            const nextPanel = { style, ...panel };
            dispatch({
              type: 'common/addPanel',
              payload: { panel: nextPanel },
            });
            addPanel(editor, nextPanel);
          }}
          onAddBusiness={(business) => {
            // 添加一组panel
            dispatch({
              type: 'common/updatePanel',
              payload: { panel: [...panel, ...business] },
            });
            business.forEach((nextPanel) => {
              if (nextPanel.key === GROUP_COMPONENT_KEY) return;
              addPanel(editor, nextPanel);
            });
          }}
        />

        <div className={styles['right-edit-main']}>
          {/* <Toolbox hide={hide} /> */}
          <div className={styles['editor-panel-wp']}>
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
              onChange={(panels) => {
                panels.forEach(({ id: idx, next: style }) => {
                  dispatch({
                    type: 'common/updatePanelAttrib',
                    payload: {
                      idx,
                      attrib: { style },
                    },
                  });
                });
              }}
              // onGuidesChange={e => {
              //   console.log(e, '辅助线');
              // }}
              onDrag={setDragPercent}
            />
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
          </div>
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
        </div>
      </div>
    </div>
  );
};
export default connect(({ common }: { common: ICommon }) => common)(Index);
