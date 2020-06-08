import React from 'react';
import styles from './components.less';
import classnames from 'classnames';

export default ({ setHide, hide, ...props }) => {
  return (
    <div
      className={classnames(styles['component-panel-wp'], {
        [styles.hide]: hide.components,
        [styles.shrink]: !hide.beauty,
      })}
    >
      <div className={styles['component-panel']}>
        <div className={styles.panelTitle}>
          <span>
            组件列表
            <i
              className={classnames(styles.refreshBtn, 'datav-icon datav-font icon-refresh')}
              title="刷新"
            />
          </span>
          <i
            className={classnames('datav-icon datav-font icon-back', styles.closeBtn)}
            onClick={() => {
              setHide({
                components: !hide.components,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
