import React from 'react';
// 此处导入你所需要的自定义组件
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';

import assets from '@/component/widget/assets';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'imgname',
    type: 'image',
    imgtype: 'pics',
    defaultValue: '旋转gif',
    title: '图片选择',
  },
];

export const apiConfig: IApiConfig = {};

export default ({ option: { imgname }, style }) => {
  let url = assets.pics[imgname]?.url;
  return (
    <div style={{ color: '#fff', fontSize: 30 }}>
      <img src={url} style={{ width: '100%' }} />
    </div>
  );
};
