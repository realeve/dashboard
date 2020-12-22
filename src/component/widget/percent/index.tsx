import React, { useEffect, Suspense } from 'react';

import percent from '@/component/chartItem/option/echarts/percent';
import styles from './index.less';
import CountUp from 'react-countup';
import { useSetState } from 'react-use';

const Echarts = React.lazy(() => import('@/component/echarts'));

export default ({ option }) => {
  let [val, setVal] = useSetState({
    start: 0,
    end: 0,
    name: option.title,
  });
  useEffect(() => {
    setVal({
      start: val.end,
      end: option.value,
    });
  }, [option.value]);

  return (
    <div className={styles.pie}>
      <Suspense fallback={null}>
        <Echarts option={percent(option)} renderer="svg" />
      </Suspense>
      <div className={styles.tip} style={{ justifyContent: option.half ? 'flex-end' : 'center' }}>
        <div className={styles.name}>{val.name}</div>
        <CountUp {...val} decimals={2} suffix="%" className={styles.value} />
      </div>
    </div>
  );
};
