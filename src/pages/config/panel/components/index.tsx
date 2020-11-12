import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import TabComponent from './TabComponent';

export default ({ setHide, hide, onAddPanel }) => {
  return (
    <div
      className={classnames(styles['component-panel-wp'], {
        [styles.hide]: hide.components,
      })}
    >
      <div className={styles['component-panel']}>
        <div className={styles.panelTitle}>
          <span>组件列表</span>
          <i
            className={classnames('datav-icon datav-font icon-back', styles.closeBtn)}
            onClick={() => {
              setHide({
                components: !hide.components,
              });
            }}
          />
        </div>
        {/* 功能组件  */}
        <TabComponent onAddPanel={onAddPanel} />
      </div>
    </div>
  );
};
