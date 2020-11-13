import React, { useState, useEffect } from 'react';
import { ComponentList } from '../components/TabComponent';
import { getTblBusiness, IBusinessProps } from './db';
import { connect } from 'dva';
import { ICommon, IBusinessCategory } from '@/models/common';
import * as R from 'ramda';

interface IBusinessState {
  list: {
    title: string;
    list: IBusinessProps[];
  }[];
  title: string;
  icon: string;
}
interface IBusinessTabProps {
  onAddPanel: (e: string) => void;
  businessCategory: IBusinessCategory[];
}

const TabBusiness = ({ onAddPanel, businessCategory }: IBusinessTabProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemList, setItemList] = useState<IBusinessState[]>([]);

  useEffect(() => {
    if (businessCategory.length === 0) {
      return;
    }
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
  }, [businessCategory]);

  return (
    <ComponentList
      onAdd={(panel) => {
        let item = JSON.parse(panel.config);
        onAddPanel(item);
      }}
      state={itemList}
      loading={loading}
      error={error}
    />
  );
};

export default connect(({ common: { businessCategory } }: { common: ICommon }) => ({
  businessCategory,
}))(TabBusiness);
