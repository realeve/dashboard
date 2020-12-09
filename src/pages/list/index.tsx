import React from 'react';
import styles from './index.less';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
export default () => {
  return (
    <div className={styles.list}>
      <div className={styles.navMain}>
        <div className={styles.headerImg}>
          <img className={styles['nav-img-text']} src="/img/list/logo.png" />
          <div
            className={styles['nav-img']}
            style={{ backgroundImage: `url("/img/list/header.png")` }}
          />
        </div>
      </div>
      <div className={styles.navShadow} />
      <div className={styles.project}>
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
};
