import React from 'react';
import { IChartConfig } from '@/component/chartItem/interface';

export const config: IChartConfig[] = [
  {
    title: '视频地址',
    key: 'video_url',
    valueType: 'text',
    defaultValue:
      'http://cdn.cdyc.cbpm/assets/2020/09/video/1601430710_715360BZCHTub4NmYr8C6jbiTYJY8WEV1eIGic.mp4',
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
];

export default ({ option: { video_url, borderRadius, padding }, style }) => {
  return (
    <video
      src={video_url}
      autoPlay
      controls
      style={{
        width: '100%',
        ...style,
        padding,
        borderRadius: borderRadius.map((item) => item + 'px').join(' '),
      }}
    />
  );
};
