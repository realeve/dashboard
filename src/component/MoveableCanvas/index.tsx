import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import Moveable from 'react-moveable';
import ZoomIcon from './ZoomIcon';

/**
 * 可拖动的画布
 *
 *  用法  
   <MoveableCanvas style={{ width: 600, height: 300 }}>
    <div
      style={{
        background: `linear-gradient(45deg,#0f0 0%,#f00 100%)`,
        width: 1000,
        height: 800,
      }}
    />
  </MoveableCanvas>

 */
interface IMoveableCanvas {
  /** 内部需要拖拽的画布 */
  children?: React.ReactNode;
  /** 设置外层边框的样式 */
  style?: React.CSSProperties;
  /** 是否可以拖动，在编辑状态下选中父级组件调整大小和位置时会导致当前封装的组件一并拖动 */
  moveable?: boolean;
  /** 是否允许缩放 */
  zoomable?: boolean;
}
export default ({ children, style, moveable = true, zoomable = true }: IMoveableCanvas) => {
  const [translate, setTranslate] = useState([0, 0]);
  const ref = useRef(null);
  const [target, setTarget] = useState();
  useEffect(() => {
    setTarget(ref.current);
  }, []);

  // 缩放时，translate同等进行了变换，需要做计算
  const [zoom, setZoom] = useState(1);

  return (
    <div className={styles.moveable_canvas} style={style}>
      <div
        ref={ref}
        style={{
          transform: `translate(${translate[0] * zoom}px, ${translate[1] * zoom}px) scale(${zoom})`,
        }}
      >
        {children}
      </div>
      <Moveable
        // zoom={zoom}
        target={target}
        snappable={true}
        draggable={moveable}
        origin={false}
        onDragStart={({ set }) => {
          set(translate);
        }}
        onDrag={({ beforeTranslate }) => {
          setTranslate(beforeTranslate);
        }}
      />
      {zoomable && (
        <ZoomIcon
          onChange={setZoom}
          onRestore={() => {
            setTranslate([0, 0]);
          }}
        />
      )}
    </div>
  );
};
