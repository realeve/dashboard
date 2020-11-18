import React from 'react';
import assets from '../assets';
import styles from './index.less';
import classnames from 'classnames';
import * as R from 'ramda';
import { ScenaJSXElement } from '@/component/Editor';
import { TChartEngine } from '@/models/common';
export interface WidgetBorder {
  name?: string;
  style?: React.CSSProperties;
  children: ScenaJSXElement;
  engine?: TChartEngine;
  [key: string]: any;
}
export const borderNames = Object.keys(assets.borders);

export default ({
  name,
  children,
  style,
  showBorder = true,
  showBackground = true,
  className,
  engine = 'other',
  ...props
}: WidgetBorder) => {
  const { url, ...img } = assets.borders[name] || {};

  // 11-12
  // 只在首页直接显示，在config配置页需要显示父层div，否则无法编辑
  if (!showBorder && ((!showBackground && window.location.pathname == '/') || engine !== 'other')) {
    return children;
  }

  if (R.isNil(url) || !showBorder) {
    return (
      <div style={style} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        borderImageSource: `url(${url})`,
        ...style,
        borderImageSlice: `${img.top} ${img.right} ${img.bottom} ${img.left} fill`,
        borderWidth: `${img.top}px ${img.right}px ${img.bottom}px ${img.left}px`, //img.borderWidth || Math.min(25, max),
        borderStyle: 'solid',
      }}
      {...props}
      className={classnames(styles.widgetBorder, className)}
    >
      {children}
    </div>
  );
};
