import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Drawer, Tooltip, Spin, message } from 'antd';
import Collapse from '@/component/collapse';
import * as db from './db';
import type { IComponentItem, IComponent } from './db';
import * as lib from '@/utils/lib';
import type { ISearchState } from './SearchPanel';
import SearchPanel from './SearchPanel';
import pinyin from '@/utils/pinyin.js';
import type { IBusinessState } from '../business/TabBusiness';
import { Confirm } from '@/component/Editor/Popup/Popup';
import { useSetState } from 'react-use';
import { setDashboardBusiness } from '@/pages/config/panel/business/db';

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

type IComponentList = {
  onAdd: (e, isEdit?: boolean) => void;
  loading: boolean;
  state: (IComponent | IBusinessState)[];
  error: null | string;
  isBusiness?: boolean;
  onRefresh?: () => void;
}

export const ComponentList = ({
  onAdd,
  state,
  error,
  loading,
  isBusiness = false,
  onRefresh,
}: IComponentList) => {
  const [tab, setTab] = useState(0);
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState('');
  const onClose = () => {
    setVal('');
    setVisible(false);
  };

  const [list, setList] = useState<ISearchState[]>([]);

  useEffect(() => {
    const arr: ISearchState[] = [];
    state.forEach(({ title, list }) =>
      list.forEach((row) => {
        if (row.title == '全部') {
          return;
        }
        const category = `${title} / ${row.title} /`;
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

  const [show, setShow] = useSetState({ visible: false, panel: null });

  if (error) {
    return <div style={{ color: '#ddd' }}>{error}</div>;
  }

  const removeBusiness = () => {
    const { id, ...params } = show.panel;
    setDashboardBusiness({
      ...params,
      _id: id,
      is_hide: 1,
    }).then((success) => {
      if (!success) return;
      // 重新加载业务组件
      onRefresh();
      setShow({ visible: false, panel: null });
      message.success(`业务组件删除${success ? '成功' : '失败'}`);
    });
  };

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
          {show.visible && (
            <Confirm
              title="删除业务组件"
              style={{ width: 400, minHeight: 150, height: 'auto' }}
              onCancel={() => {
                setShow({ visible: false, panel: null });
              }}
              onOk={removeBusiness}
            >
              删除后将不可恢复，是否继续？
            </Confirm>
          )}
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
                            if (isBusiness) {
                              return;
                            }
                            onAdd?.(panel);
                          }}
                          className={classnames({
                            [styles.finished]: panel.key,
                            [styles.business]: isBusiness,
                          })}
                        >
                          <div className={styles.text}>{panel.title}</div>
                          <div
                            className={styles.img}
                            style={{
                              backgroundImage: `url("${panel.image}")`,
                              pointerEvents: 'none',
                            }}
                          />
                          {isBusiness && (
                            <div className={styles.mask}>
                              <Tooltip placement="bottom" title="添加到画布">
                                <span
                                  className={styles['button-span']}
                                  onClick={() => {
                                    onAdd?.(panel);
                                  }}
                                >
                                  <i
                                    className="datav-icon datav-font icon-add add"
                                    style={{ fontSize: 24 }}
                                  />
                                </span>
                              </Tooltip>
                              <Tooltip placement="bottom" title="编辑">
                                <span
                                  className={styles['button-span']}
                                  onClick={() => {
                                    message.success('添加到画布后请尽快编辑组件并保存');
                                    // 增加id管理
                                    onAdd?.(panel, true);
                                  }}
                                >
                                  <i
                                    className="datav-icon datav-font icon-edit edit"
                                    style={{ fontSize: 20 }}
                                  />
                                </span>
                              </Tooltip>
                              <Tooltip placement="bottom" title="删除">
                                <span
                                  className={styles['button-span']}
                                  onClick={() => {
                                    setShow({ visible: true, panel });
                                  }}
                                >
                                  <i
                                    className="datav-icon datav-font icon-delete delete"
                                    style={{ fontSize: 20 }}
                                  />
                                </span>
                              </Tooltip>
                            </div>
                          )}
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
