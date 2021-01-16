import { useRef, useEffect } from 'react';
import * as zrender from 'zrender/esm/zrender';
// import 'zrender/esm/canvas/canvas';
import 'zrender/esm/svg/svg';
import Rect from 'zrender/lib/graphic/shape/Rect';
// import { Rect } from 'echarts/lib/util/graphic';
// import * as graphic from 'echarts/lib/util/graphic';
export default () => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const zr = zrender.init(ref.current, { renderer: 'svg', width: 1000, height: 600 });

    console.log(zr.painter.getType());
    const rect = new Rect({
      shape: {
        x: 150,
        y: 50,
        width: 600,
        height: 400,
      },
      style: {
        fill: '#aa333e',
        stroke: '#22ff34',
      },
      silent: true,
    });

    zr.add(rect);

    zr.add(
      new Rect({
        shape: {
          x: 0,
          y: 0,
          width: 400,
          height: 500,
        },
        style: {
          fill: '#f23',
        },
      }),
    );
  }, []);

  return <div ref={ref} style={{ width: '100%', height: '100vh', color: '#fff', fontSize: 25 }} />;
};
