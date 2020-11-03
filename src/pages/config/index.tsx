import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useSetState } from 'react-use';

import HeaderComponent from './header';
import ComponentPanel from './panel/components';
import LayerPanel from './panel/layer';
import BeautyPanel from './panel/beauty';
import FilterPanel from './panel/filterManager';
// import Ruler from './ruler';
import Setting from './panel/setting';
import Thumbnail from './thumbnail';
import Toolbox from './toolbox';
import EditSlider from './EditSlider';
// import CanvasComponent from './canvas';
import Editor, { getDefaultStyle, generateId, TQuickTool } from '@/component/Editor';
import { connect } from 'dva';
import ChartItem from './canvas/chartItem';
import { IChartConfig } from './panel/components/db';
import { ICommon } from '@/models/common';
import * as R from 'ramda';

export interface IPanelItem extends IChartConfig {
  style: React.CSSProperties;
  id: string;
  title: string;
}

// 添加内容
const addPanel = (editor: React.MutableRefObject<Editor>, { style, ...config }: IPanelItem) => {
  editor?.current.append(
    <div style={style}>
      <ChartItem chartid={config.id} />
    </div>,
    { id: config.id, name: config.title, style },
  );
};

const initState = {
  layer: true,
  components: false,
  toolbox: true,
  config: false,
  beauty: true,
  filter: true,
};

const Index = ({ dispatch, panel, selectedPanel, page }) => {
  // 面板默认显示状态设置
  const [hide, setHide] = useSetState(initState);

  useEffect(() => {
    // 存储
    let res = window.localStorage.getItem('panel_show');
    if (!res) {
      return;
    }
    setHide(JSON.parse(res));
  }, []);

  const [hash, setHash] = useState(generateId());

  const [zoom, setZoom] = useState(0.7);

  const editor = React.useRef<Editor>(null);
  const [instance, setInstance] = React.useState<Editor | null>(null);
  useEffect(() => {
    if (instance) {
      return;
    }
    editor.current && setInstance(editor.current);

    // onMount,载入初始panel
    panel.map((item) => {
      addPanel(editor, item);
    });

    // setting selected panel.
    if (panel.length > 0) {
      let lastPanel = R.last(panel);
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
    window.localStorage.setItem('panel_show', JSON.stringify(hide));

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

  // 当前的菜单
  const [curTool, setCurTool] = useState<TQuickTool>('MoveTool');

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
  };

  return (
    <div className={styles.editor}>
      <HeaderComponent setHide={setHide} hide={hide} />
      <div className={styles.main}>
        <LayerPanel setHide={setHide} hide={hide} onRemove={removePanel} />
        <BeautyPanel setHide={setHide} hide={hide} />
        <FilterPanel setHide={setHide} hide={hide} />
        <ComponentPanel
          setHide={setHide}
          hide={hide}
          onAddPanel={(panel) => {
            const style = getDefaultStyle();
            const nextPanel = { ...panel, style };
            dispatch({
              type: 'common/addPanel',
              payload: { panel: nextPanel },
            });
            addPanel(editor, nextPanel);
          }}
        />

        <div className={styles['right-edit-main']}>
          <Toolbox hide={hide} />
          <div className={styles['editor-panel-wp']}>
            <Editor
              ref={editor}
              debug={true}
              zoom={zoom}
              onZoom={setZoom}
              domHash={hash}
              curTool={curTool}
              setCurTool={setCurTool}
              onRemove={removePanel}
              background={page.background}
              width={page.width}
              height={page.height}
              lockedPanel={panel.filter((item) => item.lock || item.hide).map((item) => item.id)}
              onSelect={(panels) => {
                dispatch({
                  type: 'common/setStore',
                  payload: {
                    selectedPanel: panels,
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
            <Thumbnail visible={thumbVisible} zoom={zoom} dragPercent={dragPercent} />
          </div>
          <EditSlider
            zoom={zoom}
            onZoom={setZoom}
            editor={instance}
            onMenuChange={setCurTool}
            curTool={curTool}
            onToggleThumb={() => {
              toggleThumb(!thumbVisible);
            }}
          />
        </div>
        <Setting
          setHide={setHide}
          hide={hide}
          onChange={(e, type) => {
            // 调整大小
            if (type === 'size') {
              let key = Object.keys(e);
              editor?.current.setProperty(key, Object.values(e)[0] + 'px', true);
            }
            console.log(e, type);
          }}
        />
      </div>
    </div>
  );
};
export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  selectedPanel: common.selectedPanel,
  page: common.page,
}))(Index);
