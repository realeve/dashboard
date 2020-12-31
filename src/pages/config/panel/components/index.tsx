import styles from './index.less';
import classnames from 'classnames';
import TabComponent from './TabComponent';
import TabBusiness from '../business/TabBusiness';
import { Tabs } from 'antd';
import type { IPanelConfig } from '@/models/common';

import type { IHideProps, TFnHide } from '../setting';

const { TabPane } = Tabs;

export default ({
  setHide,
  hide,
  onAddPanel,
  onAddBusiness,
}: {
  hide: IHideProps;
  setHide: TFnHide;
  onAddBusiness: (e: IPanelConfig[]) => void;
  onAddPanel: (e: IPanelConfig) => void;
}) => {
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
            <TabBusiness onAddPanel={onAddBusiness} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
