import { defaultRect } from '@/pages/config/lib';
import { isColor } from '@/component/chartItem/option/lib';
import { saveAs } from 'file-saver';
import assets from '@/component/widget/assets';

// 缩放的范围
export const rangeCfg = { min: 0.4, max: 2, step: 0.1 };

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
  const url = page.background
    ? assets.backgrounds[page.background].url
    : 'url(/img/panel/panelbg.png.webp)';
  const background = isColor(url)
    ? { background: url, backgroundRepeat: 'repeat' }
    : {
        backgroundImage: page.background
          ? `url('${assets.backgrounds[page.background].url}')`
          : 'url(/img/panel/panelbg.png.webp)',
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

/**
 * 计算画布有效滚动范围
 * 推导过程见：
 * https://github.com/realeve/dashboard_assets/blob/main/public/doc/%E7%94%BB%E5%B8%83%E6%9C%89%E6%95%88%E7%BC%A9%E6%94%BE%E8%B7%9D%E7%A6%BB%E6%8E%A8%E7%AE%97.xlsx
 *
 * y=1728.6x-1517.9
 *
 * 设 边距为 margin
 * 根据推导：x = (width-margin)*zoom-(width-2*margin)
 *            = width*(zoom-1) + (2-zoom)*margin;
 * 当zoom为1时，x = margin,即向右滚动margin区域，正好把左侧的margin略过，屏幕显示范围为:(画布宽-边距)+边距 === 画布宽；
 *
 *
 * y=1124.6x-765.8
 *
 * y = height*zoom-(height-2*margin)
 *   = height*(zoom-1)+2*margin
 *
 * zoom为1时，滚动2倍margin
 *
 */

/**
 * @param width 页面宽
 * @param hideWidth 页面被隐藏的宽
 * @param height 页面高
 * @param zoom 缩放系数
 */
export const calcCanvasRange = (
  { width, hideWidth = 0, height }: { width: number; hideWidth?: number; height: number },
  zoom,
) => {
  const margin = 200;

  let x = 0;
  let y = 0;
  if (zoom <= 0.8) {
    x = -margin;
  } else {
    x = width * (zoom - 1) + (2 - zoom) * margin;
  }

  if (zoom <= 0.5) {
    y = -margin;
  } else {
    y = height * (zoom - 1) + 2 * margin;
  }
  return {
    x: [-margin, x + hideWidth],
    y: [-margin, y],
  };
};

// jpg to webp
export const getThumbnail = async (
  canvasEl: HTMLElement,
  { scale = 1, quality = 0.8, filename = null },
) => {
  const imageType = 'image/webp';
  return import('html2canvas').then(({ default: html2canvas }) =>
    html2canvas(canvasEl, {
      backgroundColor: null,
      scale,
    }).then((canvas) => {
      /* canvas.toBlob 对于各个浏览器有兼容问题. ie会报错没有toBlob对象
       * 解决方式：引入canvas-toBlob.js（https://github.com/eligrey/canvas-toBlob.js/blob/master/canvas-toBlob.js）
       * */
      if (filename) {
        canvas.toBlob(
          (blob) => {
            saveAs(blob, `${filename}.webp`);
          },
          imageType,
          quality,
        );
        return null;
      }

      return canvas.toDataURL(imageType, quality);
    }),
  );
};
