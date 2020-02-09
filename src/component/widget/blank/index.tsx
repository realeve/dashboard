import React from 'react';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.mock_guide}>
      <div style={{ marginBottom: 16 }}>
        <img src="/img/no-data.svg" />
      </div>
      <div>暂无数据</div>
      <div className={styles.button}>初始化</div>
    </div>
  );
};
