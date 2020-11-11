import React from 'react';
import assets from '../assets';
import styles from './index.less';
import classnames from 'classnames';
import * as R from 'ramda';
import { ScenaJSXElement } from '@/component/Editor';

export interface WidgetBorder {
  name?: string;
  style?: React.CSSProperties;
  children: ScenaJSXElement;
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
  ...props
}: WidgetBorder) => {
  const { url, ...img } = assets.borders[name] || {};

  if (!showBorder && !showBackground) {
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
