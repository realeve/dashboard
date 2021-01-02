import React, { useEffect, Suspense } from 'react';
import percent from '@/component/chartItem/option/echarts/percent';
import styles from './index.less';
import { useSetState } from 'react-use';

const CountUp = React.lazy(() => import('react-countup'));
const Echarts = React.lazy(() => import('@/component/echarts'));

export default ({ option }) => {
  const [val, setVal] = useSetState({
    start: 0,
    end: 0,
    name: option.title,
  });
  useEffect(() => {
    setVal({
      start: val.end,
      end: option.value,
    });
  }, [option.value, val.end]);

  return (
    <div className={styles.pie}>
      <Suspense fallback={null}>
        <Echarts option={percent(option)} renderer="svg" />
      </Suspense>
      <div className={styles.tip} style={{ justifyContent: option.half ? 'flex-end' : 'center' }}>
        <div className={styles.name}>{val.name}</div>
        <Suspense fallback={null}>
          <CountUp {...val} decimals={2} suffix="%" className={styles.value} />
        </Suspense>
      </div>
    </div>
  );
};
