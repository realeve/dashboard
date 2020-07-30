import { axios, mock } from '@/utils/axios';
import * as R from 'ramda';
export interface IComponentItem {
  title: string;
  icon: string;
  num?: number;
  list: {
    title: string;
    image: string;
    type: string;
  }[];
}
export interface IComponent {
  title: string;
  icon: string;
  name?:string;
  key?:string;
  engine?:string;
  list: IComponentItem[];
}
 

export const getComponentList:()=>Promise<IComponent> = () =>
  axios({
    url:window.location.origin+'/components.json'
  }).then(res =>
    res.map(item => {
      item.list = handleList(item.list);
      return item;
    }),
  );

const handleList = (list: IComponentItem[]) => {
  let all = {
    title: '全部',
    icon: 'com-font icon-com-all',
    num: 0,
    list: [],
  };
  let res = R.clone(list).map(item => {
    if (item.list[0] && item.list[0].title != '全部') {
      item.num = item.list.length;
      all.list = [...all.list, ...item.list];
    }
    return item;
  });
  all.num = all.list.length;
  res = [all, ...res].filter(item => item.title.length > 0);
  return res;
};
