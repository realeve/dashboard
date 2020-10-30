import React from 'react';
// 此处导入你所需要的自定义组件
import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';

import assets from '@/component/widget/assets';
import classnames from 'classnames';
import styles from './index.less';

export const config: IChartConfig[] = [
  {
    key: 'imgname',
    type: 'image',
    imgtype: 'pics',
    defaultValue: '旋转gif',
    title: '图片选择',
  },
  {
    type: 'divider',
    title: '旋转特效',
  },
  {
    key: 'rotate',
    type: 'switch',
    defaultValue: false,
    title: '是否旋转',
  },
  {
    key: 'reverse',
    type: 'switch',
    defaultValue: false,
    title: '逆时针',
  },
  {
    key: 'rotateTime',
    type: 'range',
    defaultValue: 20,
    title: '速度/每圈',
    min: 1,
    max: 100,
    step: 1,
  },
  {
    key: 'opacity',
    type: 'range',
    defaultValue: 1,
    title: '透明度',
    min: 0.1,
    max: 1,
    step: 0.05,
  },
];

export const apiConfig: IApiConfig = {};

export default ({
  option: { imgname = '旋转gif', rotate = false, rotateTime = 20, reverse = true, opacity = 1 },
}) => {
  let url = assets.pics[imgname]?.url;
  return (
    <div className={styles.imgWrapper}>
      <img
        src={url}
        style={{
          width: '100%',
          opacity,
          animationDuration: rotateTime + 's',
          animationName: rotate && (reverse ? 'rotateZReverse' : 'rotateZ'),
        }}
        className={classnames({ [styles.rotate]: rotate })}
      />
    </div>
  );
};
