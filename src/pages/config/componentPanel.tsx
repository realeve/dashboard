import React from 'react';
import styles from './componentPanel.less';
import classnames from 'classnames';

export default ({ className, ...props }) => {
  return (
    <div className={classnames(styles['component-panel-wp'], className)}>
      <div className={styles['component-panel']}>
        <div className={styles.panelTitle}>
          <span>
            组件列表
            <i
              className={classnames(styles.refreshBtn, 'datav-icon datav-font icon-refresh')}
              title="刷新"
            />
          </span>
          <i className={classnames('datav-icon datav-font icon-back', styles.closeBtn)} />
        </div>
      </div>
    </div>
  );
};
