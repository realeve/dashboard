import React, { useEffect, useState, useRef, Suspense } from 'react';
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
import type { ICommon } from '@/models/common';
import { ChartItem } from '@/pages/config/canvas/chartItem';
import * as R from 'ramda';
import { Carousel } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { useInterval } from 'react-use';
import Play from '@/component/widget/Play';

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
  currentDashboardPage,
}: {
  config?: any;
  url: string;
  autoSize: any;
  /** 是否是当前页面索引 */
  currentDashboardPage: boolean;
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
              <ChartItem config={item} page={page} currentDashboardPage={currentDashboardPage} />
            </div>
          ),
      )}
    </ScaleBackground>
  );
};

interface IDashboardPageProps {
  dashboardPage: number;
  location: {
    query: {
      id: string;
      autoresize: 'scale' | 'component' | 'movie';
      speed: string;
    };
  };
  dispatch: Dispatch;
}

/**
 *
 * @enum autoresize=scale(横纵向缩放)
 * @enum autoresize=component:(只缩放组件的尺寸和位置)
 * @enum 不设置或其它(不缩放)
 * @enum autoresize=movie(电影一样留出左右两边)
 */
// DEMO:  http://localhost:8000/?id=/data/YiBiaoPan.json&autoresize=component
const Index = ({ dashboardPage, location, dispatch }: IDashboardPageProps) => {
  const [config, setConfig] = useState(null);
  const [current, setCurrent] = useState(dashboardPage);
  const ref = useRef(null);

  useEffect(() => {
    setConfig(null);
    getConfig(location?.query.id).then(setConfig);
  }, [location?.query.id]);

  const isCarousel = R.type(config) === 'Array';

  const [play, setPlay] = useState(true);

  const gotoNext = () => {
    if (current === config.length - 1) {
      ref.current?.goTo(0);
      return;
    }
    ref.current?.next();
  };

  const gotoPrev = () => {
    if (current === 0) {
      ref.current?.goTo(config.length - 1);
      return;
    }
    ref.current?.prev();
  };

  useInterval(gotoNext, play && isCarousel ? Number(location?.query?.speed || 60) * 1000 : null);

  const autoSize = location?.query?.autoresize;
  if (!config) {
    return <DNA />;
  }

  if (isCarousel) {
    // DONE 当前页面未展示时，禁止数据加载；
    return (
      <Suspense fallback={null}>
        <Play
          play={play}
          setPlay={setPlay}
          className={styles.arrow}
          gotoNext={gotoNext}
          gotoPrev={gotoPrev}
        />
        <Carousel
          speed={800}
          ref={ref}
          /** 当启用infinite及autoplay时，自动开始滚动，此时假设有2个页面，会渲染出5个页面，页面中的数据请求会多次重复发起 */
          /** 此处需要关闭 infinite 及autoplay，在外层通过事件来触发滚动 */
          autoplay={false}
          infinite={false}
          pauseOnDotsHover={false}
          pauseOnFocus={false}
          arrows={false}
          lazyLoad="ondemand"
          beforeChange={(_, nextSlide) => {
            dispatch({
              type: 'common/setStore',
              payload: {
                dashboardPage: nextSlide,
              },
            });
            setCurrent(nextSlide);
          }}
          dots={false}
          // dots
          // customPaging={(i) => (
          //   <Tooltip title={config[i].title} placement="bottom">
          //     <button style={{ height: 12, borderRadius: '50%' }}>{i}</button>
          //   </Tooltip>
          // )}
        >
          {config.map((item, idx) => (
            <DashBoard
              currentDashboardPage={idx === dashboardPage}
              key={item.url}
              url={item.url}
              autoSize={autoSize}
            />
          ))}
        </Carousel>
      </Suspense>
    );
  }

  return (
    <DashBoard
      currentDashboardPage={current === dashboardPage}
      config={config}
      url={location?.query?.id}
      autoSize={autoSize}
    />
  );
};

export default connect(({ common: { dashboardPage } }: { common: ICommon }) => ({ dashboardPage }))(
  Index,
);
