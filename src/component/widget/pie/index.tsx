import React, { useState, useEffect } from 'react';
import Echarts from '@/component/echarts';
import * as lib from '@/component/chartItem/option';
import styles from './index.less';
import CountUp from 'react-countup';
import { useSetState } from 'react-use';
import * as R from 'ramda';
export default ({ toggleItem = true, option }) => {
  let y = option.y || 1,
    x = option.x || 0;
  const [sum, setSum] = useState(null);
  useEffect(() => {
    let count = R.sum(option.data.map(item => item[y]));
    setSum(count || 1);
    setVal({
      start: 0,
      end: Number(((option.data[0][y] / count) * 100).toFixed(2)),
    });
  }, [option.data]);

  let [val, setVal] = useSetState({
    start: 0,
    end: 0,
    name: option.data[0][x],
  });

  return (
    <div className={styles.pie}>
      <Echarts
        option={lib.pie(option)}
        toggleItem={toggleItem}
        renderer="svg"
        setToggleIdx={idx => {
          let start = val.end;
          setVal({
            start,
            end: Number(((option.data[idx][y] / sum) * 100).toFixed(2)),
            name: option.data[idx][x],
          });
        }}
      />
      <div className={styles.tip}>
        <div className={styles.name}>{val.name}</div>
        <CountUp {...val} decimals={2} suffix="%" className={styles.value} />
      </div>
    </div>
  );
};
