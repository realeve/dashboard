import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import Collapse from '@/component/collapse';
import * as db from '../components/db';
import { IComponentItem, IComponent } from '../components/db';
import * as lib from '@/utils/lib';
import panelStyle from '../components/index.less';
const { Panel } = Collapse;

export default ({ setHide, hide, onAddPanel, ...props }) => {
  const [tab, setTab] = useState(0);
  const [itemList, setItemList] = useState<IComponent[]>([]);
  useEffect(() => {
    db.getComponentList().then(setItemList);
  }, []);
  return (
    <div
      className={classnames(styles['business-panel-wp'], {
        [styles.hide]: hide.beauty,
      })}
    >
      <div className={panelStyle['component-panel']} style={{ width: 433 }}>
        <div className={panelStyle.panelTitle}>
          <span>业务组件</span>
          <i
            className={classnames('datav-icon datav-font icon-back', panelStyle.closeBtn)}
            onClick={() => {
              setHide({
                beauty: !hide.beauty,
              });
            }}
          />
        </div>
        <div className={panelStyle['component-panel-wrapper']}>
          <div className={panelStyle['datav-tabs']}>
            <div className={panelStyle.nav}>
              <div className={panelStyle.wp}>
                {itemList.map((item, idx) => (
                  <div
                    className={classnames(panelStyle.tab, {
                      [panelStyle.tabActived]: idx == tab,
                    })}
                    onClick={() => {
                      setTab(idx);
                    }}
                    key={item.title}
                  >
                    <Tooltip placement="left" trigger="hover" key={item.icon} title={item.title}>
                      <i
                        className={classnames('com-font', item.icon, {
                          'icon-active': idx == tab,
                        })}
                      />
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
            <div className={panelStyle.content}>
              <Collapse accordion defaultActiveKey={['全部']}>
                {((itemList[tab] || { list: [] }).list as IComponentItem[]).map(
                  (item: IComponentItem) => (
                    <Panel
                      header={
                        <div className="collapse-hd">
                          <i className={item.icon} />
                          <span>
                            {item.title}({item.num})
                          </span>
                        </div>
                      }
                      key={item.title}
                    >
                      <ul className={panelStyle.menulist}>
                        {item.list.map((panel) => (
                          <li
                            title={panel.title}
                            key={panel.title}
                            style={{ border: 0 }}
                            onClick={() => {
                              onAddPanel && onAddPanel({ ...panel, id: lib.noncer() });
                            }}
                            className={classnames({ [panelStyle.finished]: panel.key })}
                          >
                            <div className={panelStyle.text}>{panel.title}</div>
                            <div
                              className={panelStyle.img}
                              style={{
                                backgroundImage: `url("${panel.image}")`,
                                pointerEvents: 'none',
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  ),
                )}
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
