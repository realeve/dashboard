import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment, { Moment } from 'moment';
import styles from './index.less';

import { IChartConfig } from '@/component/chartItem/interface';

import * as lib from '@/component/chartItem/option/lib';
import { textColor } from '@/component/chartItem/option';

import { useInterval } from 'react-use';

moment.locale('zh-cn');

const dateFormat = [
  {
    value: 'YYYY-MM-DD HH:mm',
    title: 'YYYY-MM-DD HH:mm',
  },
  {
    value: 'YYYY-MM-DD HH:mm:ss',
    title: 'YYYY-MM-DD HH:mm:ss',
  },
  {
    value: 'YYYY年MM月DD日 HH时mm分',
    title: 'YYYY年MM月DD日 HH时mm分',
  },
  {
    value: 'YYYY年MM月DD日 HH时mm分ss秒',
    title: 'YYYY年MM月DD日 HH时mm分ss秒',
  },
  {
    value: 'MM月DD日 HH时mm分',
    title: 'MM月DD日 HH时mm分',
  },
  {
    value: 'MM月DD日 HH时mm分ss秒',
    title: 'MM月DD日 HH时mm分ss秒',
  },
];

export const config: IChartConfig[] = [
  ...lib.getFontConfig(16, textColor),
  {
    key: 'datetype',
    defaultValue: 'YYYY-MM-DD HH:mm:ss',
    title: '日期格式',
    type: 'radio',
    option: dateFormat,
  },
  {
    type: 'switch',
    key: 'showWeekday',
    title: '显示星期',
    defaultValue: true,
  },
  {
    type: 'switch',
    key: 'breakWeekday',
    title: '星期换行显示',
    defaultValue: true,
  },
];
interface ITimeChartProps {
  fontSize: number;
  fontWeight: string | number;
  fontColor: string;
  letterSpacing: number;
  showWeekday: boolean;
  datetype: string;
  flexDirection: boolean;
}

export default ({
  option: {
    fontSize = 16,
    fontWeight = 'normal',
    fontColor = textColor,
    letterSpacing = 0,
    showWeekday = true,
    datetype = 'YYYY年MM月DD日 HH时mm分ss秒',
    breakWeekday = true,
  },
}: {
  option: ITimeChartProps;
}) => {
  const [time, setTime] = useState(moment().month(2));

  const [now, setNow] = useState<string>(moment().format(datetype));

  const [week, setWeek] = useState(moment().format('dddd'));

  useInterval(() => {
    setNow(moment().format(datetype));
    setWeek(moment().format('dddd'));
  }, 1000);

  return (
    <div
      className={styles.mock_guide}
      style={{
        color: fontColor,
        fontSize,
        fontWeight,
        letterSpacing,
        flexDirection: breakWeekday ? 'column' : 'row',
      }}
    >
      <span className={styles.mock_guide}>{now}</span>
      {showWeekday && (
        <span className={styles.mock_guide} style={{ marginLeft: breakWeekday ? 0 : 10 }}>
          {week}{' '}
        </span>
      )}
    </div>
  );
};
