import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';

import * as lib from '@/component/chartItem/option/lib';
// import { textColor } from '@/component/chartItem/option';

export const mock: IChartMock = {
  data: [
    {
      品种: '9992T',
      工序: '白纸',
      机台: '白纸投入',
      产量: '200',
    },
    {
      品种: '9992T',
      工序: '胶印',
      机台: '8色水胶印机1号',
      产量: '137',
    },
    {
      品种: '9992T',
      工序: '凹一印',
      机台: 'W92-2号',
      产量: '128',
    },
    {
      品种: '9992T',
      工序: '印码',
      机台: '多功能-1号',
      产量: '137',
    },
    {
      品种: '9992T',
      工序: '涂布',
      机台: '涂布-2号',
      产量: '128',
    },
    {
      品种: '9992T',
      工序: '裁切/裁封',
      机台: '裁封-6号',
      产量: '141',
    },
    {
      品种: '9992T',
      工序: '裁切/裁封',
      机台: '裁切机-1号',
      产量: '12',
    },
    {
      品种: '9992T',
      工序: '裁切/裁封',
      机台: '裁切机-2号',
      产量: '0',
    },
    {
      品种: '9992T',
      工序: '裁切/裁封',
      机台: '裁切机-3号',
      产量: '3',
    },
    {
      品种: '9992T',
      工序: '装箱',
      机台: '装箱-2号',
      产量: '139',
    },
    {
      品种: '9992T',
      工序: '装箱',
      机台: '装箱-3号',
      产量: '2',
    },
    {
      品种: '9992T',
      工序: '装箱',
      机台: '装箱-4号',
      产量: '1',
    },
    {
      品种: '9993T',
      工序: '白纸',
      机台: '白纸投入',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '凹二印',
      机台: 'SD-2号',
      产量: '35',
    },
    {
      品种: '9993T',
      工序: '印码',
      机台: '丝凸印-3号',
      产量: '66',
    },
    {
      品种: '9993T',
      工序: '涂布',
      机台: '涂布-4号',
      产量: '27',
    },
    {
      品种: '9994T',
      工序: '白纸',
      机台: '白纸投入',
      产量: '200',
    },
    {
      品种: '9994T',
      工序: '胶印',
      机台: 'J98-2号',
      产量: '132',
    },
    {
      品种: '9994T',
      工序: '凹一印',
      机台: 'W92A-4号',
      产量: '133',
    },
    {
      品种: '9994T',
      工序: '凹二印',
      机台: 'W92B-6号',
      产量: '133',
    },
    {
      品种: '9994T',
      工序: '印码',
      机台: '丝凸检-3号',
      产量: '120',
    },
    {
      品种: '9994T',
      工序: '涂布',
      机台: '涂布-3号',
      产量: '137',
    },
    {
      品种: '9994T',
      工序: '裁切/裁封',
      机台: '裁封-8号',
      产量: '77',
    },
    {
      品种: '9994T',
      工序: '裁切/裁封',
      机台: '裁切机-1号',
      产量: '0',
    },
    {
      品种: '9994T',
      工序: '裁切/裁封',
      机台: '裁切机-2号',
      产量: '1',
    },
    {
      品种: '9994T',
      工序: '装箱',
      机台: '装箱-3号',
      产量: '71',
    },
    {
      品种: '9996T',
      工序: '白纸',
      机台: '白纸投入',
      产量: '400',
    },
    {
      品种: '9996T',
      工序: '胶印',
      机台: 'J98-5号',
      产量: '129',
    },
    {
      品种: '9996T',
      工序: '胶印',
      机台: 'J98-6号',
      产量: '130',
    },
    {
      品种: '9996T',
      工序: '凹一印',
      机台: 'W92C-11号',
      产量: '103',
    },
    {
      品种: '9996T',
      工序: '凹一印',
      机台: 'W92C-7号',
      产量: '132',
    },
    {
      品种: '9996T',
      工序: '凹二印',
      机台: 'W92C-10号',
      产量: '105',
    },
    {
      品种: '9996T',
      工序: '凹二印',
      机台: 'W92C-12号',
      产量: '124',
    },
    {
      品种: '9996T',
      工序: '印码',
      机台: '丝凸检-1号',
      产量: '105',
    },
    {
      品种: '9996T',
      工序: '印码',
      机台: '丝凸检-2号',
      产量: '124',
    },
    {
      品种: '9996T',
      工序: '涂布',
      机台: '涂布-1号',
      产量: '121',
    },
    {
      品种: '9996T',
      工序: '涂布',
      机台: '涂布-5号',
      产量: '125',
    },
    {
      品种: '9996T',
      工序: '裁切/裁封',
      机台: '裁封-4号',
      产量: '169',
    },
    {
      品种: '9996T',
      工序: '裁切/裁封',
      机台: '裁切机-2号',
      产量: '15',
    },
    {
      品种: '9996T',
      工序: '裁切/裁封',
      机台: '裁切机-3号',
      产量: '58',
    },
    {
      品种: '9996T',
      工序: '装箱',
      机台: '装箱-3号',
      产量: '196',
    },
    {
      品种: '9997T',
      工序: '白纸',
      机台: '白纸投入',
      产量: '600',
    },
    {
      品种: '9997T',
      工序: '胶印',
      机台: 'J98-1号',
      产量: '131',
    },
    {
      品种: '9997T',
      工序: '胶印',
      机台: 'J98-3号',
      产量: '116',
    },
    {
      品种: '9997T',
      工序: '胶印',
      机台: 'J98-4号',
      产量: '139',
    },
    {
      品种: '9997T',
      工序: '胶印',
      机台: 'J98-7号',
      产量: '2',
    },
    {
      品种: '9997T',
      工序: '丝印',
      机台: 'KY18丝印机-1#',
      产量: '138',
    },
    {
      品种: '9997T',
      工序: '丝印',
      机台: '丝凸印-1号',
      产量: '135',
    },
    {
      品种: '9997T',
      工序: '丝印',
      机台: '丝凸印-2号',
      产量: '122',
    },
    {
      品种: '9997T',
      工序: '丝印',
      机台: '丝凸印-3号',
      产量: '13',
    },
    {
      品种: '9997T',
      工序: '凹一印',
      机台: 'W10-1号',
      产量: '110',
    },
    {
      品种: '9997T',
      工序: '凹一印',
      机台: '接线凹-3号',
      产量: '137',
    },
    {
      品种: '9997T',
      工序: '凹一印',
      机台: '接线凹-4号',
      产量: '131',
    },
    {
      品种: '9997T',
      工序: '凹二印',
      机台: '接线凹-2号',
      产量: '90',
    },
    {
      品种: '9997T',
      工序: '凹二印',
      机台: '接线凹-5号',
      产量: '134',
    },
    {
      品种: '9997T',
      工序: '凹二印',
      机台: '接线凹-6号',
      产量: '137',
    },
    {
      品种: '9997T',
      工序: '印码',
      机台: 'DMJ12-1号',
      产量: '140',
    },
    {
      品种: '9997T',
      工序: '印码',
      机台: 'DMJ12-2号',
      产量: '142',
    },
    {
      品种: '9997T',
      工序: '印码',
      机台: 'M97-3号',
      产量: '118',
    },
    {
      品种: '9997T',
      工序: '裁切/裁封',
      机台: '裁封-10号',
      产量: '164',
    },
    {
      品种: '9997T',
      工序: '裁切/裁封',
      机台: '裁封-9号',
      产量: '165',
    },
    {
      品种: '9997T',
      工序: '裁切/裁封',
      机台: '裁切机-1号',
      产量: '45',
    },
    {
      品种: '9997T',
      工序: '裁切/裁封',
      机台: '裁切机-2号',
      产量: '120',
    },
    {
      品种: '9997T',
      工序: '裁切/裁封',
      机台: '裁切机-3号',
      产量: '9',
    },
    {
      品种: '9997T',
      工序: '装箱',
      机台: '装箱-1号',
      产量: '471',
    },
    {
      品种: 'NRB10',
      工序: '白纸',
      机台: '白纸投入',
      产量: '218',
    },
    {
      品种: 'NRB10',
      工序: '胶一印',
      机台: '小森机-1号',
      产量: '139',
    },
    {
      品种: 'NRB10',
      工序: '胶二印',
      机台: '小森机-3号',
      产量: '28',
    },
    {
      品种: '9992T',
      工序: '胶印',
      机台: '计划量',
      产量: '240',
    },
    {
      品种: '9992T',
      工序: '凹一印',
      机台: '计划量',
      产量: '230',
    },
    {
      品种: '9992T',
      工序: '印码',
      机台: '计划量',
      产量: '220',
    },
    {
      品种: '9992T',
      工序: '涂布',
      机台: '计划量',
      产量: '220',
    },
    {
      品种: '9992T',
      工序: '裁切/裁封',
      机台: '计划量',
      产量: '300',
    },
    {
      品种: '9992T',
      工序: '装箱',
      机台: '计划量',
      产量: '300',
    },
    {
      品种: '9992T',
      工序: '解缴',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9992T',
      工序: '白纸投入',
      机台: '计划量',
      产量: '240',
    },
    {
      品种: '9993T',
      工序: '胶印',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '凹二印',
      机台: '计划量',
      产量: '90',
    },
    {
      品种: '9993T',
      工序: '印码',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '涂布',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '裁切/裁封',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '装箱',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '解缴',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9993T',
      工序: '白纸投入',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9994T',
      工序: '胶印',
      机台: '计划量',
      产量: '220',
    },
    {
      品种: '9994T',
      工序: '凹一印',
      机台: '计划量',
      产量: '210',
    },
    {
      品种: '9994T',
      工序: '凹二印',
      机台: '计划量',
      产量: '110',
    },
    {
      品种: '9994T',
      工序: '印码',
      机台: '计划量',
      产量: '210',
    },
    {
      品种: '9994T',
      工序: '涂布',
      机台: '计划量',
      产量: '230',
    },
    {
      品种: '9994T',
      工序: '裁切/裁封',
      机台: '计划量',
      产量: '143',
    },
    {
      品种: '9994T',
      工序: '装箱',
      机台: '计划量',
      产量: '143',
    },
    {
      品种: '9994T',
      工序: '解缴',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9994T',
      工序: '白纸投入',
      机台: '计划量',
      产量: '220',
    },
    {
      品种: '9996T',
      工序: '胶印',
      机台: '计划量',
      产量: '440',
    },
    {
      品种: '9996T',
      工序: '凹一印',
      机台: '计划量',
      产量: '340',
    },
    {
      品种: '9996T',
      工序: '凹二印',
      机台: '计划量',
      产量: '340',
    },
    {
      品种: '9996T',
      工序: '印码',
      机台: '计划量',
      产量: '410',
    },
    {
      品种: '9996T',
      工序: '涂布',
      机台: '计划量',
      产量: '410',
    },
    {
      品种: '9996T',
      工序: '裁切/裁封',
      机台: '计划量',
      产量: '486',
    },
    {
      品种: '9996T',
      工序: '装箱',
      机台: '计划量',
      产量: '486',
    },
    {
      品种: '9996T',
      工序: '解缴',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: '9996T',
      工序: '白纸投入',
      机台: '计划量',
      产量: '440',
    },
    {
      品种: '9997T',
      工序: '胶印',
      机台: '计划量',
      产量: '840',
    },
    {
      品种: '9997T',
      工序: '丝印',
      机台: '计划量',
      产量: '820',
    },
    {
      品种: '9997T',
      工序: '凹一印',
      机台: '计划量',
      产量: '710',
    },
    {
      品种: '9997T',
      工序: '凹二印',
      机台: '计划量',
      产量: '710',
    },
    {
      品种: '9997T',
      工序: '印码',
      机台: '计划量',
      产量: '740',
    },
    {
      品种: '9997T',
      工序: '裁切/裁封',
      机台: '计划量',
      产量: '771',
    },
    {
      品种: '9997T',
      工序: '装箱',
      机台: '计划量',
      产量: '771',
    },
    {
      品种: '9997T',
      工序: '解缴',
      机台: '计划量',
      产量: '286',
    },
    {
      品种: '9997T',
      工序: '白纸投入',
      机台: '计划量',
      产量: '840',
    },
    {
      品种: 'NRB10',
      工序: '胶一印',
      机台: '计划量',
      产量: '260',
    },
    {
      品种: 'NRB10',
      工序: '胶二印',
      机台: '计划量',
      产量: '200',
    },
    {
      品种: 'NRB10',
      工序: '凹一印',
      机台: '计划量',
      产量: '110',
    },
    {
      品种: 'NRB10',
      工序: '凹二印',
      机台: '计划量',
      产量: '60',
    },
    {
      品种: 'NRB10',
      工序: '印码',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: 'NRB10',
      工序: '涂布',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: 'NRB10',
      工序: '裁切/裁封',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: 'NRB10',
      工序: '装箱',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: 'NRB10',
      工序: '解缴',
      机台: '计划量',
      产量: '0',
    },
    {
      品种: 'NRB10',
      工序: '白纸投入',
      机台: '计划量',
      产量: '260',
    },
  ],
  rows: 121,
  dates: [],
  ip: '10.8.60.234',
  header: ['品种', '工序', '机台', '产量'],
  title: '各工序本月生产完成情况',
  time: '633.455ms',
  serverTime: '2021-01-20 13:01:25',
  source: '数据来源：MES系统_生产环境',
  hash: 'W/"d1baaf8cdc398dbf4d878cb65bb8d00e"',
};

export const config: IChartConfig[] = [
  {
    key: 'legend',
    defaultValue: 0,
  },
  {
    key: 'x',
    defaultValue: 1,
  },
  {
    key: 'y',
    defaultValue: 2,
  },
  ...lib.getPositionConfig(),
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/0_bar_group.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

export const defaultOption = {
  renderer: 'canvas',
};

export default ({
  data,
  // legend = 0,
  // x = 1,
  // y = 2,
}) => {
  // if (String(legend) === '') {
  //   return {};
  // }

  const planName = '计划量';
  const barWidth = 30;
  const product: string = '9997T';
  const whitename = '白纸投入';
  const whitepaper = '白纸';

  const seriesStyle = {
    type: 'bar',
    stack: 'total',
    label: {
      show: true,
      formatter(e) {
        return `${e.name}: ${e.value}`;
      },
      position: 'insideRight',
    },
    barWidth,
  };

  const handleXData = ({ data: _data, header: _header }): string[] => {
    const prodata = R.filter(R.propEq(_header[0], product))(_data as any[]);
    const allProcessData = R.reject((item: any) => R.equals(item[_header[2]], planName))(prodata);

    return R.uniq(R.pluck(_header[1])(allProcessData));
  };

  const xAxisData = handleXData(data);
  console.log('xaxis', xAxisData);

  const handleData = ({ data: _data, header: _header }) =>
    // { legend: _legend, x: _x, y: _y }: { legend?: number | string; x: number | string; y: number | string },
    {
      const prodata = R.filter(R.propEq(_header[0], product))(_data as any[]);
      let series = [];

      // if (typeof legend === 'undefined') {
      // } else {
      const whitePut = R.project(
        [_header[2], _header[3]],
        R.filter(R.propEq(_header[1], whitepaper))(prodata),
      );
      let whiteData: any[] = [];
      whiteData.push({ name: whitePut[0][_header[2]], value: Number(whitePut[0][_header[3]]) });
      whiteData = R.concat(whiteData, R.repeat('-', xAxisData.length - 1));

      // console.log('whiteData', whiteData);
      series.push({
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        data: whiteData,
        barWidth,
      });

      const allProcessData = R.reject((item: any) => R.equals(item[_header[2]], planName))(prodata);
      const allProcessGroup = R.groupBy((c: any) => c[_header[1]])(allProcessData);
      const processData = R.reject(
        (item: any) =>
          R.equals(item[_header[2]], planName) || R.equals(item[_header[2]], whitename),
      )(prodata);
      const processGroup = R.groupBy((c: any) => c[_header[1]])(processData);
      const yAxisGroup: number[] = [];
      R.mapObjIndexed((value: any[]) => {
        yAxisGroup.push(value.length);
        // yAxisData.push(value);
      })(allProcessGroup);
      const yAxisGroupMax = Math.max(...yAxisGroup);
      // let yAxisData1 = new Array(2);
      let yAxisData: any[] = [];
      R.forEach((element) => {
        element = new Array(xAxisData.length).fill('-');
        yAxisData.push({ data: element });
      })(new Array(yAxisGroupMax));

      R.mapObjIndexed((value: any, key: string) => {
        const no = R.indexOf(key)(xAxisData);
        for (let loop = 0; loop < value.length; loop++) {
          yAxisData[loop]['data'][no] = {
            name: value[loop][_header[2]],
            value: value[loop][_header[3]],
          };
        }
      })(processGroup);

      yAxisData = R.map((item: {}) => {
        // console.log("item", item);
        return R.mergeLeft(seriesStyle, item);
      })(yAxisData);
      // console.log("yAxisData", yAxisData);
      series = R.concat(series, yAxisData);

      const planData: number[] = R.pluck(_header[3])(
        R.filter(R.propEq(_header[2], planName))(prodata),
      ).map(Number);
      // console.log('planData', planData);
      series.push({
        name: planName,
        type: 'line',
        data: planData,
        lineStyle: {
          width: 0,
        },
        color: '#0ef',
        symbolSize: [2, 16 + barWidth],
        symbol: 'rect',
        label: {
          show: true,
          position: 'center',
          rotate: 90,
          offset: [-4 - barWidth, 6],
          color: '#fff',
          formatter(e) {
            if (e.dataIndex === xAxisData.length - 1) {
              return `${e.value}(${planName})`;
            }
            return e.value;
          },
        },
      });
      // }

      return series;
    };

  const series = handleData(data);

  return {
    backgroundColor: '#080226',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
      formatter(e) {
        const arr = e.filter((item) => item.value !== '-' && item.seriesName !== planName);
        const plan = e.find((item) => item.seriesName === planName);
        const str = arr
          .map((item) => `<div>${item.marker} ${item.name}: ${item.value}</div>`)
          .join('');
        const sum = arr.reduce((b, a) => a.value + b, 0);
        return `<div><b>${arr[0].axisValue}</b><br/>${str}<div style="border-top:1px solid #ddd;margin-top:8px;padding-top:8px">合计: ${sum}</div><div>${plan.seriesName}: ${plan.value}</div></div>`;
      },
    },
    // legend: lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    grid: {
      // left: '3%',
      // right: '4%',
      // bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: null,
    },
    yAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: false,
      axisLine: false,
      axisLabel: { color: '#fff' },
    },
    series,
  };
};
