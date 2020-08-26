import React from 'react';
import assets from '../assets';
import styles from './index.less';
import classnames from 'classnames';
import * as R from 'ramda';
export interface WidgetBorder {
  name?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  [key: string]: any;
}
export const borderNames = Object.keys(assets.borders);

export default ({ name, children, style, className, ...props }: WidgetBorder) => {
  const { url, ...img } = assets.borders[name] || {};
  // let padding = {};
  // if (img) {
  //   Object.keys(img).forEach(key => {
  //     let keyName = key[0].toUpperCase() + key.slice(1);
  //     padding['padding' + keyName] = img[key];
  //   });
  // }
  if (R.isNil(url)) {
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
        // ...padding,
        ...style,
      }}
      {...props}
      className={classnames(styles.widgetBorder, className)}
    >
      {/* {name && url && <img src={url} className={styles.borderImg} />} */}
      {children}
    </div>
  );
};
