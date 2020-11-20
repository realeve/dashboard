import { axios } from '@/utils/axios';
import { getDashboardStyle } from '@/component/Editor/Editor';
import { message } from 'antd';
import localforage from 'localforage';
import { IPage, IPanelConfig } from '@/models/common';

export enum EResizeType {
  NONE = 'none', // 不缩放
  SCALE = 'scale', // 横纵向拉伸
  COMPONENT = 'component', // 只缩放组件尺寸和位置，不处理文字大小
  MOVIE = 'movie', //电影模式，上下或左右留黑边
}

/**
 * 获取缩放模式
 * @param autoresize 地址栏参数
 */
export const getResizeType = (autoresize) => {
  let type: EResizeType;
  switch (autoresize) {
    case 'scale':
      type = EResizeType.SCALE;
      break;
    case 'component':
      type = EResizeType.COMPONENT;
      break;
    case 'movie':
      type = EResizeType.MOVIE;
      break;
    default:
      type = EResizeType.NONE;
      break;
  }
  return type;
};

/**
 * 读取本地配置，用于预览
 */
export const getLocalConfig: () => Promise<null | {
  type: string;
  page: IPage;
  panel: IPanelConfig[];
}> = async () => {
  let panel = JSON.parse(localStorage.getItem('panel') || '[]') as IPanelConfig[],
    page = JSON.parse(localStorage.getItem('page') || '[]') as IPage;

  if (!panel || !page) {
    message.error('当前页面未配置任何组件，预览失败');
    return null;
  }
  return { type: 'local', page, panel };
};

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
  return getLocalConfig();
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
export const getStyle = ({ style, page, resizeType = EResizeType.NONE }) => {
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

  // 处理组件尺寸和位置缩放
  let width = parseStyle(style.width),
    height = parseStyle(style.height);
  if (resizeType === EResizeType.COMPONENT) {
    let { scaleX, scaleY } = getScale(page, resizeType);
    (top *= scaleY), (width *= scaleX), (left *= scaleX), (height *= scaleY);
  }

  return {
    ...style,
    left,
    top,
    width,
    height,
    ..._transform,
    position: 'absolute',
  };
};

// 获取缩放系数
let getScale = (page, resizeType: EResizeType) => {
  let { width, height } = page;
  let { innerWidth, innerHeight } = window;
  let scaleX = innerWidth / width,
    scaleY = innerHeight / height;

  if (resizeType === EResizeType.MOVIE) {
    scaleX = scaleY = Math.min(scaleX, scaleY);
  }

  // 原画布比例
  let ratio = width / height;

  return { scaleX, scaleY, ratio };
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
export const getAutoSizeStyle = (page, resizeType: EResizeType) => {
  let { width: styleWidth, height: styleHeight } = getDashboardStyle(page);
  let { width, height } = page;
  let { innerWidth, innerHeight } = window;
  let { scaleX, scaleY } = getScale(page, resizeType);

  let scale = ` scale(${scaleX},${scaleY})`;
  let translate = `translate(${(innerWidth - width) / 2}px,${(innerHeight - height) / 2}px)`;
  return {
    width: styleWidth,
    height: styleHeight,
    transform: translate + scale,
  };
};
