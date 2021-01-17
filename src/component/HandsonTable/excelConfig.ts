import * as R from 'ramda';
import { getDataByIdx } from '@/component/chartItem/option/lib';
import { getType } from '@/utils/axios';
import * as Excel from './exceljs';

/**
 * @param prefix 前缀
 * @param suffix 后续
 * @param interval 间隔多少个单元格高亮背景
 * @param autoid 导出数据自动追加编号
 */
export interface BasicConfig {
  prefix?: string;
  suffix?: string;
  interval?: string | number;
  autoid?: string | boolean;
  [key: string]: any;
}

/**
 * @param prefix 前缀
 * @param suffix 后续
 * @param interval 间隔多少个单元格高亮背景
 * @param autoid 导出数据自动追加编号
 * @param merge 需要合并的单元格定义,如：2-3,2-5,7-8
 * @param mergetext 合并单元格对应的文本
 * @param mergedRows 自动计算的结果，有哪些列被合并
 * @param mergesize 合并列宽，默认为2
 */
export interface SrcConfig extends BasicConfig {
  merge?: string[] | string;
  mergetext?: string[] | string;
  mergesize?: string;
  [key: string]: any;
}

// 处理纵向列合并配置项;
export const splitParam2Arr = (param) => {
  let config = [];
  switch (getType(param)) {
    case 'string':
      if (param.includes(';')) {
        config = param.split(';');
      } else if (param.includes(',')) {
        config = param.split(',');
      } else if (param.includes('-')) {
        const [start, end] = param.split('-');
        config = R.range(Number(start), Number(end) + 1);
      } else {
        return [Number(param)];
      }
      break;
    case 'array':
      config = param;
      break;
    case 'number':
    default:
      return [param];
  }
  config = config.map(splitParam2Arr);
  config = R.flatten(config);
  config = config.map((item) => Number(item)).sort((a, b) => a - b);
  return config;
};

type mergeItem = number[];
/**
 * 将TableSetting转换为数据导出所需的格式
 */
export interface DstConfig extends BasicConfig, MergeRes {
  [key: string]: any;
}

export interface Config {
  creator?: string;
  lastModifiedBy?: string;
  created?: string;
  modified?: string;
  lastPrinted?: string;
  params: DstConfig;
  [key: string]: any;
}

export interface MergeRes {
  merge?: mergeItem[] | [];
  mergetext?: string[];
  mergedRows?: number[];
  mergev?: number[];
}
/**
 * 处理merge字段
 * @param config 默认配置项，定义为 TableSetting
 * @return mergetext string[]
 * @return merge [number,number] 单元格合并设置
 * @return mergedRows [number] 哪些行需要合并
 */
export const handleMerge: (config: SrcConfig) => MergeRes = (config) => {
  const { merge, mergetext, autoid, mergesize, mergev } = config;
  let mergeStrArr: string[] = [];

  switch (typeof merge) {
    case 'string':
      mergeStrArr = [merge];
      break;
    case 'undefined':
      mergeStrArr = [];
      break;
    default:
      mergeStrArr = merge;
      break;
  }

  let mergeArr: mergeItem[] = mergeStrArr.map((item: string) => {
    const arr = item
      .split('-')
      .map((col: string): number => Number(col) + 1 + (autoid ? 1 : 0))
      .sort((a, b) => a - b);
    if (arr.length === 1) {
      return [arr[0], arr[0] + (Number(mergesize) - 1)];
    }
    return arr;
  });

  let mergetextArr: string[] = [];
  switch (typeof mergetext) {
    case 'undefined':
      mergetextArr = [''];
      break;
    case 'string':
      mergetextArr = [mergetext];
      break;
    default:
      mergetextArr = mergetext;
      break;
  }

  // 记录合并单元格
  let mergedRows: number[] = [];
  mergeArr.forEach(([start, end]) => {
    mergedRows = [...mergedRows, ...R.range(start, end + 1)].sort();
  });

  mergeArr = mergeArr.sort((a, b) => a[0] - b[0]);

  // 纵向合并
  const mergeVConfig = getType(mergev) === 'undefined' ? [] : splitParam2Arr(mergev);

  // console.log({
  //   mergetext: mergetextArr,
  //   merge: mergeArr,
  //   mergedRows,
  //   mergev: mergeVConfig,
  // });
  return {
    mergetext: mergetextArr,
    merge: mergeArr,
    mergedRows,
    mergev: mergeVConfig,
  };
};

/**
 * 初始化查询参数
 */
export const initQueryParam: (params: BasicConfig) => BasicConfig = (params) => {
  params.interval = params.interval || '5'; // 隔行背景色
  params.interval = Math.max(Number(String(params.interval)), 2);
  params.autoid = !R.isNil(params.autoid) && params.autoid !== '0'; // 填充第一列序号
  params.mergesize = params.mergesize || '2';
  return params;
};

/**
 * 根据配置项初始化文件导出所需参数
 * @params config 地址栏配置信息如prefix,suffix等
 * @returns TableSetting
 */
export const getParams: DstConfig | any = (config: SrcConfig) => {
  const params: BasicConfig = initQueryParam(config);
  const mergeParam: MergeRes = handleMerge(params);
  return Object.assign(params, mergeParam);
};

/**
 * http://localhost:8000/table#id=http://localhost:8000/data/mock/543_e6fef8a252.json&mergev=0-2
 * 
 * 处理数据纵向合并
 * 
 * 返回数据示例
 * [
      { row: 0, col: 1, rowspan: 2, colspan: 1 },
      { row: 2, col: 1, rowspan: 6, colspan: 1 },
    ] 

 * @param data 表格数据
 * @param mergev 需要合并的列
 *  
 */
export const handleMergeV = (data: (string | number)[][], mergev: number[]) => {
  if (data.length === 0) {
    return {};
  }

  let res: { row: number; col: number; rowspan: number; colspan: number }[] = [];
  mergev.forEach((key) => {
    // 获取数据项
    const rows = getDataByIdx({ key, data });
    let start = 0;
    for (let end = 1; end < rows.length; end++) {
      if (String(rows[end] || '').trim() !== String(rows[start] || '').trim()) {
        res.push({
          row: start,
          col: key,
          colspan: 1,
          rowspan: end - start,
        });
        // 向右移动新的起始指针
        start = end;
      }
    }
    // bug待修复
    // console.log(key, rows, start);
    res.push({
      row: start,
      col: key,
      colspan: 1,
      rowspan: rows.length - start,
    });
  });
  const cell = res.map(({ row, col }) => ({ row, col, className: 'htCenter htMiddle' }));

  // 都为1的数据过滤掉，无需合并
  res = R.reject((item) => item.colspan === 1 && item.rowspan === 1, res);

  return { mergeCells: res, cell };
};

// 获取表头层级数，用于sheet的表头处理
const getNestHeader = (tableColumn, level = 0) => {
  const handleItem = (item) => {
    if (!item.children) {
      return {
        label: item.title,
        level,
        colspan: 1,
      };
    }
    return {
      level,
      label: item.title,
      colspan: item.children.length,
      children: getNestHeader(item.children, level + 1),
    };
  };
  return tableColumn.map((item) => handleItem(item));
};

// 表头合并处理
interface defaultData {
  merge?: string;
  mergesize?: string;
  mergetext?: string;
}
export const mergeConfig = (columns, config, dataSrc: defaultData = {}) => {
  // 如果使用外部接口，返回了配置信息则启用外部数据引入的配置
  let params = R.clone(config);

  params = { ...params, ...R.pick(['merge', 'mergesize', 'mergetext'], dataSrc) };

  if (R.isNil(params) || R.isNil(params.merge)) {
    return columns;
  }
  if (getType(params.merge) === 'string') {
    params.merge = [params.merge];
  }
  if (getType(params.mergetext) === 'string') {
    params.mergetext = [params.mergetext];
  } else if (typeof params.mergetext === 'undefined') {
    params.mergetext = [];
  }

  //  合并列宽
  params.mergesize = params.mergesize || '2';
  params.mergesize = Number(params.mergesize);

  params.merge = params.merge.map((item) =>
    item
      .split('-')
      .map((cell) => Number(cell))
      .sort((a, b) => a - b),
  );

  // 逆序排列
  // params.merge.sort((a, b) => b[0] - a[0]);
  // params.mergetext.reverse(); // 文字也需要逆序

  // 不做排序之后，方便复杂表头合并

  let mergeColumns = R.clone(columns);

  params.merge.forEach(([start, end], idx) => {
    // 将起始点合并
    end = end || start + params.mergesize - 1;

    // 如果合并列大于给定的总列数，停止合并
    if (end > columns.length) {
      return;
    }
    mergeColumns[start] = {
      title: params.mergetext[idx],
      children: R.slice(start, end + 1)(mergeColumns),
    };

    // 移除后续数据
    mergeColumns = R.remove(start + 1, end - start)(mergeColumns);
  });

  return mergeColumns;
};

export const handleSheetHeader = (tableColumn) => {
  let header = getNestHeader(tableColumn);
  console.log(JSON.stringify(header), tableColumn);
  // 合并span列宽度
  const handleColSpan = (arr) => {
    let sum = 0;
    let hasChild = false;
    arr = arr.map((item) => {
      if (!item.children) {
        sum += item.colspan;
      } else {
        const { sum: nextSpan, hasChild: needAdd } = handleColSpan(item.children);
        if (needAdd) {
          sum = R.reduce(
            R.add,
            0,
            item.children.map((e) => e.colspan),
          );
        } else {
          sum = nextSpan;
        }
        item.colspan = sum;
        hasChild = true;
      }
      return item;
    });
    return { arr, sum, hasChild };
  };

  header = handleColSpan(header).arr;

  const findLevel = (arr, level) =>
    arr.map((item) => {
      const curLevel = item.level;
      if (curLevel < level) {
        if (!item.children) {
          // if (item.colspan === 1) {
          //   return item.label;
          // }
          return {
            label: item.label,
            colspan: item.colspan,
          };
        }
        return findLevel(item.children, level);
      }
      // if (curLevel === level) {

      // }
      return {
        label: item.label,
        colspan: item.colspan,
      };
    });

  const maxLevel = Excel.getHeadLevel(tableColumn);

  const arr = [];
  for (let i = 0; i < maxLevel; i++) {
    arr.push(R.flatten(findLevel(header, i)));
  }
  // arr 合并数量可能有误
  return arr;
};
