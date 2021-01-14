import type { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import { getMax } from '../lib';
import { textColor } from '../index';
import * as lib from '@/component/chartItem/option/lib';
import 'echarts/lib/chart/pictorialBar';
import * as R from 'ramda';

const bgImg =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNS4zNiAzODIiPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZD0iTTMxLjExIDM3Ni40NUg0LjI1QTQuMjUgNC4yNSAwIDAxMCAzNzIuMTlWMzY3YTQuMjUgNC4yNSAwIDAxNC4yNS00LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAxNC4yNSA0LjI1djUuMTlhNC4yNSA0LjI1IDAgMDEtNC4yNSA0LjI2em00LjI1LTIzLjM0di01LjE5YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAzNDcuOTF2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMzI4LjgyVjMzNGE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMzA5LjczdjUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMTlhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDI5MC42M3Y1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI0em0wLTE5LjA5di01LjE5YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAyNzEuNTR2NS4xOUE0LjI1IDQuMjUgMCAwMDQuMjUgMjgxaDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI3em0wLTE5LjA5di01LjE5YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAyNTIuNDV2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMjMzLjM2djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMTlhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI5SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDIxNC4yN3Y1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5di01LjE5YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAxOTUuMTd2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNHptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMTc2LjA4djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDlWMTU3YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAxNTd2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNnptMC0xOS4wOXYtNS4yMmE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMTM3Ljl2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4yM2E0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMTE4Ljh2NS4yYTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5di01LjIzYTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCA5OS43MXY1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5di01LjIzYTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCA4MC42MnY1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5di01LjIzYTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCA2MS41M3Y1LjE5QTQuMjUgNC4yNSAwIDAwNC4yNSA3MWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yOHptMC0xOS4wOXYtNS4yM2E0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgNDIuNDR2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4yNGE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMjMuMzR2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNHptMC0xOS4wOVY0LjI1QTQuMjUgNC4yNSAwIDAwMzEuMTEgMEg0LjI1QTQuMjUgNC4yNSAwIDAwMCA0LjI1djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjZoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjZ6IiBmaWxsPSJub25lIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIiBmaWxsPSIjYTdiYmMzIj48cGF0aCBkPSJNMCAwaDM1LjM2djEzLjdIMHpNMCAxOS4wOWgzNS4zNnYxMy43SDB6TTAgMzguMThoMzUuMzZ2MTMuN0gwek0wIDU3LjI4aDM1LjM2djEzLjdIMHpNMCA3Ni4zN2gzNS4zNnYxMy43SDB6TTAgOTUuNDZoMzUuMzZ2MTMuN0gwek0wIDExNC41NWgzNS4zNnYxMy43SDB6TTAgMTMzLjY0aDM1LjM2djEzLjdIMHpNMCAxNTIuNzRoMzUuMzZ2MTMuN0gwek0wIDE3MS44M2gzNS4zNnYxMy43SDB6bTAgMTkuMDloMzUuMzZ2MTMuN0gwem0wIDE5LjA5aDM1LjM2djEzLjdIMHptMCAxOS4xaDM1LjM2djEzLjdIMHptMCAxOS4wOWgzNS4zNnYxMy43SDB6bTAgMTkuMDloMzUuMzZ2MTMuN0gwek0wIDI4Ni4zOGgzNS4zNnYxMy43SDB6bTAgMTkuMDloMzUuMzZ2MTMuN0gwem0wIDE5LjFoMzUuMzZ2MTMuN0gwem0wIDE5LjA5aDM1LjM2djEzLjdIMHptMCAxOS4wOWgzNS4zNnYxMy43SDB6Ii8+PC9nPjwvc3ZnPg==';

const fillImg =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNS4zNiAzODIiPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj48cGF0aCBpZD0iU1ZHSUQiIGQ9Ik0zMS4xMSAzNzYuNDVINC4yNUE0LjI1IDQuMjUgMCAwMTAgMzcyLjE5VjM2N2E0LjI1IDQuMjUgMCAwMTQuMjUtNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMTQuMjUgNC4yNXY1LjE5YTQuMjUgNC4yNSAwIDAxLTQuMjUgNC4yNnptNC4yNS0yMy4zNHYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMzQ3LjkxdjUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMTlhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDMyOC44MlYzMzRhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMTlhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDMwOS43M3Y1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5di01LjE5YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yNUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAyOTAuNjN2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNHptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMjcxLjU0djUuMTlBNC4yNSA0LjI1IDAgMDA0LjI1IDI4MWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yN3ptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMjUyLjQ1djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMTlhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDIzMy4zNnY1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5di01LjE5YTQuMjUgNC4yNSAwIDAwLTQuMjUtNC4yOUg0LjI1QTQuMjUgNC4yNSAwIDAwMCAyMTQuMjd2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4xOWE0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMTk1LjE3djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjR6bTAtMTkuMDl2LTUuMTlhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDE3Ni4wOHY1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI1aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI1em0wLTE5LjA5VjE1N2E0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgMTU3djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjZ6bTAtMTkuMDl2LTUuMjJhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDEzNy45djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMjNhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDExOC44djUuMmE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4yM2E0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgOTkuNzF2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4yM2E0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgODAuNjJ2NS4xOWE0LjI1IDQuMjUgMCAwMDQuMjUgNC4yNWgyNi44NmE0LjI1IDQuMjUgMCAwMDQuMjUtNC4yNXptMC0xOS4wOXYtNS4yM2E0LjI1IDQuMjUgMCAwMC00LjI1LTQuMjVINC4yNUE0LjI1IDQuMjUgMCAwMDAgNjEuNTN2NS4xOUE0LjI1IDQuMjUgMCAwMDQuMjUgNzFoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjh6bTAtMTkuMDl2LTUuMjNhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDQyLjQ0djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjV6bTAtMTkuMDl2LTUuMjRhNC4yNSA0LjI1IDAgMDAtNC4yNS00LjI1SDQuMjVBNC4yNSA0LjI1IDAgMDAwIDIzLjM0djUuMTlhNC4yNSA0LjI1IDAgMDA0LjI1IDQuMjVoMjYuODZhNC4yNSA0LjI1IDAgMDA0LjI1LTQuMjR6bTAtMTkuMDlWNC4yNUE0LjI1IDQuMjUgMCAwMDMxLjExIDBINC4yNUE0LjI1IDQuMjUgMCAwMDAgNC4yNXY1LjE5YTQuMjUgNC4yNSAwIDAwNC4yNSA0LjI2aDI2Ljg2YTQuMjUgNC4yNSAwIDAwNC4yNS00LjI2eiIgZmlsbD0ibm9uZSIvPjwvY2xpcFBhdGg+PHN0eWxlPi5jbHMtMzl7ZmlsbDojMzNkMGJkfS5jbHMtNDB7ZmlsbDojMzJjZmJlfTwvc3R5bGU+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj48cGF0aCBmaWxsPSIjNWJmNjhkIiBkPSJNMCAwaDM1LjM2djEzLjdIMHoiLz48cGF0aCBmaWxsPSIjNWFmNThlIiBkPSJNMCAxOS4wOWgzNS4zNnYxMy43SDB6Ii8+PHBhdGggZmlsbD0iIzU5ZjQ4ZiIgZD0iTTAgMzguMThoMzUuMzZ2MTMuN0gweiIvPjxwYXRoIGZpbGw9IiM1NmYxOTQiIGQ9Ik0wIDU3LjI4aDM1LjM2djEzLjdIMHoiLz48cGF0aCBmaWxsPSIjNTNlZTk3IiBkPSJNMCA3Ni4zN2gzNS4zNnYxMy43SDB6Ii8+PHBhdGggZmlsbD0iIzRjZTg5ZiIgZD0iTTAgOTUuNDZoMzUuMzZ2MTMuN0gweiIvPjxwYXRoIGZpbGw9IiM0N2UzYTUiIGQ9Ik0wIDExNC41NWgzNS4zNnYxMy43SDB6Ii8+PHBhdGggZmlsbD0iIzQxZGVhYyIgZD0iTTAgMTMzLjY0aDM1LjM2djEzLjdIMHoiLz48cGF0aCBmaWxsPSIjM2JkOGIzIiBkPSJNMCAxNTIuNzRoMzUuMzZ2MTMuN0gweiIvPjxwYXRoIGNsYXNzPSJjbHMtMzkiIGQ9Ik0wIDE3MS44M2gzNS4zNnYxMy43SDB6TTAgMTkwLjkyaDM1LjM2djEzLjdIMHpNMCAyMTAuMDFoMzUuMzZ2MTMuN0gwek0wIDIyOS4xMWgzNS4zNnYxMy43SDB6TTAgMjQ4LjJoMzUuMzZ2MTMuN0gwek0wIDI2Ny4yOWgzNS4zNnYxMy43SDB6Ii8+PHBhdGggY2xhc3M9ImNscy00MCIgZD0iTTAgMjg2LjM4aDM1LjM2djEzLjdIMHpNMCAzMDUuNDdoMzUuMzZ2MTMuN0gwek0wIDMyNC41N2gzNS4zNnYxMy43SDB6TTAgMzQzLjY2aDM1LjM2djEzLjdIMHpNMCAzNjIuNzVoMzUuMzZ2MTMuN0gweiIvPjwvZz48L3N2Zz4=';

export const mock: IChartMock = {
  data: [
    ['通信', 2691],
    ['网络', 4300],
    ['能源', 3416],
    ['建筑', 4666],
  ],
  title: '间隔柱状图_MOCK数据',
  header: ['类型', '值'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    title: '样式',
    type: 'radio',
    key: 'theme',
    defaultValue: 'round',
    option: [
      {
        title: '矩形',
        value: 'rect',
      },
      {
        title: '圆角',
        value: 'round',
      },
    ],
  },
  {
    key: 'size',
    defaultValue: 52,
    title: '尺寸',
    type: 'range',
    min: 24,
    max: 120,
    step: 2,
  },
  {
    key: 'yAxis',
    defaultValue: true,
    title: '显示y轴',
    type: 'switch',
  },
  {
    key: 'axisFontSize',
    defaultValue: 16,
    title: 'X/Y轴 字号',
    step: 1,
    type: 'range',
    min: 12,
    max: 60,
  },
  ...lib.getFontConfig(16, '#ffc72b'),
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/12_pictorial_bar.json',
  interval: 5,
  cache: 2,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

const getSeries = ({ data, theme = 'rect', size, config: seriesConfig }) => {
  const bgData = [];
  const itemData = [];

  // 取出每一条数据value,作为显示数据
  data.forEach((items) => {
    itemData.push(items.value);
  });

  // 取出所有数据最大值,作为背景象形柱图数据
  data.forEach((items) => {
    bgData.push({
      name: items.name,
      value: Math.max.apply(null, itemData),
    });
  });

  // 所有数据最大值
  const max = getMax(Math.max.apply(null, itemData));

  const lineData = R.range(0, data.length).fill(max);

  const animate = {
    symbolSize: [size, '100%'],
    animationEasing: 'elasticOut',
    animationDelay: (idx) => idx * 33,
  };
  const label = {
    z: -1,
    silent: true,
    label: {
      show: true,
      position: 'top',
      distance: 5,
      formatter(params) {
        return data[params.dataIndex].value;
      },
      color: seriesConfig.fontColor || '#ffc72b',
      fontSize: seriesConfig.fontSize,
      fontWeight: seriesConfig.fontWeight,
    },
  };
  if (theme === 'rect') {
    return [
      {
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: 'rgba(54,215,182,0.15)',
        },
        barWidth: 8,
        symbolRepeat: true,
        data: lineData,
        ...label,
        ...animate,
      },
      {
        type: 'pictorialBar',
        symbol: 'rect',
        barWidth: 8,
        itemStyle: {
          color: '#36d7b6',
        },
        symbolRepeat: true,
        data,
        ...animate,
      },
    ];
  }
  return [
    // 背景
    {
      type: 'pictorialBar',
      barWidth: '45%',
      symbol: `image://${bgImg}`,
      symbolClip: false,
      symbolBoundingData: max,
      data: bgData,
      itemStyle: {
        opacity: 0.18,
      },
      ...label,
      ...animate,
    },
    {
      type: 'pictorialBar',
      barWidth: '45%',
      barGap: '-100%',
      data,
      symbol: `image://${fillImg}`,
      symbolClip: true,
      symbolBoundingData: max,
      ...animate,
    },
  ];
};

export interface IPictorialBar {
  data: {
    data: (number | string)[][];
  };
  size?: number;
  x?: number;
  y?: number;
  yAxis?: boolean;
  theme?: 'rect' | 'round';
  axisFontSize?: number;
  fontSize?: number;
}

export default ({
  data: { data },
  size = 52,
  x = 0,
  y = 1,
  yAxis = false,
  theme = 'rect',
  axisFontSize = 16,
  ...props
}: IPictorialBar) => {
  const chartData = data.map((item) => ({ name: item[x], value: item[y] }));

  return {
    tooltip: {
      formatter: (params) => {
        const { name, value } = params[1].data;
        return `${name}: ${value}`;
      },
    },
    grid: {
      left: '3%',
      top: 10 + (props.fontSize || 16),
      right: '1%',
      bottom: '1%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ((xData) => xData.map((items) => items.name))(chartData),
        // boundaryGap: ['20%', '20%'],
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize: axisFontSize,
          color: textColor,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: yAxis,
          inside: true,
          length: 10,
          lineStyle: {
            color: textColor,
          },
        },
        axisLabel: {
          show: yAxis,
          color: textColor,
          fontSize: axisFontSize,
        },
      },
    ],
    series: getSeries({ data: chartData, theme, size, config: props }),
  };
};
