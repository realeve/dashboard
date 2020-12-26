import React, { useRef, useEffect } from 'react';
import { IChartConfig } from '@/component/chartItem/interface';
import { ASSETS_HOST } from '@/utils/setting';

export const config: IChartConfig[] = [
  {
    title: '视频地址',
    key: 'video_url',
    valueType: 'text',
    defaultValue: ASSETS_HOST + 'video/01.mp4.webm',
  },
  {
    title: '圆角',
    key: 'borderRadius',
    defaultValue: [18, 18, 18, 18],
    length: 4,
    type: 'slider',
    valueType: 'number',
    step: 1,
    min: 0,
    split: '',
    style: { width: 50, minWidth: 50 },
  },
  {
    title: '边距',
    key: 'padding',
    type: 'range',
    min: 0,
    step: 1,
    max: 20,
    defaultValue: 0,
  },
  {
    title: '透明度',
    key: 'opacity',
    type: 'range',
    min: 0,
    max: 1,
    defaultValue: 1,
    step: 0.1,
  },
  {
    title: '自适应高度',
    key: 'autoHeight',
    type: 'switch',
    defaultValue: true,
  },
  {
    title: '静音',
    key: 'muted',
    type: 'switch',
    defaultValue: true,
  },
  {
    title: '视频控制条',
    key: 'controls',
    type: 'switch',
    defaultValue: true,
  },
  {
    title: '播放速度',
    key: 'playbackRate',
    type: 'range',
    min: 0.1,
    max: 2,
    step: 0.1,
  },
  {
    title: '渐隐遮罩',
    key: 'fadeIn',
    type: 'switch',
    defaultValue: false,
  },
  {
    title: '渐隐边界颜色',
    key: 'fadeColor',
    type: 'purecolor',
    defaultValue: '#0c0131',
    noAnimation: true,
  },
  {
    title: '渐隐分隔距离',
    key: 'fadePosition',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 60,
  },
];

export default ({
  option: {
    video_url,
    borderRadius,
    padding,
    opacity,
    autoHeight,
    muted,
    controls,
    playbackRate = 1,
    fadeIn,
    fadeColor,
    fadePosition,
  },
  style,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <>
      {fadeIn && (
        <div
          style={{
            width: '100%',
            height: '50%',
            position: 'absolute',
            left: 0,
            top: 0,
            background: `linear-gradient(0deg, transparent 0%,${fadeColor} ${fadePosition}%)`,
            zIndex: 2,
          }}
        />
      )}
      <video
        ref={ref}
        src={video_url}
        autoPlay
        controls={controls}
        loop
        muted={muted}
        style={{
          width: '100%',
          ...style,
          padding,
          opacity,
          borderRadius: borderRadius.map((item) => item + 'px').join(' '),
          height: autoHeight ? 'auto' : '100%',
          objectFit: 'fill',
          zIndex: 1,
        }}
      />
    </>
  );
};
