import * as React from 'react';
import Moveable, { OnDrag, OnResize } from 'react-moveable';
import styles from './index.less';
import Echarts from '@/component/echarts';
import G2Plot from '@/component/g2plot';

var data = [
  { year: '1851', value: 54 },
  { year: '1852', value: 57 },
  { year: '1853', value: 59 },
  { year: '1854', value: 69 },
  { year: '1855', value: 71 },
  { year: '1856', value: 76 },
  { year: '1857', value: 77 },
];

export default function App() {
  const [frame, setFrame] = React.useState({
    translate: [0, 0],
    rotate: 0,
    transformOrigin: '50% 50%',
  });
  const ref = React.useRef(null);

  const [target, setTarget] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setTarget(document.querySelector<HTMLElement>(`.${styles.target}`)!);
  }, []);
  const [resizable, setResizable] = React.useState(true);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        if (resizable) {
          setResizable(false);
        }
      }}
    >
      <G2Plot
        option={{
          renderer: 'svg',
          autoFit: true,
          appendPadding: 10,
          type: 'line',
          data: data,
          xField: 'year',
          yField: 'value',
          xAxis: { type: 'category' },
          yAxis: {
            label: {
              formatter: function formatter(v) {
                return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                  return ''.concat(s, ',');
                });
              },
            },
          },
        }}
      />
      <Echarts
        option={{
          xAxis: { type: 'category', data: 'abcde'.split('') },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              type: 'line',
              data: [12, 32, 11, 67, 23],
            },
          ],
        }}
      />
      <div
        className={styles.target}
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!resizable) {
            setResizable(true);
          }
        }}
      >
        Target
      </div>
      <Moveable
        target={ref?.current}
        originDraggable={true}
        originRelative={true}
        origin={true}
        onDragOriginStart={({ dragStart }) => {
          dragStart && dragStart.set(frame.translate);
        }}
        onDragOrigin={({ target, drag, transformOrigin }) => {
          frame.translate = drag.beforeTranslate;
          frame.transformOrigin = transformOrigin;
        }}
        draggable={true}
        resizable={true}
        throttleDrag={0}
        startDragRotate={0}
        throttleDragRotate={0}
        zoom={1}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        rotatable={true}
        throttleRotate={0}
        rotationPosition={'top'}
        onDragStart={({ set }) => {
          set(frame.translate);
        }}
        onDrag={({ target, beforeTranslate }) => {
          frame.translate = beforeTranslate;
        }}
        onRotateStart={({ set }) => {
          set(frame.rotate);
        }}
        onRotate={({ beforeRotate }) => {
          frame.rotate = beforeRotate;
        }}
        onResizeStart={({ dragStart }) => {
          dragStart && dragStart.set(frame.translate);
        }}
        onResize={({ target, width, height, drag }) => {
          const beforeTranslate = drag.beforeTranslate;

          frame.translate = beforeTranslate;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
        onRender={({ target }) => {
          const { translate, rotate, transformOrigin } = frame;
          target.style.transformOrigin = transformOrigin;
          target.style.transform =
            `translate(${translate[0]}px, ${translate[1]}px)` + ` rotate(${rotate}deg)`;
        }}
      />
    </div>
  );
}
