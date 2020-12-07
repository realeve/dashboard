import colorList from './list';
import { hex2rgb } from '@/component/chartItem/option/lib';
import * as R from 'ramda';

/**
 * 获取颜色的rgb值
 * @param color rgb(r,g,b)
 * @returns rgb值 [r,g,b]
 */
export const getRGB = (color: string) =>
  color
    .replace(/(rgba)|(rgb)| |\(|\)/g, '')
    .split(',')
    .slice(0, 3)
    .map((item) => parseInt(item));

/**
 * 获取颜色中文名
 * @param color 颜色，支持 rgb/hex
 */
export const getColorName = (color: string) => {
  if (color[0] == '#') {
    color = hex2rgb(color);
  }
  let colors = getRGB(color);
  let res = colorList.map(({ title, color }) => {
    let delta = Math.sqrt(
      (color[0] - colors[0]) ** 2 + (color[1] - colors[1]) ** 2 + (color[2] - colors[2]) ** 2,
    );
    return { title, color, delta: +delta.toFixed(1) };
  });
  let distColor = R.sortBy((a) => a.delta, res);
  return distColor[0];
};
