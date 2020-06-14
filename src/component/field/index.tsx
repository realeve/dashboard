import React from 'react';
import styles from './index.less';
export default ({ title, children, ...props }) => {
  return (
    <div className={styles.field}>
      <div title={title} className={styles.title}>
        <i className="datav-gui-field-show-placeholder" />
        {title}
      </div>
      <div className={styles.container}>
        <div className={styles.component}>{children}</div>
      </div>
    </div>
  );
};
