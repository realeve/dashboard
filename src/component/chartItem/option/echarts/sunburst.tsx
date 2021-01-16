import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import * as R from 'ramda';
import 'echarts/lib/chart/sunburst';
import { getColors } from '../g2plot/lib';

export { mock } from './sunburst.mock';

type TChartMockData = (string | number)[];

const seq = (from: number, to: number, len: number) => {
  if (len < 2) {
    throw Error('数据项不能小于2');
  }

  const step = (to - from) / (len - 1);
  const arr = [];
  for (let i = from; i <= to; i += step) {
    arr.push(i);
  }
  return arr;
};

const getColSum = (data: TChartMockData[], key) => {
  const vals = R.pluck<number, TChartMockData>(key, data) as number[];
  return R.sum(vals);
};

interface SunburstItem {
  name: string;
  value: number;
  itemStyle?: {
    borderRadius: [number, number];
    borderColor: string;
    borderWidth: number;
  };
  children?: SunburstItem[];
}

interface ISunburstConfig {
  borderWidth: number;
  borderColor: string;
  borderRadiusInner: number;
  borderRadiusOutter: number;
}

const handleSunBrustData = (data: TChartMockData[], header: string[], config: ISunburstConfig) => {
  // 剩余待处理的header
  const _header = R.tail(header);

  // 当前字段
  const key = R.head(header);

  // 数据列所在字段
  const valKey = R.last(header);

  // 当前字段共几个非重复元素
  const itemList: string[] = lib.getUniqByIdx({
    key,
    data,
  });

  return itemList.map((name) => {
    const dataItem = R.filter<TChartMockData>(R.propEq<string>(key, name))(data);
    const _data = R.map(R.pick(_header))(dataItem) as TChartMockData[];
    const res: SunburstItem = {
      name,
      value: getColSum(_data, valKey),
      itemStyle: {
        borderRadius: [config.borderRadiusInner, config.borderRadiusOutter],
        borderColor: config.borderColor,
        borderWidth: config.borderWidth,
      },
    };

    // if (colorful ) {
    //   res.itemStyle = {
    //     color: lib.colors[Math.floor(Math.random() * lib.colors.length)],
    //   };
    // }

    if (_header.length > 1) {
      res.children = handleSunBrustData(_data, _header, config);
    }
    return res;
  });
};

const getLevels = (len, from = 15, showBorder = true) => {
  if (len < 2) {
    return null;
  }

  const to = 85;
  const levels = seq(from, to, len + (showBorder ? 0 : 1));
  const res = [];
  levels.forEach((r0, i) => {
    if (i === levels.length - 1) {
      return;
    }
    res.push({
      r0: `${r0}%`,
      r: `${levels[i + 1]}%`,
      label: {
        align: 'right',
      },
      itemStyle: {
        borderWidth: 2,
      },
    });
  });

  res[0].label = {
    rotate: 'tangential',
  };

  if (showBorder) {
    res.push({
      r0: `${R.last(levels)}%`,
      r: `${R.last(levels) + 3}%`,
      label: {
        position: 'outside',
        padding: 3,
        silent: false,
      },
      itemStyle: {
        borderWidth: 3,
      },
    });
  }

  return [{}, ...res];
};

export const config: IChartConfig[] = [
  lib.getAntThemePanel(),
  {
    key: 'needRerverse',
    defaultValue: false,
    title: '翻转颜色表',
    type: 'switch',
  },
  {
    key: 'border',
    type: 'switch',
    defaultValue: true,
    title: '最外侧显示线条',
  },
  {
    key: 'innerRadius',
    defaultValue: 0,
    title: '圆环大小',
    type: 'range',
    min: 0,
    max: 80,
    step: 2,
  },
  {
    key: 'fontSize',
    defaultValue: 12,
    title: '标签字号',
    step: 1,
    type: 'range',
    min: 12,
    max: 50,
  },
  {
    key: 'borderWidth',
    defaultValue: 1,
    title: '线宽',
    step: 1,
    type: 'range',
    min: 0,
    max: 30,
  },
  {
    key: 'borderColor',
    defaultValue: '#080226',
    title: '边框线颜色',
    type: 'purecolor',
    position: 'bottom',
  },
  {
    key: 'borderRadiusInner',
    defaultValue: 0,
    title: '内圆圆角',
    step: 1,
    type: 'range',
    min: 0,
    max: 50,
  },
  {
    key: 'borderRadiusOutter',
    defaultValue: 0,
    title: '外圆圆角',
    step: 1,
    type: 'range',
    min: 0,
    max: 50,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/47_sunburst.json',
  interval: 5,
  cache: 2,
  config: [],
};

export const defaultOption = {
  renderer: 'svg',
};

export default ({
  data: { header, data },
  theme = 15,
  needRerverse,
  border,
  fontSize,
  innerRadius = 0,
  borderWidth = 1,
  borderColor = '#080226',
  borderRadiusInner,
  borderRadiusOutter,
}) => {
  const color = getColors(theme, needRerverse);
  const props = { borderWidth, borderColor, borderRadiusInner, borderRadiusOutter };
  const seriesData = handleSunBrustData(data, header, props);
  const levels = getLevels(header.length - 1, innerRadius, border);

  return {
    color,
    series: {
      type: 'sunburst',
      data: seriesData,
      // sort: null,
      levels,
      label: {
        fontSize,
        formatter: (param) => {
          if (param.treePathInfo.length === 2) {
            return `${param.name}\n——\n${param.value}`;
          }
          return param.name;
        },
      },
      // highlightPolicy: 'ancestor',
      // emphasis: {
      //   focus: 'ancestor',
      // },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
    },
  };
};
