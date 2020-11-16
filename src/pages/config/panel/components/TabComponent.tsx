import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Drawer, Tooltip, Spin } from 'antd';
import Collapse from '@/component/collapse';
import * as db from './db';
import { IComponentItem, IComponent } from './db';
import * as lib from '@/utils/lib';
import SearchPanel, { ISearchState } from './SearchPanel';
import pinyin from '@/utils/pinyin.js';
import { IBusinessState } from '../business/TabBusiness';

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
  state: (IComponent | IBusinessState)[];
  error: null | string;
}

export const ComponentList = ({ onAdd, state, error, loading }: IComponentList) => {
  const [tab, setTab] = useState(0);
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState('');
  const onClose = () => {
    setVal('');
    setVisible(false);
  };

  const [list, setList] = useState<ISearchState[]>([]);

  useEffect(() => {
    let arr: ISearchState[] = [];
    state.forEach(({ title, list }) =>
      list.forEach((row) => {
        if (row.title == '全部') {
          return;
        }
        let category = `${title} / ${row.title} /`;
        row.list.forEach(({ title, image, ...panel }) => {
          arr.push({
            category,
            title,
            image,
            panel: { title, image, ...panel },
            key: panel.key || panel.create_time,
            title_simple: pinyin.toPinYin(title).toLowerCase(),
            title_full: pinyin.toPinYinFull(title).toLowerCase(),
          });
        });
      }),
    );
    setList(arr);
  }, [state]);

  useEffect(() => {
    if (val.trim().length == 0) {
      setVisible(false);
      return;
    }

    !visible && setVisible(true);
  }, [val]);

  const inputRef = useRef(null);

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
                  <Tooltip placement="left" trigger="hover" title={item.title}>
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
                          key={panel.key || panel.title}
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

          <Drawer
            title={
              <>
                <span className="search-title">
                  "{val}" 搜索结果 ({list.length})
                </span>
                <div className="close-btn" onClick={onClose}>
                  <i className="datav-icon datav-font icon-close close-btn-icon" />
                </div>
              </>
            }
            placement="right"
            width="233"
            closable={false}
            onClose={onClose}
            visible={visible}
            getContainer={false}
            style={{ position: 'absolute' }}
            bodyStyle={{ background: `var(--datav-panel-color)`, padding: 10 }}
            headerStyle={{
              background: `var(--datav-panel-color)`,
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              padding: 5,
            }}
          >
            {visible && (
              <SearchPanel
                data={list.filter(
                  (item) =>
                    item.title.includes(val.trim()) ||
                    item.title_simple.includes(val.trim()) ||
                    item.title_full.includes(val.trim()),
                )}
                onAdd={onAdd}
              />
            )}
          </Drawer>
        </div>
        <div className={styles['component-search-wp']}>
          <input
            className={classnames('data_input', styles['search-ipt'])}
            placeholder="搜索组件,支持拼音检索"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
            }}
            autoComplete="false"
            onBlur={(e) => {
              // drawer弹出时会获得焦点，此时Input失去焦点，需要hack重新获取焦点
              if (val.trim().length == 1) {
                inputRef?.current?.focus();
              }
            }}
            ref={inputRef}
          />
          <i
            className={classnames('datav-icon datav-font icon-close', styles['clear-search-text'])}
            onClick={() => {
              setVal('');
            }}
          />
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
