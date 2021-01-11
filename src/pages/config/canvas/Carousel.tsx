import React, { useMemo } from 'react';
import type { IAxiosState } from '@/utils/axios';
import { Carousel, Tooltip } from 'antd';

export default ({
  onLoad,
  data,
  Slide,
}: {
  onLoad: (e: string) => void;
  data: IAxiosState[];
  Slide: (e: { dataItem: IAxiosState }) => React.ReactElement;
}) => {
  const hash = !data ? 'unknown' : data[0].hash;

  // TODO 减少重绘
  return useMemo(() => {
    if (data?.length === 1 || !data) {
      return <Slide dataItem={data?.[0]} />;
    }
    return (
      <Carousel
        autoplaySpeed={5000}
        speed={800}
        dots
        pauseOnDotsHover
        arrows
        autoplay
        lazyLoad="ondemand"
        afterChange={(current) => {
          onLoad(data[current]?.title);
        }}
        customPaging={(i) => (
          <Tooltip title={data[i].key} placement="bottom">
            <button style={{ height: 12, borderRadius: '50%' }}>{i}</button>
          </Tooltip>
        )}
      >
        {data.map((item) => (
          <Slide dataItem={item} key={item.key} />
        ))}
      </Carousel>
    );
  }, [hash]);
};
