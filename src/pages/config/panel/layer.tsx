import React from 'react';
import styles from './layer.less';
import classnames from 'classnames';
import { useToggle } from 'react-use';

export default ({ setHide, hide, ...props }) => {
  const [isThumb, setIsThumb] = useToggle(true);
  return (
    <div
      className={classnames(styles['layer-panel-wp'], {
        [styles.hide]: hide.layer,
      })}
    >
      <div className={styles['layer-manager-top']}>
        <div className={styles['layer-num']}>图层</div>
        <div className={styles['layer-manager-layout-selector']}>
          <i
            className={classnames('datav-icon datav-font icon-logo', {
              [styles.selected]: isThumb,
            })}
            title="缩略图版"
            onClick={setIsThumb}
          />
          <i
            className={classnames('datav-icon datav-font icon-list', {
              [styles.selected]: !isThumb,
            })}
            title="文字版"
            onClick={setIsThumb}
          />
          <i
            className="datav-icon datav-font icon-back"
            onClick={() => {
              setHide({
                layer: !hide.layer,
              });
            }}
          />
        </div>
      </div>
      <div className={styles.toolbar}>
        <i
          className={classnames(
            'datav-icon datav-font icon-move-prev',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]: true,
            },
          )}
          title="上移一层"
        />
        <i
          className={classnames(
            'datav-icon datav-font icon-move-next',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]: true,
            },
          )}
          title="下移一层"
        />
        <i
          className={classnames('datav-icon datav-font icon-to-top', styles['layer-toolbar-icon'], {
            [styles.enable]: false,
          })}
          title="置顶"
        />
        <i
          className={classnames(
            'datav-icon datav-font icon-to-bottom',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]: false,
            },
          )}
          title="置底"
        />
      </div>
    </div>
  );
};
