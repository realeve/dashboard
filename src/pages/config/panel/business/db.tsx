import { axios, DEV } from '@/utils/axios';
import * as R from 'ramda';
import * as lib from '@/utils/lib';
// （id/名称/业务分类,二级 /业务json配置文件([object,object]）/创建人/创建时间/使用次数/更新时间
// TODO 业务组件数据结构定义
export interface IBusinessProps {
  id?: string; // 服务端 生成
  title: string; // 标题(弹出面板)
  category_main: string; // 一级分类(弹出面板)
  category_sub: string; // 二级分类(弹出面板)
  image: string; //缩略图
  config: string; // json配置项
  creator: string; // 创建者(弹出面板)
  create_time: string;
  useage_times: number;
  update_time: string;
}

const BUSINESS_KEY = 'business_list';

const getLocalBusiness = async () => {
  let data = JSON.parse(window.localStorage.getItem(BUSINESS_KEY) || '[]');
  return {
    rows: data.length,
    data,
  };
};

/**
 * 将业务组件存储到本地 localStorage
 * @param params 业务组件
 */
const addLocaleBusiness = async (params: IBusinessProps) => {
  let { data, rows } = await getLocalBusiness();
  let startId = rows + 1;
  let nextParams = [...data, { id: startId, ...params }];
  window.localStorage.setItem(BUSINESS_KEY, JSON.stringify(nextParams));
  return {
    data: [{ affected_rows: 1 }],
  };
};

/**
 * 存储业务组件
 * @param params 业务组件列表
 */
export const addTblBusiness = async (params: IBusinessProps) => {
  // 目前只处理模拟在本地保存
  if (DEV) {
    return addLocaleBusiness(params);
  }
  // TODO 业务组件入库
  console.log(params);
};

export const getTblBusiness = async () => {
  if (DEV) {
    return getLocalBusiness();
  }
  // TODO 读取业务组件
};
