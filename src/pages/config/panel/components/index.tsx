import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import Collapse from '@/component/collapse';
import * as db from './db';
import { IComponentItem, IComponent } from './db';

export const defaultStyle = {
  style: { width: 640, height: 400, rotate: 0, transform: 'translate(100p,100px)' },
};

const { Panel } = Collapse;

export default ({ setHide, hide, onAddPanel, ...props }) => {
  const [tab, setTab] = useState(0);
  const [itemList, setItemList] = useState<IComponent[]>([]);
  useEffect(() => {
    db.getComponentList().then(setItemList);
  }, []);
  return (
    <div
      className={classnames(styles['component-panel-wp'], {
        [styles.hide]: hide.components,
        [styles.shrink]: !hide.beauty,
      })}
    >
      <div className={styles['component-panel']}>
        <div className={styles.panelTitle}>
          <span>
            组件列表
            <i
              className={classnames(styles.refreshBtn, 'datav-icon datav-font icon-refresh')}
              title="刷新"
            />
          </span>
          <i
            className={classnames('datav-icon datav-font icon-back', styles.closeBtn)}
            onClick={() => {
              setHide({
                components: !hide.components,
              });
            }}
          />
        </div>
        <div className={styles['component-panel-wrapper']}>
          <div className={styles['datav-tabs']}>
            <div className={styles.nav}>
              <div className={styles.wp}>
                {itemList.map((item, idx) => (
                  <div
                    className={classnames(styles.tab, {
                      [styles.tabActived]: idx == tab,
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
            <div className={styles.content}>
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
                      <ul className={styles.menulist}>
                        {item.list.map(panel => (
                          <li
                            title={panel.title}
                            key={panel.title}
                            style={{ border: 0 }}
                            onClick={() => {
                              onAddPanel && onAddPanel({ ...panel, ...defaultStyle });
                            }}
                            className={classnames({[styles.finished]:panel.key})}
                          >
                            <div className={styles.text}>{panel.title}</div>
                            <div
                              className={styles.img}
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
