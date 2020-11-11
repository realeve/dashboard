import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
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
import { getDashboardStyle } from '@/component/Editor/Editor';
import { GROUP_COMPONENT_KEY } from '@/models/common';
import { ChartItem } from '@/pages/config/canvas/chartItem';

import { useWindowSize } from 'react-use';

const ScaleBackground = ({
  resizeType,
  page,
  children,
}: {
  resizeType: EResizeType;
  page: {};
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
    return (
      <div
        style={{ backgroundImage: bg.backgroundImage, backgroundRepeat: 'repeat' }}
        className={styles.movieDashboard}
      >
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
// DEMO:  http://localhost:8000/?id=/data/01.json&autoresize=component
const Index = ({ location }) => {
  const [config, setConfig] = useState(null);

  const { width, height } = useWindowSize();

  useEffect(() => {
    setConfig(null);
    getConfig(location?.query.id).then(setConfig);
  }, [location?.query.id]);
  if (!config) {
    return <DNA />;
  }
  let { page, panel } = config,
    autoSize = location?.query?.autoresize;

  let resizeType = getResizeType(autoSize);

  return (
    <ScaleBackground resizeType={resizeType} page={page}>
      {panel.map(
        (item) =>
          item.key !== GROUP_COMPONENT_KEY && (
            <div style={getStyle({ style: item.style, resizeType, page })} key={item.id}>
              <ChartItem config={item} page={page} />
            </div>
          ),
      )}
    </ScaleBackground>
  );
};

export default connect()(Index);
