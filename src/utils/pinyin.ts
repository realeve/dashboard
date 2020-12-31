import PinYin from './pinyin-dict';

function chnToPy(l1, shortMode) {
  const l2 = l1.length;
  let I1 = '';
  const reg = new RegExp('[a-zA-Z0-9- ]');
  for (let i = 0; i < l2; i++) {
    const val = l1.substr(i, 1);
    const name = arraySearch(val, PinYin, shortMode);
    if (reg.test(val)) {
      I1 += val;
    } else if (name !== false) {
      I1 += name;
    }
  }
  I1 = I1.replace(/ /g, '-');
  while (I1.indexOf('--') > 0) {
    I1 = I1.replace('--', '-');
  }
  return I1;
}

function arraySearch(l1, l2, shortMode) {
  let res: boolean | string = false;
  Object.keys(PinYin).forEach((name) => {
    if (!res && PinYin[name].indexOf(l1) !== -1) {
      res = ucfirst(name, shortMode);
    }
  });
  return res;
}

function ucfirst(l1: string, shortMode: boolean) {
  // if (l1.length > 0)
  // {
  const first = l1.substr(0, 1).toUpperCase();
  const spare = shortMode ? '' : l1.substr(1, l1.length);
  return first + spare;
  // }
}

export default {
  toPinYin: (str) => chnToPy(str, true),
  toPinYinFull: (str) => chnToPy(str, false),
};
