import React from 'react';
import styles from './dna.less';
import * as R from 'ramda';
export default () => (
  <div className={styles.curtain}>
    <div className={styles.dna}>
      {R.range(0, 60).map((item) => (
        <div className={styles.ele} key={item}>
          <div className={styles.dot}></div>
        </div>
      ))}
    </div>
  </div>
);
