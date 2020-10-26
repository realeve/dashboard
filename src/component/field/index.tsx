import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
export default ({ title = null, children = null, style = {}, ...props }) => {
  return (
    <div className={styles.field} style={style}>
      {title && (
        <div title={title} className={styles.title}>
          <i className="datav-gui-field-show-placeholder" />
          {title}
        </div>
      )}
      <div className={classnames(styles.container, { [styles.notitle]: !title })}>
        <div className={styles.component}>{children}</div>
      </div>
    </div>
  );
};
