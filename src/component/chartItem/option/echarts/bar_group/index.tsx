import * as R from 'ramda';

export { mock, apiConfig, config, defaultOption } from './mock';

export default ({ data, product = '9997T' }: { data: any; product: string }) => {
  const barWidth = 30;
  const planName = '计划量';
  const whitename = '白纸投入';
  const whitepaper = '白纸';
  const percent = 0.3; // 较短的bar不显示label
  let planDataMin = 0;

  const seriesStyle = {
    type: 'bar',
    stack: 'total',
    label: {
      show: true,
      formatter(e) {
        return planDataMin * percent - e.value > 0 ? '' : `${e.name}: ${e.value}`;
      },
      position: 'insideRight',
    },
    barWidth,
  };

  const handleXData = ({ data: _data, header: _header }): string[] => {
    const prodata = R.filter(R.propEq(_header[0], product))(_data as any[]);
    const allProcessData = R.reject((item: any) => R.equals(item[_header[2]], planName))(prodata);
    // console.log('1');
    return R.uniq(R.pluck(_header[1])(allProcessData));
  };

  const xAxisData = handleXData(data);

  const handleData = ({ data: _data, header: _header }) => {
    const prodata = R.filter(R.propEq(_header[0], product))(_data as any[]);
    let series = [];
    const whitePut = R.project(
      [_header[2], _header[3]],
      R.filter(R.propEq(_header[1], whitepaper))(prodata),
    );
    let whiteData: any[] = [
      { name: whitePut[0][_header[2]], value: Number(whitePut[0][_header[3]]) },
    ];
    whiteData = R.concat(whiteData, R.repeat('-', xAxisData.length - 1));
    series.push({
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
        formatter(e) {
          return `${e.name}: ${e.value}`;
        },
      },
      data: whiteData,
      barWidth,
    });

    const yAxisData: any[] = [];
    const allProcessData = R.reject((item: any) => R.equals(item[_header[2]], planName))(prodata);
    const allProcessGroup = R.groupBy((c: any) => c[_header[1]])(allProcessData);
    const processData = R.reject(
      (item: any) => R.equals(item[_header[2]], planName) || R.equals(item[_header[2]], whitename),
    )(prodata);
    const yAxisGroup: number[] = [];
    R.mapObjIndexed((value: any[]) => {
      yAxisGroup.push(value.length);
    })(allProcessGroup);
    R.forEach((element) => {
      element = new Array(xAxisData.length).fill('-');
      yAxisData.push({ data: element });
    })(new Array(Math.max(...yAxisGroup)));

    const processGroup = R.groupBy((c: any) => c[_header[1]])(processData);
    R.mapObjIndexed((value: any, key: string) => {
      const no = R.indexOf(key)(xAxisData);
      for (let loop = 0; loop < value.length; loop++) {
        yAxisData[loop].data[no] = {
          name: value[loop][_header[2]],
          value: Number(value[loop][_header[3]]),
        };
      }
    })(processGroup);

    series = R.concat(series, R.map((item: any) => R.mergeLeft(seriesStyle, item))(yAxisData));

    const planData: number[] = R.pluck(_header[3])(
      R.filter(R.propEq(_header[2], planName))(prodata),
    ).map(Number);
    planDataMin = Math.min(...planData);
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
