import React, { useState, useEffect } from 'react';
import ScrollBoard from '../scroll_board';
export { apiConfig } from '../scroll_board';
import { config as mainConfig } from '../scroll_board';
export { mock1 as mock } from './mock';
import useFetch from '@/component/hooks/useFetch';
import styles from './index.less';
import ScatterWaffle, { config as detailConfig } from './ScatterWaffle';
import { DEV } from '@/utils/setting';
import { Spin } from 'antd';

let detailType = ['印码', '涂布', '检封', '装箱'];

export const config = [...mainConfig, ...detailConfig];
interface IWaffleState {
  prod?: string;
  gz?: string;
  procname?: string;
}
export default ({
  option: { data: _data, waitTime = 4, carousel = 'page', detailApi, boxSize, boxShape, ...config },
}) => {
  const [state, setState] = useState<IWaffleState>(null);
  let { data, loading, error } = useFetch({
    param: {
      url: DEV ? 'http://localhost:8000/mock/45_waffle.json' : detailApi,
      params: state,
    },
    valid: () => 'undefined' !== typeof state?.prod,
  });

  useEffect(() => {
    if (!_data) {
      return;
    }
    let [prod, gz] = _data.data[0];
    setState({ prod, gz, procname: '印码' });
  }, [_data?.hash]);

  let detailProps = {
    boxSize,
    boxShape,
    y: config.y,
  };

  return (
    <div className={styles.waffleContainer}>
      <ScrollBoard
        style={{ width: '100%', height: '50%' }}
        option={{
          data: _data,
          index: true,
          columnWidth: [50],
          align: ['center'],
          carousel,
          waitTime: waitTime * 1000,
          hoverColumns: [5, 6, 7, 8],
          ...config,
        }}
        onClick={(e) => {
          let type = e.col - 5;
          setState({
            prod: e.data[0],
            gz: e.data[1],
            procname: detailType[type],
          });
        }}
      />
      <Spin spinning={loading}>
        {state && (
          <div className={styles.waffleTitle}>
            {state.prod}品 {state.procname}工序 {state.gz}冠字 生产详情
          </div>
        )}
      </Spin>
      {data && (
        <ScatterWaffle
          {...detailProps}
          prod={state.prod}
          data={data}
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
