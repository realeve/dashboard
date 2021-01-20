import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import * as lib from '@/component/chartItem/option/lib';

export { mock } from './mock';

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
  url: '/mock/48_bar_group.json',
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
