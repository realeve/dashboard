import styles from './index.less';
import classnames from 'classnames';
import { IScreenListProps } from './RightSide';
export default ({ data }: IScreenListProps) => {
  return (
    <div className={styles.projectManage}>
      <div className={styles['manage-title']}>
        <div
          className={classnames(styles['my-project'], styles['project-group'])}
          style={{ height: 56 }}
        >
          <span>
            <i
              className="datav-icon datav-font icon-menu project-font"
              style={{ marginRight: 2, fontSize: 19 }}
            />
            我的分组
          </span>
          <i className="datav-icon datav-font icon-add project-font" style={{ fontSize: 24 }} />
        </div>
        <div
          className={classnames(
            styles['my-project'],
            styles['project-all'],
            styles['project-checked-color'],
          )}
        >
          <span>全部应用</span>
          <span className="project-num">{data.length || 0}</span>
        </div>
      </div>
      <div className={styles['manage-main']}>
        <div className={styles['main-project']} style={{ color: 'rgb(188, 201, 212)' }}>
          <span className={classnames(styles['project-name'], styles['project-ungrouped'])}>
            未分组
          </span>
          <span className={classnames(styles['project-num'], styles['project-block'])}>
            {data.length || 0}
          </span>
        </div>
        {/* <div className={styles['main-project']} style={{ color: 'rgb(188, 201, 212)' }}>
          <span className={classnames(styles['project-name'], styles['project-ungrouped'])}>
            未分组2
          </span>
          <span className={classnames(styles['project-num'], styles['project-block'])}>3</span>
        </div> */}
      </div>
    </div>
  );
};
