import React from 'react';
import { IChartConfig } from '@/component/chartItem/interface';

export const config: IChartConfig[] = [
  {
    title: '视频地址',
    key: 'video_url',
    defaultValue:
      'http://cdn.cdyc.cbpm/assets/2020/09/video/1601430710_715360BZCHTub4NmYr8C6jbiTYJY8WEV1eIGic.mp4',
  },
];

export default ({ option: { video_url }, style }) => {
  return <video src={video_url} autoPlay controls style={{ width: '100%', ...style }} />;
};
