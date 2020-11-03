import React from 'react';
import styles from './index.less';
import MoveableItem from './MoveableItem';
import * as R from 'ramda';
import { connect } from 'dva';
import { ICommon } from '@/models/common';
import ChartItem from './chartItem';
import { Dispatch } from 'redux';
import { IChartConfig } from '../panel/components/db';

interface ICanvasProp {
  panel: IChartConfig[];
  dispatch: Dispatch;
  canvasSize: {
    width: number;
    height: number;
  };
  zoom: number;
  guides: {
    v: number[];
    h: number[];
  };
  [key: string]: any;
}

const Index = ({ canvasSize, zoom, guides, panel, dispatch }: ICanvasProp) => {
  const onResize = (idx: number) => (e) => {
    let prevItem = R.clone(panel);
    let prevStyle = prevItem[idx].style;

    let width = e.width || prevStyle.width;
    let height = e.height || prevStyle.height;
    let rotate = e.rotate || prevStyle.rotate;

    prevItem[idx] = {
      ...prevItem[idx],
      style: {
        ...prevStyle,
        width,
        height,
        rotate,
        transform: e.transform || prevStyle.transform,
      },
    };
    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: prevItem,
      },
    });
  };

  const [resizable, setResizable] = React.useState(true);

  return (
    <div
      className={styles['canvas-panel']}
      style={{ ...canvasSize, transform: `scale(${zoom}) translate(0px, 0px)` }}
      onClick={(e) => {
        e.stopPropagation();
        setResizable(false);
      }}
    >
      {panel.map((item, idx) => (
        <MoveableItem
          zoom={zoom}
          guides={guides}
          canvasSize={canvasSize}
          style={item.style}
          onResize={onResize(idx)}
          key={item.id}
          resizable={resizable}
          onResizable={() => {
            setResizable(true);
          }}
        >
          <ChartItem chartid={item.id} />
        </MoveableItem>
      ))}
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => ({ panel: common.panel }))(Index);
