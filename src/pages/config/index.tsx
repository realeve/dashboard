import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useSetState } from 'react-use';

import HeaderComponent from './header';
import ComponentPanel from './panel/components';
import LayerPanel from './panel/layer';
import BeautyPanel from './panel/beauty';
import FilterPanel from './panel/filterManager';
import Ruler from './ruler';
import Setting from './panel/setting';
import Thumbnail from './thumbnail';
import Toolbox from './toolbox';
import EditSlider from './EditSlider';
import CanvasComponent from './canvas';
import Editor, { generateId, KeyboardIcon } from '@/component/Editor';
import { connect } from 'dva';

const Index = ({ dispatch }) => {
  const [hide, setHide] = useSetState({
    layer: false,
    components: false,
    toolbox: true,
    config: true,
    beauty: true,
    filter: true,
  });

  const [zoom, setZoom] = useState(0.7);
  const [canvasSize, setCanvasSize] = useSetState({
    width: 1920,
    height: 1080,
  });

  const [guides, setGuides] = useState({
    v: [],
    h: [],
  });

  const editor = React.useRef<Editor>(null);
  const [instance, setInstance] = React.useState<Editor | null>(null);
  useEffect(() => {
    if (instance) {
      return;
    }
    editor.current && setInstance(editor.current);
  }, [editor]);

  return (
    <div className={styles.editor}>
      <HeaderComponent setHide={setHide} hide={hide} />
      <div className={styles.main}>
        <LayerPanel setHide={setHide} hide={hide} />
        <BeautyPanel setHide={setHide} hide={hide} />
        <FilterPanel setHide={setHide} hide={hide} />
        <ComponentPanel
          setHide={setHide}
          hide={hide}
          onAddPanel={panel => {
            dispatch({
              type: 'common/addPanel',
              payload: { panel },
            });
          }}
        />

        <div className={styles['right-edit-main']}>
          <Toolbox hide={hide} />
          <div className={styles['editor-panel-wp']}>
            {/* <Ruler zoom={zoom} canvasSize={canvasSize} onGuidesChange={setGuides} /> */}
            {/* <CanvasComponent zoom={zoom} canvasSize={canvasSize} guides={guides} /> */}
            <Editor
              ref={editor}
              debug={true}
              zoom={zoom}
              onRemove={e => {
                console.log('移除', e);
              }}
              onSelect={e => {
                console.log('选中了', e);
              }}
              onChange={e => {
                console.log('变更', e);
              }}
            />
            <Thumbnail zoom={zoom} />
          </div>
          <EditSlider />
        </div>
        <Setting setHide={setHide} hide={hide} />
      </div>
    </div>
  );
};
export default connect()(Index);
