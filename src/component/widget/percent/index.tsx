import React, { useEffect } from 'react';
import Echarts from '@/component/echarts';
import * as lib from '@/component/chartItem/option';
import styles from './index.less';
import CountUp from 'react-countup';
import { useSetState } from 'react-use';
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
      <Echarts option={lib.percent(option)} renderer="svg" />
      <div className={styles.tip} style={{ justifyContent: option.half ? 'flex-end' : 'center' }}>
        <div className={styles.name}>{val.name}</div>
        <CountUp {...val} decimals={2} suffix="%" className={styles.value} />
      </div>
    </div>
  );
};
