import React, { useState, useEffect } from 'react';
import { ComponentList } from '../components/TabComponent';
import { getTblBusiness, IBusinessProps } from './db';
import { connect } from 'dva';
import { ICommon, IBusinessCategory, IPanelConfig, GROUP_COMPONENT_KEY } from '@/models/common';
import * as R from 'ramda';
import * as lib from '@/utils/lib';

export interface IBusinessState {
  list: {
    title: string;
    list: IBusinessProps[];
  }[];
  title: string;
  icon: string;
}
interface IBusinessTabProps {
  onAddPanel: (e: IPanelConfig[]) => void;
  businessCategory: IBusinessCategory[];
}

/**
 * 处理业务组件列表中每个子项的id;
 * 当一个页面中添加两个同一业务组件时，会因为id冲突造成后续处理中的系列问题
 * @param business 业务组件列表
 */
const handleBusinessItemId: (business: IBusinessProps) => IPanelConfig[] = (business) => {
  let items = JSON.parse(business.config) as IPanelConfig[];

  let groupId = lib.noncer();

  // 只有一项时，无分组信息，直接修改id即可;
  if (items.length === 1) {
    items[0] = {
      ...items[0],
      id: groupId,
      title: business.title,
      business: true,
    };
    return items;
  }

  // 有分组的场景。目前分组是将多个组件添加到一个分组中

  // 更新group项的标题和ID
  let groupIdx = R.findIndex<IPanelConfig>(R.propEq<string>('key', GROUP_COMPONENT_KEY))(items);
  items[groupIdx] = {
    ...items[groupIdx],
    title: business.title,
    id: groupId,
    business: true,
  };

  items = items.map((item) => {
    if (item.group) {
      // 更新子项的groupId
      item.group = groupId;
      // 子项的Id也需要更新
      item.id = lib.noncer();
      item.business = true;
    }
    return item;
  });

  return items;
};

const TabBusiness = ({ onAddPanel, businessCategory }: IBusinessTabProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemList, setItemList] = useState<IBusinessState[]>([]);

  useEffect(() => {
    if (businessCategory.length === 0) {
      return;
    }
    refreshBusiness();
  }, [JSON.stringify(businessCategory)]);

  const refreshBusiness = () => {
    setLoading(true);
    getTblBusiness()
      .then(({ data }: { data: IBusinessProps[] }) => {
        let panels = R.map<IBusinessCategory, IBusinessState>((item) => {
          // 一级列表
          let mainList = R.filter<IBusinessProps>(R.propEq<string>('category_main', item.title))(
            data,
          );
          let list = item.list.map((title) => {
            let list = R.filter<IBusinessProps>(R.propEq<string>('category_sub', title))(mainList);
            return {
              title,
              list,
              num: list.length,
            };
          });

          // 最前面插入一项
          list.unshift({
            title: '全部',
            list: mainList,
            num: mainList.length,
          });

          return {
            ...item,
            list,
          };
        })(businessCategory);
        setItemList(panels);
      })
      .catch((e) => {
        setError('加载组件列表出错');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ComponentList
      onAdd={(panel: IBusinessProps, isEdit = false) => {
        let item = handleBusinessItemId(panel);
        if (isEdit) {
          // 编辑模式下，将edit_id注入；
          item[0].edit_id = panel.id;
        }
        onAddPanel(item);
      }}
      state={itemList}
      loading={loading}
      error={error}
      isBusiness
      onRefresh={refreshBusiness}
    />
  );
};

export default connect(({ common: { businessCategory } }: { common: ICommon }) => ({
  businessCategory,
}))(TabBusiness);
