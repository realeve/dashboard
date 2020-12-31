import styles from './toolbox.less';
import classnames from 'classnames';

export default ({ hide }) => {
  return (
    <div
      className={classnames(styles['toolbox-panel-wp'], {
        [styles['toolbox-hide']]: hide.toolbox,
      })}
    >
      <div className={styles['toolbox-panel']}>工具栏</div>
    </div>
  );
};
