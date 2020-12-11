import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import HistoryItem from './HistoryItem';
import { Tooltip } from 'antd';
const HistoryHeader = ({ onClear }) => (
  <div className={styles['layer-manager-top']}>
    <div className={styles['layer-num']}>历史记录</div>
    <div className={styles['layer-manager-layout-selector']}>
      <Tooltip title="清空历史记录">
        <i className="datav-icon datav-font icon-delete" onClick={onClear} />
      </Tooltip>
    </div>
  </div>
);

export default ({ className }) => {
  return (
    <div className={classnames(styles['history-manager-panel-wp'], className)}>
      <HistoryHeader
        onClear={() => {
          console.log('clear');
        }}
      />

      <ul className={styles.ul}>
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
      </ul>
    </div>
  );
};
