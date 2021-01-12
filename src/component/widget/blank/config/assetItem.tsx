import styles from './index.less';
import classnames from 'classnames';
import { isColor } from '@/component/chartItem/option/lib';
import { ASSETS_URL_LIST } from '@/utils/setting';

export default ({ value, style = {}, onChange, assets }) => {
  return (
    <div className={styles.configGrid} style={style}>
      {Object.entries(assets).map(([name, val]: [string, { url: string }]) => {
        return (
          <div
            key={name}
            className={classnames(styles.item, {
              [styles.itemActive]: value === assets[name].url,
            })}
            onClick={() => {
              const { url, top = 0, right = 0, bottom = 0, left = 0 } = assets[name];
              onChange(url.replace(ASSETS_URL_LIST[0], '').replace(ASSETS_URL_LIST[1], ''), [
                top,
                right,
                bottom,
                left,
              ]);
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
