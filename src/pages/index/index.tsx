import React, { useEffect, useState } from 'react';
import DNA from './dna';
import styles from './index.less';
import {
  getConfig,
  getStyle,
  getAutoSizeStyle,
  getBackground,
  getResizeType,
  EResizeType,
} from './lib';
import { getDashboardStyle } from '@/component/Editor/lib';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';
import { ChartItem } from '@/pages/config/canvas/chartItem';
import { useLocation } from 'umi';
const ScaleBackground = ({
  resizeType,
  page,
  children,
}: {
  resizeType: EResizeType;
  page: { width: string; height: string; background: string };
  children: React.ReactNode;
}) => {
  // 直接缩放
  if ([EResizeType.SCALE].includes(resizeType)) {
    return (
      <div className={styles.dashboard} style={getBackground(page)}>
        <div style={getAutoSizeStyle(page, resizeType)}>{children}</div>
      </div>
    );
  } else if (resizeType === EResizeType.MOVIE) {
    let autosize = getAutoSizeStyle(page, resizeType);
    let bg = getBackground(page);
    let bgStyle = bg.background
      ? { background: bg.background }
      : { backgroundImage: bg.backgroundImage };

    return (
      <div style={{ ...bgStyle, backgroundRepeat: 'repeat' }} className={styles.movieDashboard}>
        <div className={styles.dashboard} style={{ ...bg, ...autosize }}>
          <div style={{ width: '100%', height: '100%' }}>{children}</div>
        </div>
      </div>
    );
  } else if (resizeType === EResizeType.COMPONENT) {
    return (
      <div className={styles.dashboard} style={getDashboardStyle(page)}>
        {children}
      </div>
    );
  } else {
    return (
      <div className={styles.dashboard} style={getDashboardStyle(page)}>
        {children}
      </div>
    );
  }
};
/**
 *
 * @enum autoresize=scale(横纵向缩放)
 * @enum autoresize=component:(只缩放组件的尺寸和位置)
 * @enum 不设置或其它(不缩放)
 * @enum autoresize=movie(电影一样留出左右两边)
 */
// DEMO:  http://localhost:8000/?id=/data/YiBiaoPan.json&autoresize=component
const Index = () => {
  const [config, setConfig] = useState(null);

  let location = useLocation<{ query: {} }>();

  useEffect(() => {
    setConfig(null);
    getConfig(location?.query.id).then(setConfig);
  }, [location?.query.id]);
  if (!config) {
    return <DNA />;
  }
  let { page, panel, type } = config,
    autoSize = location?.query?.autoresize;
  if (type == 'notExist') {
    return <DNA title={`文件${location?.query?.id}加载失败，请检查是否上传!`} />;
  }

  let resizeType = getResizeType(autoSize);

  return (
    <ScaleBackground resizeType={resizeType} page={page}>
      {panel.map(
        (item) =>
          ![SCREEN_EDGE_KEY, GROUP_COMPONENT_KEY].includes(item.key) && (
            <div style={getStyle({ style: item.style, resizeType, page })} key={item.id}>
              <ChartItem config={item} page={page} />
            </div>
          ),
      )}
    </ScaleBackground>
  );
};

export default Index;
