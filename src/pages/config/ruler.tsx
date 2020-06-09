import Ruler from '@scena/ruler';
import React, { useRef, useEffect } from 'react';
import styles from './ruler.less';
import { useSetState } from 'react-use';

/**
 * ruler组件：
 *  defaultProps = {
        type: "horizontal",
        zoom: 1,
        width: 0,
        height: 0,
        unit: 50,
        direction: "end",
        style: { width: "100%", height: "100%" },
        backgroundColor: "#333333",
        textColor: "#ffffff",
        lineColor: "#777777",
    }
 */
export default ({ zoom, canvasSize }) => {
  const hRuler = useRef();
  const vRuler = useRef();

  const [ruler, setRuler] = useSetState({
    h: null,
    v: null,
  });

  useEffect(() => {
    const offset = -50;
    const style = {
      backgroundColor: '#0e1013',
      lineColor: '#364152',
      textColor: '#808e9b',
      zoom,
      unit: 100,
    };

    const h = new Ruler(hRuler.current, {
      type: 'horizontal',
      height: 25,
      ...style,
    });

    const v = new Ruler(vRuler.current, {
      type: 'vertical',
      width: 25,
      ...style,
    });

    // 偏移
    h.scroll(offset);
    v.scroll(offset);

    setRuler({
      h,
      v,
    });
  }, []);

  return (
    <>
      <div className={styles.rulerh}>
        <div ref={hRuler} style={{ width: canvasSize.width, height: 20 }} />
      </div>
      <div className={styles.rulerv}>
        <div ref={vRuler} style={{ height: canvasSize.height, width: 20 }} />
      </div>
      <div className={styles.guide} />
    </>
  );
};
