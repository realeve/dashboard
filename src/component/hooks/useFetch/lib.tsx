import qs from 'qs';

export function isDocumentVisible(): boolean {
  if (typeof document !== 'undefined' && typeof document.visibilityState !== 'undefined') {
    return document.visibilityState !== 'hidden';
  }
  return true;
}

export function isOnline(): boolean {
  if (typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

export function limit(fn: any, timespan: number = 5000) {
  let pending = false;
  return (...args: any[]) => {
    if (pending) return;
    pending = true;
    fn(...args);
    setTimeout(() => {
      pending = false;
    }, timespan);
  };
}

/**
 * 处理返回数据的标题
 * @param response 返回数据
 * @param param 请求参数
 */
export const handleTitle = (response, param) => {
  let params = param?.params || {};
  const urlParma = qs.parse(param.url.split('?')[1] || '');
  params = { ...params, ...urlParma };

  // 处理title
  const title = response?.title || '';
  const prefix = params.prefix || '';
  const suffix = params.suffix || '';
  return `${prefix} ${title} ${suffix}`;
};
