import { defaultRect } from '@/pages/config/lib';
import { isColor } from '@/component/chartItem/option/lib';

import assets from '@/component/widget/assets';

export const getDefaultStyle = (style?: React.CSSProperties) => {
  const rect = {
    ...defaultRect,
    ...style,
  };

  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    position: 'absolute',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  } as React.CSSProperties;
};

const backgroundStyle = { backgroundRepeat: 'repeat', backgroundPosition: 'top center' }; // backgroundRepeat: 'no-repeat',

export const getDashboardStyle = (page: { width: string; height: string; background: string }) => {
  let url = page.background
    ? assets.backgrounds[page.background].url
    : 'url(/img/panel/panelbg.png)';
  let background = isColor(url)
    ? { background: url, backgroundRepeat: 'repeat' }
    : {
        backgroundImage: page.background
          ? `url('${assets.backgrounds[page.background].url}')`
          : 'url(/img/panel/panelbg.png)',
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        ...backgroundStyle,
      };

  return {
    width: `${page.width}px`,
    height: `${page.height}px`,
    ...background,
  };
};
