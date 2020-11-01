import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

export default ({ value, style = {}, onChange, assets }) => {
  return (
    <div className={styles['configGrid']} style={style}>
      {Object.entries(assets).map(([name, val]: [string, { url: string }]) => {
        return (
          <div
            key={name}
            className={classnames(styles.item, {
              [styles.itemActive]: value === name,
            })}
            onClick={() => {
              onChange(name);
            }}
          >
            <div className={styles.img}>{val.url && <img src={val.url} alt={name} />}</div>
            <div className={styles.name}>{name}</div>
          </div>
        );
      })}
    </div>
  );
};
