import React, { useState } from 'react';
import { assets } from '@/component/widget';
import styles from './index.less';
import classnames from 'classnames';
let borderKeys = Object.keys(assets.borders);

export default ({ onChange }) => {
  const [active, setActive] = useState(null);

  return (
    <div className={styles.configGrid}>
      {borderKeys.map((name, idx) => {
        let val = assets.borders[name];
        return (
          <div
            key={name}
            className={classnames(styles.item, {
              [styles.itemActive]: active === idx,
            })}
            onClick={() => {
              setActive(idx);
              onChange(name);
            }}
          >
            <div className={styles.img}>
              <img src={val.url} alt={name} />
            </div>
            <div className={styles.name}>{name}</div>
          </div>
        );
      })}
    </div>
  );
};
