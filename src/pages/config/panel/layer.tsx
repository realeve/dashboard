import React from 'react';
import styles from './layer.less';
import classnames from 'classnames';

export default ({ hide, setHide }) => {
  return (
    <div
      className={classnames(styles['layer-panel-wp'], {
        [styles.hide]: hide.layer,
      })}
    >
      图层
    </div>
  );
};
