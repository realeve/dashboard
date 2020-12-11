import React from 'react';
import Layer from './layer';
import HistoryManager from './historyManager';
import styles from './LayerPanel.less';
import classnames from 'classnames';
import { IHideProps, TFnHide } from './setting';

export default (props: { hide: IHideProps; setHide: TFnHide; onRemove: (e: string[]) => void }) => {
  return (
    <div
      className={classnames(styles.layerPanel, {
        [styles.hide]: props.hide.layer,
      })}
    >
      <Layer className={styles.top} {...props} />
      <HistoryManager className={styles.bottom} />
    </div>
  );
};
