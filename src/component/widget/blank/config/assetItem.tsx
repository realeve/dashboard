import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { isColor } from '@/component/chartItem/option/lib';

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
            <div className={styles.img}>
              {val.url &&
                (isColor(val.url) ? (
                  <div style={{ width: '100%', height: '100%', background: val.url }} />
                ) : (
                  <img src={val.url} alt={name} />
                ))}
            </div>
            <div className={styles.name}>{name}</div>
          </div>
        );
      })}
    </div>
  );
};
