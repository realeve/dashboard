import React from 'react';
import styles from './beauty.less';
import classnames from 'classnames';

export default ({ hide, setHide }) => {
  return (
    <div
      className={classnames(styles['beauty-panel-wp'], {
        [styles.hide]: hide.beauty,
      })}
    >
      美化
    </div>
  );
};
