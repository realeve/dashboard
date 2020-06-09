import React, { useRef, useEffect } from 'react';
import styles from './ruler.less';
import Guides from '@scena/react-guides';

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

const style = {
  backgroundColor: '#0e1013',
  lineColor: '#364152',
  textColor: '#808e9b',
  unit: 100,
  displayDragPos: true,
  dragPosFormat: e => e - 40,
};

export default ({ zoom, canvasSize }) => {
  const hRuler = useRef();
  const vRuler = useRef();

  useEffect(() => {
    // 偏移
    const offset = -50;
    hRuler?.current?.scroll(offset);
    vRuler?.current?.scroll(offset);
  }, []);

  return (
    <>
      <div className={styles.rulerh}>
        <Guides
          type="horizontal"
          {...style}
          zoom={zoom}
          ref={hRuler}
          style={{ width: canvasSize.width, height: 25 }}
          onChangeGuides={({ guides }) => {
            console.log(guides);
          }}
        />
      </div>
      <div className={styles.rulerv}>
        <Guides
          type="vertical"
          {...style}
          zoom={zoom}
          ref={vRuler}
          style={{ height: canvasSize.height, width: 25 }}
        />
      </div>
      <div className={styles.guide}></div>
    </>
  );
};
