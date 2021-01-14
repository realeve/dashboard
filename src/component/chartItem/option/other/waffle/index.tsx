import React, { useState, useEffect } from 'react';
import ScrollBoard from '../scroll_board';
import { config as mainConfig } from '../scroll_board';
import useFetch from '@/component/hooks/useFetch';
import styles from './index.less';
import ScatterWaffle, { config as detailConfig, statusColor } from './ScatterWaffle';
import { DEV } from '@/utils/setting';
import { Spin } from 'antd';

export { apiConfig } from '../scroll_board';
export { mock1 as mock } from './mock';

export const config = [...mainConfig, ...detailConfig];
interface IWaffleState {
  prod?: string;
  gz?: string;
  procname?: string;
}

const ScrollTable = ({ config: props, onClick, style }) => {
  const detailType = ['印码', '涂布', '检封', '装箱'];
  return (
    <ScrollBoard
      style={style}
      option={{
        hoverColumns: [5, 6, 7, 8],
        ...props,
      }}
      onClick={(e) => {
        const type = e.col - 5;
        onClick({
          prod: e.data[0],
          gz: e.data[1],
          procname: detailType[type],
        });
      }}
    />
  );
};

export interface IBoxProp {
  boxSize: number;
  boxShape: 'circle' | 'rect' | 'roundRect';
  detailApi: string;
}
type IWaffleProps = Record<string, any>;
export default ({
  option: { detailApi, boxSize, boxShape, ...props },
}: {
  option: IWaffleProps;
}) => {
  const [state, setState] = useState<IWaffleState>(null);
  useEffect(() => {
    if (!props.data) {
      return;
    }
    const [prod, gz] = props.data.data[0] as [string, string];
    setState({ prod, gz, procname: '印码' });
  }, [props?.data?.hash]);

  const { data, loading } = useFetch({
    param: {
      url: DEV ? 'http://localhost:8000/mock/45_waffle.json' : detailApi,
      params: state,
    },
    valid: () => typeof state?.prod !== 'undefined',
  });

  const boxStyle = { width: boxSize, height: boxSize };

  return (
    <div className={styles.waffleContainer} style={{ height: '100%' }}>
      <ScrollTable
        config={props}
        onClick={setState}
        style={{ width: '100%', height: `calc(100% - ${boxSize * 12 + 80}px )` }}
      />
      <div className={styles.detailContainer} style={{ height: boxSize * 12 + 80 }}>
        <Spin spinning={loading}>
          {state && (
            <div className={styles.waffleTitle}>
              <span>
                {state.prod}品 {state.procname}工序 {state.gz}冠字 生产详情
              </span>
              <div className={styles.legend} style={{ fontSize: props.fontSize || 12 }}>
                <div className={styles.legendItem}>
                  <div
                    className={styles.dot}
                    style={{ backgroundColor: statusColor[1], ...boxStyle }}
                  ></div>
                  正常
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.dot}
                    style={{ backgroundColor: statusColor[2], ...boxStyle }}
                  ></div>
                  跳号
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.dot}
                    style={{ backgroundColor: statusColor[0], ...boxStyle }}
                  ></div>
                  未生产
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.dot}
                    style={{ backgroundColor: statusColor[3], ...boxStyle }}
                  ></div>
                  未印码
                </div>
              </div>
            </div>
          )}
        </Spin>
        {data && (
          <ScatterWaffle
            {...{
              boxSize,
              boxShape,
              data,
            }}
            y={props.y}
            prod={state.prod}
            style={{ height: '100%', flex: 1 }}
          />
        )}
      </div>
    </div>
  );
};

// option={{
//   data,
//   x: 0,
//   y: 1,
//   legend: 2,
//   cart: 3,
//   direction: 'vertical',
//   padding: 0,
//   wrap: false,
//   alignContent: false,
//   boxSize: 16,
//   boxMargin: 2,
//   boxBorderRadius: 8,
//   gzMode: true,
//   zoomable: false,
//   intervalTooltip: true,
//   moveable: false,
// }}
