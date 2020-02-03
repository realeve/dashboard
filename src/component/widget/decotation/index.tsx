import React from 'react';
import assets from '../assets';
import styles from './index.less';
import classnames from 'classnames';

export interface WidgetDecoration {
  name?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  [key: string]: any;
}
export const borderNames = Object.keys(assets.borders);

export default ({ name, children, style, className, ...props }: WidgetDecoration) => {
  const { url, animate, node, ...img } = assets.pics[name] || {};

  return (
    <div
      style={{
        // borderImageSource: `url(${url})`,
        ...style,
      }}
      {...props}
      className={classnames(styles.widgetDecotation, className)}
    >
      {name && url && <img src={url} className={classnames(styles.borderImg, styles[animate])} />}
      {node && children}
    </div>
  );
};
