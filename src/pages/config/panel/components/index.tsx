import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import TabComponent from './TabComponent';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

export default ({ setHide, hide, onAddPanel, onAddBusiness }) => {
  return (
    <div
      className={classnames(styles['component-panel-wp'], {
        [styles.hide]: hide.components,
      })}
    >
      <div className={styles['component-panel']}>
        <i
          className={classnames('datav-icon datav-font icon-back', styles.closeBtn)}
          onClick={() => {
            setHide({
              components: !hide.components,
            });
          }}
        />
        <Tabs defaultActiveKey="1" type="line">
          <TabPane tab="功能组件" key="1">
            {/* 功能组件  */}
            <TabComponent onAddPanel={onAddPanel} />
          </TabPane>
          <TabPane tab="业务组件" key="2">
            业务组件
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
