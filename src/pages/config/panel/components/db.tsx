import { axios } from '@/utils/axios';
import * as R from 'ramda';

export interface IChartConfig {
  type: string;
  title: string;
  image: string;
  name?: string;
  key?: string;
  engine?: 'echarts' | 'g2' | 'g2plot';
  style?: Partial<{
    width: string | number;
    height: string | number;
    rotate: string | number;
    transform: string;
  }>;
  showTitle?: number;
  [key: string]: any;
}
export interface IComponentItem {
  title: string;
  icon: string;
  num?: number;
  list: IChartConfig[];
}
export interface IComponent {
  title: string;
  icon: string;
  list: IComponentItem[];
  [key: string]: any;
}

export const getComponentList: () => Promise<IComponent[]> = () =>
  axios({
    url: `${window.location.origin  }/components.json`,
  }).then((res) =>
    res.map((item) => {
      item.list = handleList(item.list);
      return item;
    }),
  );

const handleList = (list: IComponentItem[]) => {
  const all = {
    title: '全部',
    icon: 'com-font icon-com-all',
    num: 0,
    list: [],
  };
  let res = R.clone(list).map((item) => {
    if (item.list[0] && item.list[0].title != '全部') {
      item.num = item.list.length;
      all.list = [...all.list, ...item.list];
    }
    return item;
  });
  all.num = all.list.length;
  if (all.num === 0) {
    return [all];
  }
  res = [all, ...res].filter((item) => item.title.length > 0);
  return res;
};
