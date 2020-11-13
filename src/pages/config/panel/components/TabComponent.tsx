import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Tooltip, Spin } from 'antd';
import Collapse from '@/component/collapse';
import * as db from './db';
import { IComponentItem, IComponent } from './db';
import * as lib from '@/utils/lib';

const { Panel } = Collapse;

const useGetComponents: <T>() => { loading: boolean; state: T[]; error: null | string } = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    db.getComponentList()
      .then((res) => {
        setState(res);
      })
      .catch((e) => {
        setError('加载组件列表出错');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { loading, state, error };
};

interface IComponentList {
  onAdd: (e) => void;
  loading: boolean;
  state: any[];
  error: null | string;
}

export const ComponentList = ({ onAdd, state, error, loading }: IComponentList) => {
  const [tab, setTab] = useState(0);
  if (error) {
    return <div style={{ color: '#ddd' }}>{error}</div>;
  }
  return (
    <Spin spinning={loading}>
      <div className={styles['component-panel-wrapper']}>
        <div className={styles['datav-tabs']}>
          <div className={styles.nav}>
            <div className={styles.wp}>
              {state.map((item, idx) => (
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
            <Collapse accordion defaultActiveKey={[state[tab] ? state[tab].list[0].title : '全部']}>
              {((state[tab] || { list: [] }).list as IComponentItem[]).map(
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
                      {item.list.map((panel) => (
                        <li
                          title={panel.title}
                          key={panel.title}
                          style={{ border: 0 }}
                          onClick={() => {
                            onAdd && onAdd(panel);
                          }}
                          className={classnames({ [styles.finished]: panel.key })}
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
    </Spin>
  );
};

export default ({ onAddPanel }) => {
  const props = useGetComponents<IComponent>();
  return (
    <ComponentList
      onAdd={(panel) => {
        onAddPanel({ ...panel, id: lib.noncer() });
      }}
      {...props}
    />
  );
};
