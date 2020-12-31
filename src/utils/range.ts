import moment from 'dayjs';

// https://github.com/iamkun/dayjs/blob/dev/docs/en/Plugin.md#quarterofyear
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import type { IChartConfig } from '@/component/chartItem/interface';

moment.extend(quarterOfYear);

const range = {
  去年: [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
  今年: [moment().startOf('year'), moment().endOf('year')],
  上半年: [moment().quarter(1).startOf('quarter'), moment().quarter(2).endOf('quarter')],
  下半年: [moment().quarter(3).startOf('quarter'), moment().quarter(4).endOf('quarter')],
  上季度: [
    moment().subtract(1, 'quarter').startOf('quarter'),
    moment().subtract(1, 'quarter').endOf('quarter'),
  ],
  本季度: [moment().startOf('quarter'), moment().endOf('quarter')],
  去年同期: [
    moment().subtract(1, 'year').startOf('month'),
    moment().subtract(1, 'year'),
    // .endOf('month'),
  ],
  过去一月: [moment().subtract(1, 'month'), moment()],
  上月: [
    moment().subtract(1, 'month').startOf('month'),
    moment().subtract(1, 'month').endOf('month'),
  ],
  本月: [moment().startOf('month'), moment().endOf('month')],
  '7天前': [moment().subtract(1, 'week'), moment()],
  上周: [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
  本周: [moment().startOf('week'), moment().endOf('week')],
  昨天: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
  今天: [moment(), moment()],
  前天: [moment().subtract(2, 'day'), moment().subtract(2, 'day')],
  三天前: [moment().subtract(3, 'day'), moment().subtract(3, 'day')],
  过去一年: [moment().subtract(1, 'year'), moment()],
};
export default range;

export const rangeConfig: IChartConfig = {
  key: 'dateType',
  defaultValue: 9,
  title: '时间范围',
  type: 'select',
  option: Object.keys(range),
};
