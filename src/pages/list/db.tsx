import { axios, IAxiosState, _commonData } from '@/utils/axios';
import { api } from '@/utils/setting';

/**
*   @database: { 接口管理 }
*   @desc:     { 编辑大屏列表项 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号 
*/
export const setDashboardList: (params: {
  title: string;
  publish: number;
  is_hide: number;
  _id: number;
}) => Promise<boolean> = (params) =>
  axios({
    url: api.editDashboardItem,
    params,
  }).then(({ data: [{ affected_rows }] }: IAxiosState) => (affected_rows as number) > 0);
