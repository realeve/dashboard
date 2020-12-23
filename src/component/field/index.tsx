import styles from './index.less';
import classnames from 'classnames';

export { ImgSelector } from '@/pages/config/panel/setting/page';

export default ({
  title = null,
  disabled = false,
  children = null,
  style = {},
  titleWidth = 100,
  className = '',
  subTitle = null,
}) => {
  return (
    <div className={classnames(styles.field, className)} style={style}>
      {title && (
        <div title={subTitle || title} className={styles.title} style={{ width: titleWidth }}>
          {disabled && '🔒'} {title}
        </div>
      )}
      <div className={classnames(styles.container, { [styles.notitle]: !title })}>
        <div className={styles.component}>{children}</div>
      </div>
    </div>
  );
};
