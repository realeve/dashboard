import React, { useState, useEffect } from 'react';
import ScrollBoard from '../scroll_board';
export { config, apiConfig } from '../scroll_board';
export { mock1 as mock } from './mock';
import useFetch from '@/component/hooks/useFetch';
import styles from './index.less';
import Waffle from './waffle';

let detailType = ['印码', '涂布', '检封', '装箱'];

interface IWaffleState {
  prod?: string;
  gz?: string;
  detail?: string;
}
export default ({ option: { data: _data, waitTime = 4, carousel = 'page', ...config } }) => {
  const [state, setState] = useState<IWaffleState>(null);
  let { data, loading, error } = useFetch({
    param: {
      url: 'http://localhost:8000/mock/45_waffle.json',
      params: state,
    },
    valid: () => 'undefined' !== typeof state?.prod,
  });

  useEffect(() => {
    if (!_data) {
      return;
    }
    let [prod, gz] = _data.data[0];
    setState({ prod, gz, detail: '印码' });
  }, [_data?.hash]);

  console.log(data, loading, error);

  return (
    <div className={styles.waffleContainer}>
      <ScrollBoard
        style={{ width: '100%', maxHeight: '60%', flex: 1 }}
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
          let prod = e.data[0],
            gz = e.data[1];
          let type = e.col - 5;
          let detail = detailType[type];

          setState({
            prod,
            gz,
            detail,
          });
        }}
      />
      {data && (
        <>
          <div className={styles.waffleTitle}>
            {state.prod}品 {state.detail}工序 {state.gz}冠字 生产情况
          </div>
          <Waffle
            option={{
              data,
              x: 0,
              y: 1,
              legend: 2,
              cart: 3,
              direction: 'vertical',
              padding: 0,
              wrap: false,
              alignContent: false,
              boxSize: 16,
              boxMargin: 2,
              boxBorderRadius: 8,
              gzMode: true,
              zoomable: false,
              intervalTooltip: true,
              moveable: false,
            }}
            style={{ height: 'auto' }}
          />
        </>
      )}
    </div>
  );
};
