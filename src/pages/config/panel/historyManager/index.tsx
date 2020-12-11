import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

export default ({ hide, setHide }) => {
  return (
    <div
      className={classnames(styles['history-manager-panel-wp'], {
        [styles.hide]: hide.history,
      })}
    >
      <div className={styles['layer-manager-top']}>
        <div className={styles['layer-num']}>历史记录</div>
        <div className={styles['layer-manager-layout-selector']}>
          <i
            className="datav-icon datav-font icon-back"
            onClick={() => {
              setHide({
                history: !hide.history,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
