import React from 'react';
import { assets } from '@/component/widget';
import styles from './index.less';
import classnames from 'classnames';

export default ({ value,style={}, onChange, assetKey = 'borders' }) => {
  let keys = Object.keys(assets[assetKey]);

  return (
    <div
      className={styles[['headers', 'footers'].includes(assetKey) ? 'configList' : 'configGrid']}
      style={style}
    >
      {keys.map((name, idx) => {
        let val = assets[assetKey][name];
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
