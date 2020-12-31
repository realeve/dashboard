import type { IAxiosState, TDbWrite } from '@/utils/axios';
import { axios, DEV, _commonData } from '@/utils/axios';
import * as R from 'ramda';
import { api } from '@/utils/setting';
import * as lib from '@/utils/lib';
import type { IPanelConfig, IBusinessCategory } from '@/models/common';
import { GROUP_COMPONENT_KEY, getGroupRect } from '@/models/common';

import { message } from 'antd';
import type { IScreenItem } from '@/pages/list/';
import localforage from 'localforage';

// （id/名称/业务分类,二级 /业务json配置文件([object,object]）/创建人/创建时间/使用次数/更新时间
// [ x ] 业务组件数据结构定义
export type IBusinessProps = {
  id?: number; // 服务端 生成
  title: string; // 标题(弹出面板)
  category_main: string; // 一级分类(弹出面板)
  category_sub: string; // 二级分类(弹出面板)
  image: string; // 缩略图
  config: string; // json配置项
  creator: string; // 创建者(弹出面板)
  create_time: string;
  useage_times: number;
  update_time: string;
};

/**
 *   @database: { 微信开发 }
 *   @desc:     { 添加业务组件 }
 */
export const addDashboardBusiness = (params: IBusinessProps) =>
  axios<IAxiosState>({
    url: DEV ? _commonData : api.addDashboardBusiness,
    params,
  }).then(({ data: [{ affected_rows }] }) => affected_rows > 0);
/**
 *   @database: { 微信开发 }
 *   @desc:     { 业务组件列表 }
 */
export const getDashboardBusiness = () =>
  axios<IBusinessProps>({
    url: api.getDashboardBusiness,
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 添加大屏 }
 */
export const addDashboardList = (params: { title: string; img: string; file: string }) =>
  axios<TDbWrite>({
    url: api.addDashboardList,
    params,
  }).then(({ data: [{ affected_rows }] }) => affected_rows > 0);

export type IBusinessEditProps = {
  title: string;
  category_main: string;
  category_sub: string;
  image: string;
  config: string;
  is_hide: string;
  _id: string;
};
/**
*   @database: { 接口管理 }
*   @desc:     { 编辑业务组件 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号 
*/
export const setDashboardBusiness = (params: IBusinessEditProps) =>
  axios<TDbWrite>({
    url: api.editDashboardBusiness,
    params,
  }).then(({ data: [{ affected_rows }] }) => affected_rows > 0);

/**
 *   @database: { 接口管理 }
 *   @desc:     { 大屏列表 }
 */
export const getDashboardList = () =>
  axios<IScreenItem>({
    url: api.getDashboardList,
  });

const BUSINESS_KEY = 'business_list';

const getLocalBusiness = async () => {
  const data = await localforage.getItem<IBusinessProps[]>(BUSINESS_KEY).then((res) => res || []);
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
  const { data, rows } = await getLocalBusiness();
  const startId = rows + 1;
  const nextParams = [...data, { id: startId, ...params }];
  return localforage.setItem(BUSINESS_KEY, nextParams).then(() => true);
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
  // [-] 业务组件入库
  // console.log(params);
  return addDashboardBusiness(params);
};

export const getTblBusiness = async () => {
  if (DEV) {
    return getLocalBusiness();
  }
  // [-] 从数据库读取业务组件
  return getDashboardBusiness();
};

// 获取基础配置：缩略图、标题
export const getImage = (panels: IPanelConfig[]) => {
  if (panels.length === 1) {
    return { image: panels[0].image, title: panels[0].title };
  }
  const item =
    panels.find(
      (panel) => ![GROUP_COMPONENT_KEY, 'text_single', 'image_single'].includes(panel.key),
    ) || R.last(panels);

  return { title: item.title, image: item.image };
};

export const getSelectedComponent = (selectedPanel: string[], panel: IPanelConfig[]) => {
  if (selectedPanel.length === 0) {
    return [];
  }

  const panels = R.filter<IPanelConfig>((item) => selectedPanel.includes(item.id))(panel);
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
    const groupItem = getGroupRect();
    const _panel = R.map((item: IPanelConfig) => ({ group: groupItem.id, ...item }))(panels);
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

  const groupPanel = R.find<IPanelConfig>(R.propEq('id', groups[0]))(panel);
  return [groupPanel, ...panels];
};

// [ x ] 此处需要弹出面板，选择一级/二级列表，设置业务名称
export const getSaveOption: (
  panel: IPanelConfig[],
  business: IBusinessCategory | null,
) => IBusinessProps | null = (panels: IPanelConfig[], business) => {
  if (panels.length === 0) {
    message.error('业务保存需要确保组件在同一个分组内');
    return null;
  }
  const { title, image } = getImage(panels);

  // 保存业务组件时需要移除其中的mock数据
  let _panels = R.clone<IPanelConfig>(panels);

  // 保存时将edit_id扔掉
  _panels = _panels.map(({ api: panelApi = {}, edit_id, ...item }) => {
    const { mock, ...nextApi } = panelApi;
    return { ...item, api: nextApi };
  });

  const config = JSON.stringify(_panels);
  const create_time = lib.now();

  const option = {
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
export const getTblBusinessCategory = () =>
  axios<IBusinessCategory>({
    url: `${window.location.origin}/business_category.json`,
  }).then(({ data }) => data);
