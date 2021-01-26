import React, { useEffect, useState } from 'react';
import DNA from './dna';
import styles from './index.less';
import stylesChart from '@/pages/config/canvas/Report.less';
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
import * as R from 'ramda';
import { Carousel, Tooltip } from 'antd';

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
  }
  if (resizeType === EResizeType.MOVIE) {
    const autosize = getAutoSizeStyle(page, resizeType);
    const bg = getBackground(page);
    const bgStyle = bg.background
      ? { background: bg.background }
      : { backgroundImage: bg.backgroundImage };

    return (
      <div style={{ ...bgStyle, backgroundRepeat: 'repeat' }} className={styles.movieDashboard}>
        <div className={styles.dashboard} style={{ ...bg, ...autosize }}>
          <div style={{ width: '100%', height: '100%' }}>{children}</div>
        </div>
      </div>
    );
  }
  if (resizeType === EResizeType.COMPONENT) {
    return (
      <div className={styles.dashboard} style={getDashboardStyle(page)}>
        {children}
      </div>
    );
  }
  return (
    <div className={styles.dashboard} style={getDashboardStyle(page)}>
      {children}
    </div>
  );
};

const DashBoard = ({
  config: propConfig,
  url,
  autoSize,
}: {
  config?: any;
  url: string;
  autoSize: any;
}) => {
  const [config, setConfig] = useState(propConfig);

  useEffect(() => {
    if (propConfig) {
      return;
    }
    setConfig(null);
    getConfig(url).then(setConfig);
  }, [url]);

  if (!config) {
    return <DNA />;
  }

  const { page, panel, type } = config;
  if (type === 'notExist') {
    return <DNA title={`文件${url}加载失败，请检查是否上传!`} />;
  }

  const resizeType = getResizeType(autoSize);

  return (
    <ScaleBackground resizeType={resizeType} page={page}>
      {panel.map(
        (item) =>
          ![SCREEN_EDGE_KEY, GROUP_COMPONENT_KEY].includes(item.key) && (
            <div
              className={stylesChart.chart_report_wrapper}
              style={getStyle({ style: item.style, resizeType, page })}
              key={item.id}
            >
              <ChartItem config={item} page={page} />
            </div>
          ),
      )}
    </ScaleBackground>
  );
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
  // const [current, setCurrent] = useState(0);

  const location = useLocation<{ query: Record<string, any> }>();

  useEffect(() => {
    setConfig(null);
    getConfig(location?.query.id).then(setConfig);
  }, [location?.query.id]);

  const autoSize = location?.query?.autoresize;

  if (!config) {
    return <DNA />;
  }

  if (R.type(config) === 'Array') {
    return (
      <Carousel
        autoplaySpeed={(location?.query?.speed || 10) * 1000}
        speed={800}
        dots
        pauseOnDotsHover={false}
        pauseOnFocus={false}
        arrows={false}
        autoplay
        lazyLoad="ondemand"
        // afterChange={(e) => {
        //   setCurrent(e);
        // }}
        customPaging={(i) => (
          <Tooltip title={config[i].title} placement="bottom">
            <button style={{ height: 12, borderRadius: '50%' }}>{i}</button>
          </Tooltip>
        )}
      >
        {config.map((item) => (
          <DashBoard key={item.url} url={item.url} autoSize={autoSize} />
        ))}
      </Carousel>
    );
  }

  return <DashBoard config={config} url={location?.query?.id} autoSize={autoSize} />;
};

export default Index;
