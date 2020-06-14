import React from 'react';
import styles from './components.less';
import classnames from 'classnames';

export default ({ setHide, hide, ...props }) => {
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
                <div className={styles.tab}>
                  <i className="com-font  icon-com-regular" />
                </div>
                <div className={classnames(styles.tab, styles.tabActived)}>
                  <i className="com-font  icon-com-map icon-active" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-media" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-text" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-network" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-material" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-interact" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-decorate" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-favorite" />
                </div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.panel}>
                <div className={styles.collapse}>
                  <div className={styles.header}>
                    <i className="datav-icon datav-font icon-right datav-collapse-panel-arrow" />
                    <div className={styles['collapse-hd']}>
                      <i className="com-font datav-com-icon icon-com-default icon-com-all" />
                      <span>全部(5)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.collapse}>
                  <div className={styles.header}>
                    <i className="datav-icon datav-font icon-right datav-collapse-panel-arrow" />
                    <div className={styles['collapse-hd']}>
                      <i className="com-font datav-com-icon icon-com-default con-com-media_image icon-com-medial" />
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
                            backgroundImage:
                              'url("//img.alicdn.com/tfs/TB1pImNlF67gK0jSZPfXXahhFXa-334-144.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                      <li title="轮播图" style={{ border: 0 }}>
                        <div className={styles.text}>轮播图</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage:
                              'url("//img.alicdn.com/tfs/TB17pTqlND1gK0jSZFKXXcJrVXa-334-144.png")',
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
                      className="datav-icon datav-font icon-right datav-collapse-panel-arrow"
                      style={{ transform: 'rotate(0.25turn)' }}
                    />
                    <div className={styles['collapse-hd']}>
                      <i className="com-font datav-com-icon icon-com-default con-com-media_video icon-com-medial" />
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
                            backgroundImage:
                              'url("//img.alicdn.com/tfs/TB1IhfqlUY1gK0jSZFCXXcwqXXa-334-144.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                      <li title="视频" style={{ border: 0 }}>
                        <div className={styles.text}>视频</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage:
                              'url("http://img.alicdn.com/tfs/TB14jnqlHj1gK0jSZFuXXcrHpXa-334-144.png")',
                            pointerEvents: 'none',
                          }}
                        />
                      </li>
                      <li title="萤石云播放器" style={{ border: 0 }}>
                        <div className={styles.text}>萤石云播放器</div>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage:
                              'url("//img.alicdn.com/tfs/TB1hTYnlQY2gK0jSZFgXXc5OFXa-334-144.png")',
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
