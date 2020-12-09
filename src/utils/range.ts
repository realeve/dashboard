import moment from 'moment';
import { IChartConfig } from '@/component/chartItem/interface';

const range = {
  去年: [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
  今年: [moment().startOf('year'), moment().endOf('year')],
  上半年: [moment().quarter(1).startOf('quarters'), moment().quarter(2).endOf('quarters')],
  下半年: [moment().quarter(3).startOf('quarters'), moment().quarter(4).endOf('quarters')],
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
  昨天: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  今天: [moment(), moment()],
  前天: [moment().subtract(2, 'days'), moment().subtract(2, 'days')],
  三天前: [moment().subtract(3, 'days'), moment().subtract(3, 'days')],
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