import { axios } from '@/utils/axios';
import { getDashboardStyle } from '@/component/Editor/Editor';

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
 * 将style中   233px 转换为 数值型 233
 * @param style 样式内容
 * @param unit 单位
 */
const parseStyle = (style: string, unit = 'px') => {
  let reg = RegExp(unit, 'g');
  return Number(style.replace(reg, ''));
};

/**
 * 计算主页渲染的样式
 * @param style 在config中配置的样式，计算为主页渲染所需的样式
 * @param page 页面宽高配置
 * @param autoResize 是否启动自动调整页面大小
 */
export const getStyle = ({ style, page, autoSize = false }) => {
  if (!style) {
    return {};
  }

  // STEP 1.将transform中的translate部分转换为left和top
  // 将transform中的内容优化
  let { left = '0', top = '0', transform } = style;

  left = parseStyle(left);
  top = parseStyle(top);

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
    rotate = parseStyle(transform.rotate, 'deg') > 0 ? `rotate(${transform?.rotate}) ` : '';
    scale = transform.scale == '1,1' ? '' : `scale(${transform?.scale})`;
    _transform = (rotate + scale).length > 0 ? { transform: rotate + scale } : {};
  }

  return {
    ...style,
    left,
    top,
    ..._transform,
    position: 'absolute',
  };
};

// 获取缩放系数
let getScale = (page) => {
  let { width, height } = page;
  let { innerWidth, innerHeight } = window;
  let scaleX = innerWidth / width,
    scaleY = innerHeight / height;
  return { scaleX, scaleY };
};

// 获取背景
export let getBackground = (page) => {
  let { width, height, ...background } = getDashboardStyle(page);
  return background;
};
/**
 * 根据 page 的宽高和当前 window 的宽高做尺寸转换
 * @param page 页面基础配置
 * @param autosize 是否自动调整大小
 */
export const getAutoSizeStyle = (page, autosize = false) => {
  let { width: styleWidth, height: styleHeight } = getDashboardStyle(page);
  let { width, height } = page;
  let { innerWidth, innerHeight } = window;
  let { scaleX, scaleY } = getScale(page);

  let scale = ` scale(${scaleX},${scaleY})`;
  let translate = `translate(${(innerWidth - width) / 2}px,${(innerHeight - height) / 2}px)`;
  return {
    width: styleWidth,
    height: styleHeight,
    transform: translate + scale,
  };
};
