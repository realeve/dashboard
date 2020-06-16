import React, { useState } from 'react';
import styles from './layer.less';
import classnames from 'classnames';
import { useToggle } from 'react-use';

const layerList = [
  {
    type: 'pie.basic',
    img: '//resource.datav.aliyun.com/cube/com/@xhzy-anime/single-piechart/0.0.2/icons/cover.png',
    title: '基本饼图',
    icon: 'com-font icon-com-regular_pie',
  },
  {
    type: 'column.multi',
    img: '//resource.datav.aliyun.com/cube/com/@xhzy-anime/multiple-barchart/0.0.1/icons/cover.png',
    title: '多柱状图',
    icon: 'com-font icon-com-regular_bar',
  },
];

export default ({ setHide, hide, ...props }) => {
  const [isThumb, setIsThumb] = useToggle(true);

  const [selected, setSelected] = useState(null);

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

      <div className={styles.layerWrap}>
        {layerList.map(item => (
          <li
            key={item.type}
            className={classnames({
              [styles.thumbnail]: isThumb,
              [styles.selected]: selected === item.type,
            })}
            onClick={() => {
              setSelected(item.type);
            }}
          >
            {!isThumb ? (
              <i className={item.icon} />
            ) : (
              <img src={item.img} alt={item.title} className={styles.img} />
            )}

            <div className={styles.text}>
              <span>{item.title}</span>
            </div>
          </li>
        ))}
        <div
          className={styles['last-flex-item']}
          onClick={() => {
            setSelected(null);
          }}
        />
      </div>
    </div>
  );
};
