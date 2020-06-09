import Ruler from '@scena/ruler';
import React, { useRef, useEffect } from 'react';
import styles from './ruler.less';
import { useSetState } from 'react-use';

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
      textFormat: res => {
        return res % 100 === 0 ? String(res) : '';
      },
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
        <div ref={hRuler} style={{ width: canvasSize.width }} />
      </div>
      <div className={styles.rulerv}>
        <div ref={vRuler} style={{ height: canvasSize.height }} />
      </div>
      <div className={styles.guide} />
    </>
  );
};
