import React, { Children } from 'react';
import assets from '../assets';
import styles from './index.less';

export interface WidgetBorder {
  name?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  [key: string]: any;
}
export const borderNames = Object.keys(assets.borders);

export default ({ name, children, style, ...props }: WidgetBorder) => {
  const { url, ...img } = assets.borders[name] || {};
  let padding = {};
  if (img) {
    Object.keys(img).forEach(key => {
      let keyName = key[0].toUpperCase() + key.slice(1);
      padding['padding' + keyName] = img[key];
    });
  }
  console.log(padding);
  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', ...padding, ...style }}
      {...props}
    >
      {name && url && <img src={url} className={styles.borderImg} />}
      {children}
    </div>
  );
};
