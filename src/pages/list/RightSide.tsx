import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Tooltip } from 'antd';

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

const ScreenItem = ({ publish = true, title = '这是名称', url }) => {
  return (
    <div className={styles.screenItem}>
      <div className={styles.screenMain}>
        <div className={styles.info}>
          <div className={styles.img}></div>
          <div className={styles.edit}>
            <a
              href={`/?id=./data/${url}`}
              rel="noopener noreferrer"
              target="_blank"
              className="edit-wrap"
            >
              <Button type="primary">编辑</Button>
            </a>
            <div className={styles['main-button']}>
              <Tooltip placement="bottom" title="预览">
                <a
                  className={styles['button-span']}
                  href={`/?id=./data/${url}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="datav-icon datav-font icon-preview" />
                </a>
              </Tooltip>
              <Tooltip placement="bottom" title="发布">
                <span className={styles['button-span']}>
                  <i className="datav-icon datav-font icon-publish" />
                </span>
              </Tooltip>
              <Tooltip placement="bottom" title="复制并编辑">
                <span className={styles['button-span']}>
                  <i className="datav-icon datav-font icon-copy-screen copy-screen" />
                </span>
              </Tooltip>
              <Tooltip placement="bottom" title="删除">
                <span className={styles['button-span']}>
                  <i className="datav-icon datav-font icon-delete delete" />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles['screen-name-input']}>
            <i className="datav-icon datav-font icon-edit edit" />
            <input className={styles.input} value={title} />
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

export default () => {
  return (
    <div className={styles.projectList}>
      <div className={styles.screen}>
        <NewScreen />
        <ScreenItem title="文件名" />
        <ScreenItem publish={false} />
      </div>
    </div>
  );
};
