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
  console.log(style);
  if (!style) {
    return {};
  }

  // TODO 1.将transform中的translate部分转换为left和top
  // TODO 2.根据 page 的宽高和当前 window 的宽高做尺寸转换
  return {
    ...style,
    transform: `translate(${style?.transform?.translate}) rotate(${style?.transform?.rotate}) scale(${style?.transform?.scale})`,
  };
};
