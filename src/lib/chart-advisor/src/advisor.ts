import Wiki, { LevelOfMeasurement as LOM } from '@antv/wiki';
import { Type as ChartType } from '@antv/wiki';
import Rules, { Rule, Preferences } from '@antv/rules';
import * as DWAnalyzer from '@antv/dw-analyzer';

export interface Channels {
  x?: string;
  x2?: string;
  y?: string;
  y2?: string;
  color?: string;
  angle?: string;
  radius?: string;
  series?: string;
  size?: string;
}

export interface Advice {
  type: string;
  channels: Channels;
  score: number;
}

export interface Options {
  /**
   * 分析目的
   */
  purpose?: string;
  /**
   * 偏好设置
   */
  preferences?: Preferences;
  /**
   * 标题
   */
  title?: string;
  /**
   * 描述
   */
  description?: string;
}

interface FieldInfo extends DWAnalyzer.FieldInfo {
  name: string;
  levelOfMeasurements: LOM;
}

function compare(f1: FieldInfo, f2: FieldInfo) {
  if (f1.distinct < f2.distinct) {
    return 1;
  } else if (f1.distinct > f2.distinct) {
    return -1;
  } else {
    return 0;
  }
}

export function analyze(data: any[], options?: Options): Advice[] {
  console.log('OPTIONS_____________---------');
  console.log(options); // temp

  const purpose = options ? options.purpose : '';
  const preferences = options ? options.preferences : undefined;

  console.log(data);

  const datap = DWAnalyzer.typeAll(data);

  const dataP: FieldInfo[] = [];

  datap.forEach((info) => {
    const newInfo: FieldInfo = { ...info, levelOfMeasurements: new LOM([]) };
    const lOM: string[] = [];
    if (DWAnalyzer.isNominal(info)) lOM.push('Nominal');
    if (DWAnalyzer.isOrdinal(info)) lOM.push('Ordinal');
    if (DWAnalyzer.isInterval(info)) lOM.push('Interval');
    if (DWAnalyzer.isDiscrete(info)) lOM.push('Discrete');
    if (DWAnalyzer.isContinuous(info)) lOM.push('Continuous');
    if (DWAnalyzer.isTime(info)) lOM.push('Time');
    newInfo['levelOfMeasurements'] = LOM.newFromStringArray(lOM);

    dataP.push(newInfo);
  });

  console.log('dataP');
  console.log(dataP);

  const allTypes = Object.keys(Wiki);
  const list: Advice[] = allTypes.map((t) => {
    // anaylze score
    let score = 0;

    let hardScore = 1;
    Rules.filter((r: Rule) => r.hardOrSoft === 'HARD' && r.specChartTypes.includes(t as ChartType)).forEach(
      (hr: Rule) => {
        // console.log('H rule: ', hr.id, ' ; charttype: ', t);
        // console.log(hr.check({ dataProps: dataP, chartType: t, purpose, preferences }));
        hardScore *= hr.check({ dataProps: dataP, chartType: t, purpose, preferences });
      }
    );

    let softScore = 0;
    Rules.filter((r: Rule) => r.hardOrSoft === 'SOFT' && r.specChartTypes.includes(t as ChartType)).forEach(
      (sr: Rule) => {
        // console.log('S rule: ', sr.id, ' ; charttype: ', t);
        // console.log(sr.check({ dataProps: dataP, chartType: t, purpose, preferences }));
        softScore += sr.check({ dataProps: dataP, chartType: t, purpose, preferences });
      }
    );

    score = hardScore * (1 + softScore);

    console.log('score: ', score, '=', hardScore, '* (1 +', softScore, ') ;charttype: ', t);

    // analyze channels
    const channels: Channels = {};
    // for Pie | Donut
    if (t === 'Pie' || t === 'Donut') {
      const field4Color = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));
      const field4Angle = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4Angle && field4Color) {
        channels.color = field4Color.name;
        channels.angle = field4Angle.name;
      } else {
        score = 0;
      }
    }

    // for Line
    if (t === 'Line') {
      const field4X = dataP.find((field) => field.levelOfMeasurements.intersects(new LOM(['Time', 'Ordinal'])));
      const field4Y = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));
      const field4Color = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));

      if (field4Color) {
        channels.color = field4Color.name;
      }

      if (field4X && field4Y) {
        channels.x = field4X.name;
        channels.y = field4Y.name;
      } else {
        score = 0;
      }
    }

    // for Area
    if (t === 'Area') {
      const field4X = dataP.find((field) => field.levelOfMeasurements.intersects(new LOM(['Time', 'Ordinal'])));
      const field4Y = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4X && field4Y) {
        channels.x = field4X.name;
        channels.y = field4Y.name;
      } else {
        score = 0;
      }
    }

    // for Bar
    if (t === 'Bar') {
      const nominalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));
      const sortedNominalFields = nominalFields.sort(compare);

      const field4Y = sortedNominalFields[0];
      const field4Color = sortedNominalFields[1];

      const field4X = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4X && field4Y) {
        channels.y = field4Y.name;
        channels.x = field4X.name;
        if (field4Color) {
          channels.color = field4Color.name;
        }
      } else {
        score = 0;
      }
    }

    // for Column
    if (t === 'Column') {
      const nominalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));
      const sortedNominalFields = nominalFields.sort(compare);

      const field4X = sortedNominalFields[0];
      const field4Color = sortedNominalFields[1];

      const field4Y = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4X && field4Y) {
        channels.y = field4Y.name;
        channels.x = field4X.name;
        if (field4Color) {
          channels.color = field4Color.name;
        }
      } else {
        score = 0;
      }
    }

    // for GroupedBar | StackedBar | PercentageStackedBar
    if (t === 'GroupedBar' || t === 'StackedBar' || t === 'PercentageStackedBar') {
      const nominalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));

      const sortedNominalFields = nominalFields.sort(compare);

      const field4Y1 = sortedNominalFields[0];
      const field4Y2 = sortedNominalFields[1];
      const field4X = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4Y1 && field4Y2 && field4X) {
        channels.y = field4Y1.name;
        channels.y2 = field4Y2.name;
        channels.x = field4X.name;
      } else {
        score = 0;
      }
    }

    // for GroupedColumn | StackedColumn | PercentageStackedColumn
    if (t === 'GroupedColumn' || t === 'StackedColumn' || t === 'PercentageStackedColumn') {
      const nominalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));

      const sortedNominalFields = nominalFields.sort(compare);

      const field4X1 = sortedNominalFields[0];
      const field4X2 = sortedNominalFields[1];
      const field4Y = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4X1 && field4X2 && field4Y) {
        channels.x = field4X1.name;
        channels.x2 = field4X2.name;
        channels.y = field4Y.name;
      } else {
        score = 0;
      }
    }

    // for StackedArea | PercentageStackedArea
    if (t === 'StackedArea' || t === 'PercentageStackedArea') {
      const field4X1 = dataP.find((field) => field.levelOfMeasurements.intersects(new LOM(['Ordinal', 'Time'])));
      const field4X2 = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));
      const field4Y = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4X1 && field4X2 && field4Y) {
        channels.x = field4X1.name;
        channels.x2 = field4X2.name;
        channels.y = field4Y.name;
      } else {
        score = 0;
      }
    }

    // for Radar
    if (t === 'Radar') {
      const nominalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));

      const sortedNominalFields = nominalFields.sort(compare);

      const field4Angle = sortedNominalFields[0];
      const field4Series = sortedNominalFields[1];
      const field4Radius = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      if (field4Angle && field4Series && field4Radius) {
        channels.angle = field4Angle.name;
        channels.series = field4Series.name;
        channels.radius = field4Radius.name;
      } else {
        score = 0;
      }
    }

    // for Scatter
    if (t === 'Scatter') {
      const intervalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      const sortedIntervalFields = intervalFields.sort(compare);

      const field4X = sortedIntervalFields[0];
      const field4Y = sortedIntervalFields[1];

      const field4Color = dataP.find((field) => field.levelOfMeasurements.includes(new LOM(['Nominal'])));

      if (field4X && field4Y) {
        channels.x = field4X.name;
        channels.y = field4Y.name;
        if (field4Color) {
          channels.color = field4Color.name;
        }
      } else {
        score = 0;
      }
    }

    // for Bubble
    if (t === 'Bubble') {
      const intervalFields = dataP.filter((field) => field.levelOfMeasurements.includes(new LOM(['Interval'])));

      const triple = {
        x: intervalFields[0],
        y: intervalFields[1],
        corr: 0,
        size: intervalFields[2],
      };
      for (let i = 0; i < intervalFields.length; i++) {
        for (let j = i + 1; j < intervalFields.length; j++) {
          const p = DWAnalyzer.pearson(intervalFields[i], intervalFields[j]);
          if (Math.abs(p) > triple.corr) {
            triple.x = intervalFields[i];
            triple.y = intervalFields[j];
            triple.corr = p;
            triple.size = intervalFields[[...Array(intervalFields.length).keys()].find((e) => e !== i && e !== j) || 0];
          }
        }
      }

      const field4X = triple.x;
      const field4Y = triple.y;
      const field4Size = triple.size;

      const field4Color = dataP.find((field) => field.levelOfMeasurements.intersects(new LOM(['Nominal'])));

      if (field4X && field4Y && field4Size && field4Color) {
        channels.x = field4X.name;
        channels.y = field4Y.name;
        channels.size = field4Size.name;
        channels.color = field4Color.name;
      } else {
        score = 0;
      }
    }

    return {
      type: t,
      channels,
      score,
    };
  });

  // sort list

  function compareAdvices(chart1: Advice, chart2: Advice) {
    if (chart1.score < chart2.score) {
      return 1;
    } else if (chart1.score > chart2.score) {
      return -1;
    } else {
      return 0;
    }
  }

  const resultList = list.filter((e) => e.score !== 0).sort(compareAdvices);

  console.log('***************8 resultList ************');
  console.log(resultList);

  return resultList;
}
