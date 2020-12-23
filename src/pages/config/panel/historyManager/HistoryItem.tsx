import styles from './HistoryItem.less';
import classnames from 'classnames';

export default ({ value, onUpdate, active = false }) => (
  <li
    className={classnames(styles.li, {
      [styles.active]: active,
    })}
    onClick={onUpdate}
  >
    {value}
  </li>
);
