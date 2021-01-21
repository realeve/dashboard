import React, { useMemo } from 'react';
import type { IAxiosState } from '@/utils/axios';
import { Carousel, Tooltip } from 'antd';

export default ({
  onLoad,
  injectProps: { data, ...props },
  Slide,
}: {
  onLoad: (e: string) => void;
  injectProps: { data: IAxiosState[] };
  Slide: (e: { dataItem?: IAxiosState }) => React.ReactElement;
}) => {
  if (!data?.[0]) {
    return <Slide />;
  }

  const hash = data?.[0]?.hash;

  return useMemo(
    () => (
      <Carousel
        autoplaySpeed={(props?.carouselTime || 10) * 1000}
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
    ),
    [hash, JSON.stringify(props)],
  );
};
