import borders from '../assets/borders';
import styles from './index.less';
import classnames from 'classnames';
import * as R from 'ramda';
import type { ScenaJSXElement } from '@/component/Editor/types';
import type { TChartEngine } from '@/models/common';

import type { Dispatch } from 'redux';
import { useLocation } from 'react-use';

export interface WidgetBorder {
  name?: string;
  style?: React.CSSProperties;
  children: ScenaJSXElement | React.ReactNode;
  engine?: TChartEngine;
  dispatch?: Dispatch;
  [key: string]: any;
}
export const borderNames = Object.keys(borders);

export default ({
  name: url,
  borderSlice: img = [0, 0, 0, 0],
  children,
  style,
  showBorder = true,
  showBackground = true,
  className,
  engine = 'other',
  dispatch,
  ...props
}: WidgetBorder) => {
  const { pathname } = useLocation();

  // 11-12
  // 只在首页直接显示，在config配置页需要显示父层div，否则无法编辑
  if (!showBorder && ((!showBackground && pathname === '/') || engine !== 'other')) {
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
        borderImageSlice: `${img.join(' ')} fill`,
        borderWidth: img.map((item) => `${item} px`).join(' '), // img.borderWidth || Math.min(25, max),
        borderStyle: 'solid',
      }}
      {...props}
      className={classnames(styles.widgetBorder, className)}
    >
      {children}
    </div>
  );
};
