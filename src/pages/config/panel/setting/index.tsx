import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import Page from './page';
import { connect } from 'dva';
import { ICommon, GROUP_COMPONENT_KEY, IPanelConfig, IPage, getGroupRect } from '@/models/common';
import Config from './config';
import * as R from 'ramda';
import { Dispatch } from 'redux';

import { message } from 'antd';
import * as lib from '@/utils/lib';

const getSelectedPanelConfig = (panel, selected) => panel.findIndex((item) => selected == item.id);

// 获取基础配置：缩略图、标题
const getImage = (panels: IPanelConfig[]) => {
  if (panels.length == 1) {
    return { image: panels[0].image, title: panels[0].title };
  }
  let item =
    panels.find(
      (item) => ![GROUP_COMPONENT_KEY, 'text_single', 'image_single'].includes(item.key),
    ) || R.last(panels);

  return { title: item.title, image: item.image };
};
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
}
const Index = ({
  setHide,
  hide,
  selectedPanel,
  panel,
  onChange,
  page,
  dispatch,
}: ISettingProps) => {
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

  const saveComponents = (panels: IPanelConfig[]) => {
    if (panels.length === 0) {
      message.error('业务保存需要确保组件在同一个分组内');
      return;
    }
    let { title, image } = getImage(panels);
    let config = JSON.stringify(panels);
    let create_time = lib.now();

    let option = {
      config,
      title,
      image,
      create_time,
      creator: '管理员',
      useage_times: 0,
      update_time: create_time,
    };
    console.log(option);
  };

  const getSelectedCompoent = () => {
    if (selectedPanel.length === 0) {
      return [];
    }

    let panels = R.filter<IPanelConfig>((item) => selectedPanel.includes(item.id))(panel);
    // 只选中了一个组件的导出
    if (panels.length === 1) {
      return panels;
    }

    // 选中多个组件时
    let groups: string[] = R.pluck<IPanelConfig>('group', panels).filter(
      (item: string | undefined) => item,
    ) as string[];
    groups = R.uniq(groups);

    // 选中多个组件，未分组,需要手工将组件合并
    if (groups.length === 0) {
      let groupItem = getGroupRect();
      let _panel = R.map((item: IPanelConfig) => ({ group: groupItem.id, ...item }))(panels);
      return [groupItem, ..._panel];
    }

    // 选中多个分组的组件
    if (groups.length > 1) {
      return [];
    }

    // 组件在同一个分组中
    if (selectedPanel.includes(groups[0])) {
      return panels;
    }

    let groupPanel = R.find<IPanelConfig>(R.propEq('id', groups[0]))(panel);
    return [groupPanel, ...panels];
  };

  const onSaveComponent = () => {
    let panels = getSelectedCompoent();
    saveComponents(panels);
  };

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
      {shouldSave && (
        <div
          className={styles.bottom}
          onClick={onSaveComponent}
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

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  selectedPanel: common.selectedPanel,
  page: common.page,
}))(Index);
