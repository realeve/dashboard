import React, { useState } from 'react';
import styles from './components.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';

const componentList = [
  {
    title: '常规图表',
    icon: 'icon-com-regular',
  },
  {
    title: '地图',
    icon: 'icon-com-map',
  },
  {
    title: '媒体',
    icon: 'icon-com-media',
  },
  {
    title: '文字',
    icon: 'icon-com-text',
  },
  {
    title: '关系网格',
    icon: 'icon-com-network',
  },
  {
    title: '素材',
    icon: 'icon-com-material',
  },
  {
    title: '交互',
    icon: 'icon-com-interact',
  },
  {
    title: '其他',
    icon: 'icon-com-decorate',
  },
  {
    title: '收藏',
    icon: 'icon-com-favorite',
  },
];

export default ({ setHide, hide, ...props }) => {
  const [tab, setTab] = useState(0);
  return (
    <div
      className={classnames(styles['component-panel-wp'], {
        [styles.hide]: hide.components,
        [styles.shrink]: !hide.beauty,
      })}
    >
      <div className={styles['component-panel']}>
        <div className={styles.panelTitle}>
          <span>
            组件列表
            <i
              className={classnames(styles.refreshBtn, 'datav-icon datav-font icon-refresh')}
              title="刷新"
            />
          </span>
          <i
            className={classnames('datav-icon datav-font icon-back', styles.closeBtn)}
            onClick={() => {
              setHide({
                components: !hide.components,
              });
            }}
          />
        </div>
        <div className={styles['component-panel-wrapper']}>
          <div className={styles['datav-tabs']}>
            <div className={styles.nav}>
              <div className={styles.wp}>
                {componentList.map((item, idx) => (
                  <div
                    className={classnames(styles.tab, {
                      [styles.tabActived]: idx == tab,
                    })}
                    onClick={() => {
                      setTab(idx);
                    }}
                  >
                    <Tooltip placement="left" trigger="hover" key={item.icon} title={item.title}>
                      <i
                        className={classnames('com-font', item.icon, {
                          'icon-active': idx == tab,
                        })}
                      />
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.panel}>
                <div className={styles.collapse}>
                  <div className={styles.header}>
                    <i className="datav-icon datav-font icon-right arrow" />
                    <div className={styles['collapse-hd']}>
                      <i className="com-font icon-com-all" />
                      <span>全部(5)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.collapse}>
                  <div className={styles.header}>
                    <i className="datav-icon datav-font icon-right arrow" />
                    <div className={styles['collapse-hd']}>
                      <i className="com-font icon-com-media_image" />
                      <span>图片(2)</span>
                    </div>
                  </div>

                  <div className={styles.wp}>
                    <ul className={styles.menulist}>
                      <li title="单张图片" style={{ border: 0 }}>
                        <div className={styles.text}>单张图片</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage: 'url("/img/config/img_single.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                      <li title="轮播图" style={{ border: 0 }}>
                        <div className={styles.text}>轮播图</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage: 'url("/img/config/img_multi.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={styles.collapse}>
                  <div className={styles.header}>
                    <i
                      className={classnames('datav-icon datav-font icon-right arrow', {
                        [styles.arrowActive]: true,
                      })}
                    />
                    <div className={styles['collapse-hd']}>
                      <i className="com-font con-com-media_video icon-com-media" />
                      <span>视频(3)</span>
                    </div>
                  </div>
                  <div className={styles.wp}>
                    <ul className={styles.menulist}>
                      <li title="RTMP视频播放器" style={{ border: 0 }}>
                        <div className={styles.text}>RTMP视频播放器</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage: 'url("/img/config/video_rtmp.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                      <li title="视频" style={{ border: 0 }}>
                        <div className={styles.text}>视频</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage: 'url("/img/config/video.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                      <li title="萤石云播放器" style={{ border: 0 }}>
                        <div className={styles.text}>萤石云播放器</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage: 'url("/img/config/video_stone.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
