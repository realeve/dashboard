/**
 * 下划线转驼峰命名
 */
export const camelCase = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1).replace(/-|_(\w)/g, (_, n) => n.toUpperCase());
/**
 * 获取对象差异
 * @param {source} object 原始对象
 * @param {target} object 目标对象
 */
export const checkChanged = (source: Record<string, any>, target: Record<string, any>) =>
  JSON.stringify(source) === JSON.stringify(target);

/**
 * 判断两数组是否完全相同
 * @param {source} [] 原数组
 * @param {target} [] 目标数组
 */
export const sameArray = (source: any[], target: any[]): boolean =>
  new Set(source.concat(target)).size === source.length;

export const isType = (value: any, type: string) => {
  const { toString } = {};
  return toString.call(value) === `[object ${type}]`;
};

export const clone = (source: Record<string, any>) => {
  if (!source) {
    return source;
  }
  const target = {};
  Object.entries(source).forEach(([key, val]) => {
    target[key] = val;
  });
  return target;
};
