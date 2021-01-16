import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';

import * as lib from '@/component/chartItem/option/lib';

import * as R from 'ramda';
import 'echarts/lib/chart/sunburst';

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

const getLevels = (len, showBorder = true) => {
  if (len < 2) {
    return null;
  }

  const from = 15;
  const to = 70;
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

export const mock: IChartMock = {
  data: [
    {
      品种: '1112T',
      数量: '731',
    },
    {
      品种: '1112T',
      工序: '白纸',
      数量: '197',
    },
    {
      品种: '1112T',
      工序: '凹一印',
      数量: '23',
    },
    {
      品种: '1112T',
      工序: '印码',
      数量: '99',
    },
    {
      品种: '1112T',
      工序: '涂布',
      数量: '339',
    },
    {
      品种: '1112T',
      工序: '胶二印',
      数量: '140',
    },
    {
      品种: '1113A',
      工序: '印码',
      数量: '1',
    },
    {
      品种: '1113T',
      工序: '钞票纸',
      数量: '707',
    },
    {
      品种: '1113T',
      工序: '白纸',
      数量: '2',
    },
    {
      品种: '1113T',
      工序: '胶一印',
      数量: '340',
    },
    {
      品种: '1113T',
      工序: '凹二印',
      数量: '16',
    },
    {
      品种: '1113T',
      工序: '印码',
      数量: '65',
    },
    {
      品种: '1113T',
      工序: '涂布',
      数量: '22',
    },
    {
      品种: '1114T',
      工序: '钞票纸',
      数量: '581',
    },
    {
      品种: '1114T',
      工序: '白纸',
      数量: '178',
    },
    {
      品种: '1114T',
      工序: '胶一印',
      数量: '51',
    },
    {
      品种: '1114T',
      工序: '凹一印',
      数量: '10',
    },
    {
      品种: '1114T',
      工序: '凹二印',
      数量: '257',
    },
    {
      品种: '1114T',
      工序: '印码',
      数量: '84',
    },
    {
      品种: '1114T',
      工序: '涂布',
      数量: '101',
    },
    {
      品种: '1116T',
      工序: '钞票纸',
      数量: '762',
    },
    {
      品种: '1116T',
      工序: '白纸',
      数量: '196',
    },
    {
      品种: '1116T',
      工序: '胶一印',
      数量: '147',
    },
    {
      品种: '1116T',
      工序: '凹一印',
      数量: '70',
    },
    {
      品种: '1116T',
      工序: '凹二印',
      数量: '158',
    },
    {
      品种: '1116T',
      工序: '印码',
      数量: '112',
    },
    {
      品种: '1116T',
      工序: '涂布',
      数量: '277',
    },
    {
      品种: '1117T',
      工序: '钞票纸',
      数量: '1555',
    },
    {
      品种: '1117T',
      工序: '白纸',
      数量: '433',
    },
    {
      品种: '1117T',
      工序: '胶一印',
      数量: '209',
    },
    {
      品种: '1117T',
      工序: '丝印',
      数量: '221',
    },
    {
      品种: '1117T',
      工序: '凹一印',
      数量: '16',
    },
    {
      品种: '1117T',
      工序: '凹二印',
      数量: '134',
    },
    {
      品种: '1117T',
      工序: '印码',
      数量: '357',
    },
    {
      品种: 'NRB10',
      工序: '钞票纸',
      数量: '121',
    },
    {
      品种: 'NRB10',
      工序: '白纸',
      数量: '152',
    },
    {
      品种: 'NRB10',
      工序: '胶一印',
      数量: '92',
    },
    {
      品种: 'NRB10',
      工序: '凹二印',
      数量: '3',
    },
    {
      品种: 'NRB10',
      工序: '涂布',
      数量: '7',
    },
    {
      品种: 'NRB10',
      工序: '胶二印',
      数量: '10',
    },
    {
      品种: '辅料',
      工序: '辅料-网罩',
      数量: '35',
    },
    {
      品种: '辅料',
      工序: '辅料-隔板',
      数量: '7',
    },
    {
      品种: '辅料',
      工序: '辅料-十字扣',
      数量: '13',
    },
    {
      品种: '辅料',
      工序: '辅料-布罩',
      数量: '11',
    },
    {
      品种: '辅料',
      工序: '辅料-网罩+十字扣',
      数量: '2',
    },
    {
      品种: '辅料',
      工序: '辅料-空托盘组',
      数量: '178',
    },
    {
      品种: '辅料',
      工序: '辅料-收纳箱',
      数量: '18',
    },
    {
      品种: '空货位',
      工序: '闲置',
      数量: '3454',
    },
  ],
  rows: 48,
  dates: [],
  ip: '10.8.60.203',
  header: ['品种', '工序', '数量'],
  title: '立体库货位使用情况汇总',
  time: '143.937ms',
  serverTime: '2021-01-15 14:43:42',
  source: '数据来源：ASRS',
  hash: 'W/"0e64c995f5d72933d11fd0852d7a390c"',
};

export const config: IChartConfig[] = [
  {
    key: 'border',
    type: 'switch',
    defaultValue: true,
    title: '最外侧显示线条',
  },
  // {
  //   key: 'innerRadius',
  //   defaultValue: 0,
  //   title: '圆环大小',
  //   type: 'range',
  //   min: 0,
  //   max: 300,
  //   step: 5,
  // },
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
  renderer: 'canvas',
};

export default ({
  data: { header, data },
  border,
  innerRadius = 0,
  borderWidth = 1,
  borderColor = '#080226',
  borderRadiusInner,
  borderRadiusOutter,
}) => {
  const props = { borderWidth, borderColor, borderRadiusInner, borderRadiusOutter };
  const seriesData = handleSunBrustData(data, header, props);
  const levels = getLevels(header.length - 1, border);

  const series = {
    radius: [innerRadius, '90%'],
    type: 'sunburst',
    data: seriesData,
    sort: null,
    levels,
    label: {
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
  };

  return {
    series,
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: false,
    },
  };
};
