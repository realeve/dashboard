import React, { Suspense } from 'react';
import styles from './LayerPanel.less';
import classnames from 'classnames';
import { IHideProps, TFnHide } from './setting';
// import HistoryManager from './historyManager';

const Layer = React.lazy(() => import('./layer/layer'));
const HistoryManager = React.lazy(() => import('./historyManager'));

export default (props: { hide: IHideProps; setHide: TFnHide; onRemove: (e: string[]) => void }) => {
  return (
    <div
      className={classnames(styles.layerPanel, {
        [styles.hide]: props.hide.layer,
      })}
    >
      <Suspense fallback={null}>
        <Layer className={styles.top} {...props} />
      </Suspense>
      <Suspense fallback={null}>
        <HistoryManager className={styles.bottom} />
      </Suspense>
    </div>
  );
};
