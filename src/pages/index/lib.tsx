import { axios } from '@/utils/axios';
export const getConfig = async (url) => {
  if (url) {
    let option: { url: string; [key: string]: string } = { url };
    if (['./data/', '/data/'].includes(url.slice(0, 6))) {
      option = {
        ...option,
        baseURL: window.location.origin,
      };
    }
    return axios(option).then((config) => ({ type: 'online', ...config }));
  }
  let { panel, page } = window.localStorage;
  if (!panel || !page) {
    return { type: 'error' };
  }
  return { type: 'local', page: JSON.parse(page), panel: JSON.parse(panel) };
};

/**
 * 计算主页渲染的样式
 * @param style 在config中配置的样式，计算为主页渲染所需的样式
 */
export const getStyle = ({ style, page }) => {
  if (!style) {
    return {};
  }

  // TODO 1.将transform中的translate部分转换为left和top
  // 将transform中的内容优化
  let { left = '0', top = '0', transform } = style;

  left = Number(left.replace('px', ''));
  top = Number(top.replace('px', ''));

  let rotate = '',
    scale = '',
    _transform = {};

  if (transform) {
    let translate = transform.translate;
    if (translate) {
      translate = translate
        .replace(/px/g, '')
        .split(',')
        .map((item) => Number(item));
      left += translate[0];
      top += translate[1];
    }
    rotate = Number(transform.rotate.replace('deg', '')) > 0 ? `rotate(${transform?.rotate}) ` : '';
    scale = transform.scale == '1,1' ? '' : `scale(${transform?.scale})`;
    _transform = (rotate + scale).length > 0 ? { transform: rotate + scale } : {};
  }

  // TODO 2.根据 page 的宽高和当前 window 的宽高做尺寸转换
  return {
    ...style,
    left,
    top,
    ..._transform,
    position: 'absolute',
  };
};
