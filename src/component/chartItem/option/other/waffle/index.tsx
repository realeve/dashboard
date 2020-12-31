import React, { useState, useEffect } from 'react';
import ScrollBoard, { IScrollBoard } from '../scroll_board';
import { config as mainConfig } from '../scroll_board';
import useFetch from '@/component/hooks/useFetch';
import styles from './index.less';
import ScatterWaffle, { config as detailConfig } from './ScatterWaffle';
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

const ScrollTable = ({ config, onClick }) => {
  const detailType = ['印码', '涂布', '检封', '装箱'];
  return (
    <ScrollBoard
      style={{ width: '100%', height: '50%' }}
      option={{
        hoverColumns: [5, 6, 7, 8],
        ...config,
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
  option: { detailApi, boxSize, boxShape, ...config },
}: {
  option: IWaffleProps;
}) => {
  const [state, setState] = useState<IWaffleState>(null);
  useEffect(() => {
    if (!config.data) {
      return;
    }
    const [prod, gz] = config.data.data[0] as [string, string];
    setState({ prod, gz, procname: '印码' });
  }, [config?.data?.hash]);

  const { data, loading } = useFetch({
    param: {
      url: DEV ? 'http://localhost:8000/mock/45_waffle.json' : detailApi,
      params: state,
    },
    valid: () => typeof state?.prod !== 'undefined',
  });

  return (
    <div className={styles.waffleContainer}>
      <ScrollTable config={config} onClick={setState} />
      <Spin spinning={loading}>
        {state && (
          <div className={styles.waffleTitle}>
            {state.prod}品 {state.procname}工序 {state.gz}冠字 生产详情
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
          y={config.y}
          prod={state.prod}
          style={{ height: 'auto', flex: 1 }}
        />
      )}
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
