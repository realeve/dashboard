import React from 'react';
import styles from './filterManager.less';
import classnames from 'classnames';

export default ({ hide, setHide }) => {
  return (
    <div
      className={classnames(styles['filter-manager-panel-wp'], {
        [styles.hide]: hide.filter,
      })}
    >
      历史记录
    </div>
  );
};
