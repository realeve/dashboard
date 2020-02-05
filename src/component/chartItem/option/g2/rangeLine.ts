import { textColor } from './../index';
import * as R from 'ramda';

const transform = ({ data, x, y, y2, y3 }) =>
  R.map(item => ({
    x: item[x],
    y: [item[y], item[y2]],
    y2: item[y3],
  }))(data);

export const onMount = (
  { data: val, rangeChart = 'area', coord = null, header, x = 0, y = 1, y2 = 2, y3 = 3 },
  chart,
) => {
  let rangeChartType = rangeChart === 'bar' ? 'interval' : 'area';
  let showAverage = !R.isNil(header[y3]);
  chart.scale({
    y: {
      sync: true,
    },
  });

  let fieldColor = {
    label: {
      textStyle: {
        fill: textColor,
      },
    },
  };
  let yStyle = {
    grid: {
      lineStyle: {
        stroke: 'rgba(255, 255, 255, 0.15)',
        lineWidth: 1,
        lineDash: [0, 0],
      },
    },
    ...fieldColor,
  };

  let data = transform({ data: val, x, y, y2, y3 });
  let view1 = chart.view();
  view1.source(data);

  view1[rangeChartType]()
    .position('x*y')
    .color('#1890ff')
    .shape('smooth')
    .opacity(showAverage ? 0.2 : 0.8)
    .tooltip('y', y => {
      return {
        name: '数据区间',
        value: y[0] + ' 至 ' + y[1],
      };
    });

  view1.axis('x', {
    tickLine: {
      visible: false,
    },
    ...fieldColor,
  });
  view1.axis('y', yStyle);

  if (showAverage) {
    let data2 = data.map(item => ({ x: item.x, y: item.y2 }));
    let view2 = chart.view();
    view2.source(data2);
    view2
      .line()
      .position('x*y')
      .shape('smooth')
      .tooltip('y', y => {
        return {
          name: '均值',
          value: y,
        };
      });
    view2
      .point()
      .position('x*y')
      .label('y', {
        textStyle: {
          fill: textColor,
        },
      });
    view2.axis('x', {
      tickLine: {
        visible: false,
      },
      ...fieldColor,
    });
    view2.axis('y', yStyle);

    chart.legend({
      custom: true,
      clickable: false,
      items: [
        { value: '极值', marker: { symbol: 'circle', fill: '#34a4', radius: 5 } },
        { value: '均值', marker: { symbol: 'circle', fill: '#1890FF', radius: 5 } },
      ],
    });

    if (coord === 'polar') {
      view1.coord(coord, {
        innerRadius: 0.5,
      });

      view2.coord(coord, {
        innerRadius: 0.5,
      });
    }
  }

  chart.render();

  const onChange = ({ data: val, view1, view2 }) => {
    let data = transform({ data: val, x, y, y2, y3 });
    view1.changeData(data);

    if (showAverage) {
      let data2 = data.map(item => ({ x: item.x, y: item.y2 }));
      view2.changeData(data2);
    }
  };

  return onChange;
};

/*
setInterval(()=>{
let nextData = val.map(item=>{
  	item[2]+=Math.random()*20 ,
    item[3]+=Math.random()*10;
    return item;
  })  
	onChange({data:nextData,x,y,y2,y3,view1,view2})
},3000)*/
