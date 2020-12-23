import styles from './index.less';
import classnames from 'classnames';
import HistoryItem from './HistoryItem';
import { Tooltip } from 'antd';
import { ICommon, IPanelConfig } from '@/models/common';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

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

const HistoryPanel = ({
  className,
  history,
  dispatch,
  // panel,
  curHistoryIdx,
}: {
  // panel: IPanelConfig[];
  dispatch: Dispatch;
  history: { panel: IPanelConfig[]; title: null | string }[];
  curHistoryIdx: number;
  className: string;
}) => {
  return (
    <div className={classnames(styles['history-manager-panel-wp'], className)}>
      <HistoryHeader
        onClear={() => {
          dispatch({
            type: 'common/setStore',
            payload: { history: [], curHistoryIdx: 0 },
          });
        }}
      />

      <ul className={styles.ul}>
        {history.map((item, idx) => (
          <HistoryItem
            value={`${idx + 1}.${item.title}` || `第${idx + 1}步`}
            key={idx}
            active={idx == curHistoryIdx}
            onUpdate={() => {
              dispatch({
                type: 'common/setStore',
                payload: {
                  curHistoryIdx: idx,
                  recordHistory: false,
                  panel: history[idx].panel,
                  selectedPanel: [],
                },
              });
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => common)(HistoryPanel);
