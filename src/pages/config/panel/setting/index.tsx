import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Page from './page';
import { connect } from 'dva';
import {
  ICommon,
  GROUP_COMPONENT_KEY,
  IPanelConfig,
  IPage,
  IBusinessCategory,
} from '@/models/common';
import Config from './config';
import { Dispatch } from 'redux';
import SavePanel from '../business/SavePanel';

const getSelectedPanelConfig = (panel, selected) => panel.findIndex((item) => selected == item.id);

export interface IHideProps {
  beauty: boolean;
  components: boolean;
  config: boolean;
  filter: boolean;
  layer: boolean;
  toolbox: boolean;
}

export type TFnHide = (
  patch: Partial<IHideProps> | ((prevState: IHideProps) => Partial<IHideProps>),
) => void;

export interface ISettingProps {
  setHide: TFnHide;
  hide: IHideProps;
  selectedPanel: string[];
  panel: IPanelConfig[];
  onChange: (e: any, type: string) => void;
  page: IPage;
  dispatch: Dispatch;
  businessCategory: IBusinessCategory[];
}
const Index = ({
  setHide,
  hide,
  selectedPanel,
  panel,
  onChange,
  page,
  businessCategory,
  dispatch,
}: ISettingProps) => {
  const [show, setShow] = useState<boolean>(false);

  let pageChart = selectedPanel.length == 1;

  if (pageChart) {
    let config = panel.find((item) => item.id == selectedPanel[0]);
    pageChart = config.key !== GROUP_COMPONENT_KEY;
  }

  // 是否能够保存为业务组件
  const [shouldSave, setShouldSave] = useState(false);

  useEffect(() => {
    if (selectedPanel.length === 0) {
      setShouldSave(false);
      return;
    }
    setShouldSave(true);
  }, [selectedPanel.length]);

  return (
    <div
      className={classnames(styles['config-panel-wp'], {
        [styles.hide]: hide.config,
      })}
    >
      {!pageChart && <div className={styles.head}>页面设置</div>}

      <div className={styles.body}>
        {pageChart ? (
          <Config
            selectedIdx={getSelectedPanelConfig(panel, selectedPanel[0])}
            onChange={onChange}
          />
        ) : (
          <Page dispatch={dispatch} page={page} />
        )}
      </div>

      {/* 保存组件面板 */}
      <SavePanel
        show={show}
        onClose={() => {
          setShow(false);
        }}
        panel={panel}
        selectedPanel={selectedPanel}
        businessCategory={businessCategory}
      />

      {shouldSave && (
        <div
          className={styles.bottom}
          onClick={() => setShow(true)}
          style={{ outline: '1px solid #aaa', background: 'transparent' }}
        >
          保存为业务组件
        </div>
      )}
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

export default connect(({ common }: { common: ICommon }) => common)(Index);
