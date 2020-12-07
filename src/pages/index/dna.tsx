import React from 'react';
import styles from './dna.less';
import * as R from 'ramda';
export default ({ title = '载入中...' }) => (
  <div className={styles.curtain}>
    <div className={styles.tip}>{title}</div>
    <div className={styles.dna}>
      {R.range(0, 60).map((item) => (
        <div className={styles.ele} key={item}>
          <div className={styles.dot}></div>
        </div>
      ))}
    </div>
  </div>
);
