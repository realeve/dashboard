import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Tooltip, message } from 'antd';
import { IScreenItem } from './index';
import { useDebounce, useSetState } from 'react-use';
import { Confirm } from '@/component/Editor/Popup/Popup';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { router } from 'umi';
import { setDashboardList } from './db';

// 新增组件
const NewScreen = () => (
  <div className={styles.screenItem}>
    <div className={styles.new}>
      <div className={styles.title}>新增一个大屏</div>
      <div className={styles.info}>
        <Button
          type="primary"
          onClick={() => {
            router.push('/config');
          }}
        >
          添加
        </Button>
      </div>
    </div>
  </div>
);

interface IShowProps {
  visible: boolean;
  type: string;
  id: number;
  file?: string;
  title?: string;
}
interface IProps extends IScreenItem {
  setShow: (e: IShowProps) => void;
}

const ScreenItem = ({ publish = 1, title = '这是名称', file, id, img, setShow }: IProps) => {
  const [screenTitle, setScreenTitle] = useState(title);
  useEffect(() => {
    setScreenTitle(title);
  }, [title]);

  // 输入完毕后半秒未操作，发起更新请求
  // 请自行搜索 debounce 关键字
  // https://www.cnblogs.com/nanchen/p/7922959.html
  useDebounce(
    () => {
      if (screenTitle !== title) {
        setDashboardList({
          _id: id,
          title: screenTitle,
          is_hide: 0,
          publish,
        }).then((success) => {
          success && message.success(`标题更新${success ? '成功' : '失败'}`);
        });
      }
    },
    1000,
    [screenTitle],
  );

  return (
    <div className={styles.screenItem}>
      <div className={styles.screenMain}>
        <div className={styles.info}>
          <div className={styles.img} style={{ backgroundImage: `url("/data/${img}")` }} />
          <div className={styles.edit}>
            <a
              href={`/config/?id=${id}&file=./data/${file}`}
              rel="noopener noreferrer"
              className="edit-wrap"
            >
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
                    setDashboardList({
                      _id: id,
                      title,
                      is_hide: 0,
                      publish: 1,
                    }).then((success) => {
                      success && message.success(`大屏发布${success ? '成功' : '失败'}`);
                    });
                  }}
                >
                  <i className="datav-icon datav-font icon-publish" />
                </span>
              </Tooltip>
              <Tooltip placement="bottom" title="复制并编辑">
                <span
                  className={styles['button-span']}
                  onClick={() => {
                    setShow({ visible: true, type: 'copy', id, title: screenTitle });
                  }}
                >
                  <i className="datav-icon datav-font icon-copy-screen copy-screen" />
                </span>
              </Tooltip>
              <Tooltip placement="bottom" title="删除">
                <span
                  className={styles['button-span']}
                  onClick={() => {
                    setShow({ visible: true, type: 'del', id, title: screenTitle });
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
                publish == 1 ? styles['color-publish'] : styles['color-notpublish'],
              )}
            />
            <span>{publish == 1 ? '已' : '未'}发布</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface IScreenListProps {
  data: IScreenItem[];
  dispatch: Dispatch;
}
const RightSide = ({ data, dispatch }: IScreenListProps) => {
  // 将面板从子组件中移出来，将事件添加至外部，这样有多个面板需要渲染时，无需渲染多个popup
  const [show, setShow] = useSetState<IShowProps>({
    visible: false,
    type: '',
    id: null,
    file: '',
    title: '',
  });

  // 复制数据大屏
  const copyDashboardByFile = () => {
    // message.success('复制当前数据到本机存储，然后进入config路由');

    // step1:根据文件名载入基本信息到 本地环境
    dispatch({
      type: 'common/loadPageOnline',
      payload: {
        file: show.file,
        callback: () => {
          // step2:进入config路由
          router.push('/config');
        },
      },
    });
  };

  return (
    <div className={styles.projectList}>
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
              setDashboardList({
                _id: show.id,
                title: show.title,
                is_hide: 1,
                publish: 1,
              }).then((success) => {
                success && message.success(`删除大屏${success ? '成功' : '失败'}`);
                window.location.reload();
              });
              return;
            }

            copyDashboardByFile();
          }}
        >
          {show.type == 'del' ? (
            <p style={{ margin: '20px 0' }}>删除后将不可恢复，是否继续？</p>
          ) : (
            <p style={{ margin: '20px 0' }}>
              复制当前大屏配置项，
              <span style={{ fontWeight: 'bold', backgroundColor: '#b23', padding: '0 5px' }}>
                该操作将会清理本机正在编辑的大屏，该操作不可恢复
              </span>
              ，是否继续？
              <br />
              <br />
              该功能常用于基于指定大屏去构建自己所需要的大屏，复制完毕后系统将自动进入编辑模式。
            </p>
          )}
        </Confirm>
      )}
      <div className={styles.screen}>
        <NewScreen />
        {data.map((props) => (
          <ScreenItem
            {...props}
            key={props.id}
            setShow={(show) => {
              setShow({
                ...show,
                file: './data/' + props.file,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default connect()(RightSide);
