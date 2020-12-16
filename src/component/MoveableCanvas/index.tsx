import React, { useState } from 'react';
import styles from './index.less';
import Moveable from 'react-moveable';

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
}
export default ({ children, style, moveable = true }: IMoveableCanvas) => {
  const [translate, setTranslate] = useState([0, 0]);
  const ref = React.useRef(null);
  const [target, setTarget] = React.useState();
  React.useEffect(() => {
    setTarget(ref.current);
  }, []);

  return (
    <div className={styles.moveable_canvas} style={style}>
      <div
        ref={ref}
        style={{
          transform: `translate(${translate[0]}px, ${translate[1]}px)`,
        }}
      >
        {children}
      </div>
      <Moveable
        target={target}
        snappable={true}
        draggable={moveable}
        origin={false}
        onDragStart={({ set }) => {
          set(translate);
        }}
        onDrag={({ target, beforeTranslate }) => {
          setTranslate(beforeTranslate);
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
      />
    </div>
  );
};
