import { axios, DEV } from '@/utils/axios';
import * as R from 'ramda';
import * as lib from '@/utils/lib';
import {
  GROUP_COMPONENT_KEY,
  IPanelConfig,
  getGroupRect,
  IBusinessCategory,
} from '@/models/common';

import { message } from 'antd';

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

// 获取基础配置：缩略图、标题
export const getImage = (panels: IPanelConfig[]) => {
  if (panels.length == 1) {
    return { image: panels[0].image, title: panels[0].title };
  }
  let item =
    panels.find(
      (item) => ![GROUP_COMPONENT_KEY, 'text_single', 'image_single'].includes(item.key),
    ) || R.last(panels);

  return { title: item.title, image: item.image };
};

export const getSelectedComponent = (selectedPanel: string[], panel: IPanelConfig[]) => {
  if (selectedPanel.length === 0) {
    return [];
  }

  let panels = R.filter<IPanelConfig>((item) => selectedPanel.includes(item.id))(panel);
  // 只选中了一个组件的导出
  if (panels.length === 1) {
    return panels;
  }

  // 选中多个组件时
  let groups: string[] = R.pluck<string, IPanelConfig>('group', panels).filter(
    (item: string | undefined) => item,
  ) as string[];
  groups = R.uniq(groups);

  // 选中多个组件，未分组,需要手工将组件合并
  if (groups.length === 0) {
    let groupItem = getGroupRect();
    let _panel = R.map((item: IPanelConfig) => ({ group: groupItem.id, ...item }))(panels);
    return [groupItem, ..._panel];
  }

  // 选中多个分组的组件
  if (groups.length > 1) {
    return [];
  }

  // 组件在同一个分组中
  if (selectedPanel.includes(groups[0])) {
    return panels;
  }

  let groupPanel = R.find<IPanelConfig>(R.propEq('id', groups[0]))(panel);
  return [groupPanel, ...panels];
};

// TODO 此处需要弹出面板，选择一级/二级列表，设置业务名称
export const getSaveOption: (
  panel: IPanelConfig[],
  business: IBusinessCategory | null,
) => IBusinessProps | null = (panels: IPanelConfig[], business) => {
  if (panels.length === 0) {
    message.error('业务保存需要确保组件在同一个分组内');
    return null;
  }
  let { title, image } = getImage(panels);
  let config = JSON.stringify(panels);
  let create_time = lib.now();

  let option = {
    config,
    title,
    image,
    create_time,
    creator: '管理员',
    useage_times: 0,
    update_time: create_time,
    category_main: business?.title,
    category_sub: business?.list?.[0],
  };
  return option;
};

/**
 * 读取业务列表
 */
export const getTblBusinessCategory: () => Promise<IBusinessCategory[]> = () =>
  axios({
    url: window.location.origin + '/business_category.json',
  });
