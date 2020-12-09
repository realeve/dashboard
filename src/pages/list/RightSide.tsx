import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Tooltip, message } from 'antd';
import { IScreenItem } from './index';
import { useDebounce, useSetState } from 'react-use';
import { Confirm } from '@/component/Editor/Popup/Popup';

// 新增组件
const NewScreen = () => (
  <div className={styles.screenItem}>
    <div className={styles.new}>
      <div className={styles.title}>新增一个组件</div>
      <div className={styles.info}>
        <Button type="primary">添加</Button>
      </div>
    </div>
  </div>
);

const ScreenItem = ({ publish = true, title = '这是名称', file, id, img }: IScreenItem) => {
  const [screenTitle, setScreenTitle] = useState(title);
  useEffect(() => {
    setScreenTitle(title);
  }, [title]);

  // 输入完毕后半秒未操作，发起更新请求
  // 请自行搜索 debounce 关键字
  useDebounce(
    () => {
      if (screenTitle !== title) {
        message.success(`更新${id}项的 title 字段 为${screenTitle}`);
      }
    },
    1000,
    [screenTitle],
  );

  const [show, setShow] = useSetState({ visible: false, type: '' });

  return (
    <div className={styles.screenItem}>
      {show.visible && (
        <Confirm
          title={show.type == 'del' ? '删除大屏' : '复制当前大屏'}
          style={{ width: 400, minHeight: 230, height: 'auto' }}
          onCancel={() => {
            setShow({ visible: false });
          }}
          onOk={() => {
            setShow({ visible: false });
            if (show.type == 'del') {
              message.success(`删除id=${id}`);
            } else {
              message.success('复制当前数据到本机存储，然后进入config路由');
            }
          }}
        >
          {show.type == 'del' ? (
            <p style={{ margin: '20px 0' }}>删除后将不可恢复，是否继续？</p>
          ) : (
            <p style={{ margin: '20px 0' }}>
              复制当前大屏配置项，
              <span style={{ fontWeight: 'bold', backgroundColor: '#b23' }}>
                将会清理本机正在编辑的大屏，该操作不可恢复
              </span>
              ，是否继续？
              <br />
              <br />
              复制完毕后系统将自动进入编辑模式。
            </p>
          )}
        </Confirm>
      )}

      <div className={styles.screenMain}>
        <div className={styles.info}>
          <div className={styles.img} style={{ backgroundImage: `url("/data/${img}")` }} />
          <div className={styles.edit}>
            <a href={`/config/?id=${id}`} rel="noopener noreferrer" className="edit-wrap">
              <Button type="primary">编辑</Button>
            </a>
            <div className={styles['main-button']}>
              <Tooltip placement="bottom" title="预览">
                <a
                  className={styles['button-span']}
                  href={`/?id=./data/${file}&autoresize=movie`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="datav-icon datav-font icon-preview" />
                </a>
              </Tooltip>
              <Tooltip placement="bottom" title="发布">
                <span
                  className={styles['button-span']}
                  onClick={() => {
                    message.success(`更新${id}项的 public字段`);
                  }}
                >
                  <i className="datav-icon datav-font icon-publish" />
                </span>
              </Tooltip>
              <Tooltip placement="bottom" title="复制并编辑">
                <span
                  className={styles['button-span']}
                  onClick={() => {
                    setShow({ visible: true, type: 'copy' });
                  }}
                >
                  <i className="datav-icon datav-font icon-copy-screen copy-screen" />
                </span>
              </Tooltip>
              <Tooltip placement="bottom" title="删除">
                <span
                  className={styles['button-span']}
                  onClick={() => {
                    setShow({ visible: true, type: 'del' });
                  }}
                >
                  <i className="datav-icon datav-font icon-delete delete" />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles['screen-name-input']}>
            <i className="datav-icon datav-font icon-edit edit" />
            <input
              className={styles.input}
              value={screenTitle}
              onChange={(e) => {
                let _title = e.target.value;
                if (_title != title) {
                  setScreenTitle(_title);
                }
              }}
            />
          </div>
          <div className={styles['publish-info']}>
            <span
              className={classnames(
                styles['name-icon'],
                publish ? styles['color-publish'] : styles['color-notpublish'],
              )}
            />
            <span>{publish ? '已' : '未'}发布</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface IScreenListProps {
  data: IScreenItem[];
}
export default ({ data }: IScreenListProps) => {
  return (
    <div className={styles.projectList}>
      <div className={styles.screen}>
        <NewScreen />
        {data.map((props) => (
          <ScreenItem {...props} key={props.id} />
        ))}
      </div>
    </div>
  );
};
