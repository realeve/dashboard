import * as colorLib from '@/utils/colors/lib';
import list from '@/utils/colors/list';

const colors = [
  'rgb(255, 255, 255)',
  'rgb(250, 250, 250)',
  'rgb(245, 245, 245)',
  'rgb(232, 232, 232)',
  'rgb(217, 217, 217)',
  'rgb(191, 191, 191)',
  'rgb(140, 140, 140)',
  'rgb(89, 89, 89)',
  'rgb(38, 38, 38)',
  'rgb(0, 0, 0)',
  'rgb(255, 241, 240)',
  'rgb(255, 204, 199)',
  'rgb(255, 163, 158)',
  'rgb(255, 120, 117)',
  'rgb(255, 77, 79)',
  'rgb(245, 34, 45)',
  'rgb(207, 19, 34)',
  'rgb(168, 7, 26)',
  'rgb(130, 0, 20)',
  'rgb(92, 0, 17),s',
  'rgb(255, 251, 230)',
  'rgb(255, 241, 184)',
  'rgb(255, 229, 143)',
  'rgb(255, 214, 102)',
  'rgb(255, 197, 61)',
  'rgb(250, 173, 20)',
  'rgb(212, 136, 6)',
  'rgb(173, 104, 0)',
  'rgb(135, 77, 0)',
  'rgb(97, 52, 0),s',
  'rgb(232, 245, 233)',
  'rgb(201, 229, 202)',
  'rgb(166, 213, 169)',
  'rgb(131, 198, 134)',
  'rgb(105, 186, 109)',
  'rgb(80, 174, 85)',
  'rgb(70, 159, 75)',
  'rgb(60, 141, 64)',
  'rgb(50, 124, 54)',
  'rgb(30, 93, 35)',
  'rgb(230, 247, 255)',
  'rgb(186, 231, 255)',
  'rgb(145, 213, 255)',
  'rgb(105, 192, 255)',
  'rgb(64, 169, 255)',
  'rgb(24, 144, 255)',
  'rgb(9, 109, 217)',
  'rgb(0, 80, 179)',
  'rgb(0, 58, 140)',
  'rgb(0, 39, 102)',
  'rgb(243, 229, 245)',
  'rgb(224, 191, 230)',
  'rgb(205, 149, 214)',
  'rgb(185, 107, 198)',
  'rgb(170, 76, 186)',
  'rgb(155, 47, 174)',
  'rgb(141, 44, 168)',
  'rgb(122, 39, 160)',
  'rgb(105, 35, 152)',
  'rgb(74, 28, 138)',
];

const res = colors.map((color) => {
  return { color, title: colorLib.getColorName(color).title };
});
const appendList = list
  .map((item) => ({ title: item.title, color: `rgb(${item.color.join(',')})` }))
  .reverse();

export default [...res, ...appendList];
