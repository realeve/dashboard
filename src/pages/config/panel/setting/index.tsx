import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Page from './page';
import { connect } from 'dva';
import { ICommon } from '@/models/common';
import Config from './config';

const getSelectedPanelConfig = (panel, selected) => panel.findIndex(item => selected == item.id);

const Index = ({ setHide, hide, selectedPanel, panel, onChange }) => {
  return (
    <div
      className={classnames(styles['config-panel-wp'], {
        [styles.hide]: hide.config,
      })}
    >
      {selectedPanel.length === 1 ? (
        <Config
          setHide={() => {
            setHide({ config: true });
          }}
          selectedIdx={getSelectedPanelConfig(panel, selectedPanel[0])}
          onChange={onChange}
        />
      ) : (
        <Page
          setHide={() => {
            setHide({ config: true });
          }}
        />
      )}
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  selectedPanel: common.selectedPanel,
}))(Index);
