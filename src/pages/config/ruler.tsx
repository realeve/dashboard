import React, { useRef, useEffect } from 'react';
import styles from './ruler.less';
// import Guides from '@scena/react-guides';

import Guides from '@/component/react-guides';
import { useSetState, useToggle } from 'react-use';

const style = {
  backgroundColor: '#0e1013',
  lineColor: '#364152',
  textColor: '#808e9b',
  unit: 100,
  dragPosFormat: e => e - 44,
};

const key = 'datav_guide';
const guideDb = {
  save: e => window.localStorage.setItem(key, JSON.stringify(e)),
  load: canvasSize =>
    JSON.parse(
      window.localStorage.getItem(key) ||
        `{v:[${canvasSize.width / 2 + 44}],h:[${canvasSize.height / 2 + 44}]}`,
    ),
};

export interface IRulerProps {
  zoom?: number;
  canvasSize: {
    width: number;
    height: number;
  };
}

interface IGuideProps {
  h: number[];
  v: number[];
}

export default ({ zoom = 1, canvasSize,  ...props}: IRulerProps) => {
  const hRuler = useRef();
  const vRuler = useRef();

  const [guides, setGuides] = useSetState<IGuideProps>({
    v: [canvasSize.width / 2 + 40],
    h: [canvasSize.height / 2 + 40],
  });

  const loadGuides = () => {
    setTimeout(() => {
      let initGuides: IGuideProps = guideDb.load(canvasSize);
      hRuler?.current?.loadGuides(initGuides.h);
      vRuler?.current?.loadGuides(initGuides.v);
      props?.onGuidesChange?.(initGuides);
    }, 0);
  };

  useEffect(() => {
    // 偏移
    const offset = -50;
    hRuler?.current?.scroll(offset);
    vRuler?.current?.scroll(offset);
    loadGuides();
  }, []);

  const [guideVisible, toogleGuide] = useToggle(true);
  useEffect(() => {
    hRuler?.current?.loadGuides(guideVisible ? guides.h : []);
    vRuler?.current?.loadGuides(guideVisible ? guides.v : []);
  }, [guideVisible]);

  return (
    <>
      <div className={styles.rulerh}>
        <Guides
          type="horizontal"
          {...style}
          zoom={zoom}
          ref={hRuler}
          style={{ width: canvasSize.width, height: 25 }}
          onChangeGuides={({ guides: h }) => {
            guideDb.save({ ...guides, h });
            setGuides({ h });
            onGuidesChange({ ...guides, h });
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
          onChangeGuides={({ guides: v }) => {
            setGuides({ v });
            guideDb.save({ ...guides, v });
            onGuidesChange({ ...guides, v });
          }}
        />
      </div>
      <div className={styles.guide}>
        <i
          className={`datav-icon datav-font icon-line-${guideVisible ? 'show' : 'hide'}`}
          style={{ zIndex: 10 }}
          onClick={toogleGuide}
        />
      </div>
    </>
  );
};
