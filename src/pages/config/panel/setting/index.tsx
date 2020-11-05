import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Page from './page';
import { connect } from 'dva';
import { ICommon, GROUP_COMPONENT_KEY } from '@/models/common';
import Config from './config';

const getSelectedPanelConfig = (panel, selected) => panel.findIndex((item) => selected == item.id);

const Index = ({ setHide, hide, selectedPanel, panel, onChange, page, dispatch }) => {
  let pageChart = selectedPanel.length == 1;

  if (pageChart) {
    let config = panel.find((item) => item.id == selectedPanel[0]);
    pageChart = config.key !== GROUP_COMPONENT_KEY;
  }

  return (
    <div
      className={classnames(styles['config-panel-wp'], {
        [styles.hide]: hide.config,
      })}
    >
      {!pageChart && <div className={styles.head}>页面设置</div>}

      <div
        className={styles.body}
        style={{
          height: `calc(100% - ${pageChart ? 30 : 60}px)`,
        }}
      >
        {pageChart ? (
          <Config
            selectedIdx={getSelectedPanelConfig(panel, selectedPanel[0])}
            onChange={onChange}
          />
        ) : (
          <Page dispatch={dispatch} page={page} />
        )}
      </div>
      {!pageChart && (
        <div
          className={styles.bottom}
          onClick={() => {
            setHide({ config: true });
          }}
        >
          确定
        </div>
      )}
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  selectedPanel: common.selectedPanel,
  page: common.page,
}))(Index);
