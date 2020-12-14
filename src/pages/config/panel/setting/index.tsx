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
  IHistoryProps,
} from '@/models/common';
import Config from './config';
import { Dispatch } from 'redux';
import SavePanel from '../business/SavePanel';

const getSelectedPanelConfig = (panel, selected) => panel.findIndex((item) => selected == item.id);

export interface IHideProps {
  components: boolean;
  config: boolean;
  layer: boolean;
  toolbox: boolean;
}

export type TFnHide = (
  patch: Partial<IHideProps> | ((prevState: IHideProps) => Partial<IHideProps>),
) => void;

export interface ISettingProps extends IHistoryProps {
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
  onChange,
  page,
  businessCategory,
  dispatch,
  // history,
  // curHistoryIdx,
  panel, //: _panel,
}: ISettingProps) => {
  // let panel = history[curHistoryIdx]?.panel || _panel;
  const [show, setShow] = useState<boolean>(false);

  // const [pageChart, setPageChart] = useState(selectedPanel.length == 1);
  // useEffect(() => {
  //   let valid = selectedPanel.length == 1;
  //   if (valid) {
  //     let config = panel.find((item) => item.id == selectedPanel[0]);
  //     valid = config && config?.key !== GROUP_COMPONENT_KEY;
  //   }
  //   setPageChart(valid);
  // }, [panel, selectedPanel]);

  let pageChart = selectedPanel.length == 1;
  if (pageChart) {
    let config = panel.find((item) => item.id == selectedPanel[0]);
    pageChart = config && config?.key !== GROUP_COMPONENT_KEY;
  }

  // 是否能够保存为业务组件
  const [shouldSave, setShouldSave] = useState(false);

  useEffect(() => {
    if (selectedPanel.length === 0) {
      setShouldSave(false);
      return;
    }

    // 2020-12-11 业务组件编辑
    // 查看是否为业务组件的编辑模式
    let haveEditableBusinessComponent = panel.find(
      (item) => selectedPanel.includes(item.id) && item.edit_id,
    );
    if (haveEditableBusinessComponent) {
      setShouldSave(true);
      return;
    }

    // 业务组件自身不允许被选取；
    // TODO 此处需讨论是否开放，这样可在多个业务组件之间组合成新组件
    let haseBusiness = panel.find((item) => selectedPanel.includes(item.id) && item.business);

    setShouldSave(!haseBusiness);
  }, [selectedPanel.length]);

  return (
    <div
      className={classnames(styles['config-panel-wp'], styles.configPanelTransparent, {
        [styles.hide]: hide.config,
      })}
    >
      {!pageChart && (
        <div className={styles.head}>
          <span>页面设置</span>
          <span
            onClick={() => {
              setHide({ config: true });
            }}
            style={{ transform: 'rotate(180deg)', height: '100%', marginRight: 5 }}
          >
            <i className="datav-icon datav-font icon-back"></i>
          </span>
        </div>
      )}

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
        dispatch={dispatch}
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
      {/* {!pageChart && (
        <div
          className={styles.bottom}
          onClick={() => {
            setHide({ config: true });
          }}
        >
          确定
        </div>
      )} */}
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => common)(Index);
