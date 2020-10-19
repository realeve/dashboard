import React, { useState, useEffect } from 'react';
import Echarts from '@/component/echarts';
import * as lib from '@/component/chartItem/option';
import styles from './index.less';
import CountUp from 'react-countup';
import { useSetState } from 'react-use';
import * as R from 'ramda';
export default ({
  toggleItem = true,
  option: { x = 0, y = 1, data, titleFontSize = 16, valueFontSize = 30, ...option },
}) => {
  const [sum, setSum] = useState(null);
  useEffect(() => {
    let count = R.sum(data.data.map(item => item[y]));
    setSum(count || 1);
    setVal({
      start: 0,
      end: Number(((data.data[0][y] / count) * 100).toFixed(2)),
    });
  }, [data]);

  let [val, setVal] = useSetState({
    start: 0,
    end: 0,
    name: data.data[0][x],
  });

  return (
    <div className={styles.pie}>
      <Echarts
        option={lib.pie({
          x,
          y,
          data: data.data,
          ...option,
        })}
        toggleItem={toggleItem}
        renderer="svg"
        setToggleIdx={idx => {
          let start = val.end;
          setVal({
            start,
            end: Number(((data.data[idx][y] / sum) * 100).toFixed(2)),
            name: data.data[idx][x],
          });
        }}
      />
      <div className={styles.tip}>
        <div className={styles.name} style={{ fontSize: titleFontSize }}>
          {val.name}
        </div>
        <CountUp
          {...val}
          decimals={2}
          suffix="%"
          className={styles.value}
          style={{ fontSize: valueFontSize }}
        />
      </div>
    </div>
  );
};
