import React from 'react';
import assets from '../assets';
import styles from './index.less';
import classnames from 'classnames';
import * as R from 'ramda';
// import jStat from 'jstat';
export interface WidgetBorder {
  name?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  [key: string]: any;
}
export const borderNames = Object.keys(assets.borders);

export default ({
  name,
  children,
  style,
  showBorder = true,
  className,
  ...props
}: WidgetBorder) => {
  const { url, ...img } = assets.borders[name] || {};

  // let padding = {};
  // if (img) {
  //   Object.keys(img).forEach((key) => {
  //     let keyName = key[0].toUpperCase() + key.slice(1);
  //     padding['padding' + keyName] = img[key];
  //   });
  // }
  if (R.isNil(url) || !showBorder) {
    return (
      <div style={style} className={className} {...props}>
        {children}
      </div>
    );
  }
  // let max = jStat.max([img.left, img.right, img.left, img.top]);

  return (
    <div
      style={{
        borderImageSource: `url(${url})`,
        ...style,
        borderImageSlice: `${img.top} ${img.right} ${img.bottom} ${img.left}`,
        borderWidth: 35,
      }}
      {...props}
      className={classnames(styles.widgetBorder, className)}
    >
      {children}
    </div>
  );
};
