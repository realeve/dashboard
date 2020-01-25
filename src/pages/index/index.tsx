import React, { useEffect } from 'react';
import { Layout, Button, Upload } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import * as R from 'ramda';
import { useSetState } from 'react-use';
// AVA 图表
import ChartItem from '@/component/chartItem';
import * as lib from '@/utils/lib';

import { saveLayout, loadLayout, saveToLS } from './lib';

import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import './index.less';
import { getNonce } from '@/component/chart/lib';

import styles from './index.less';
import classNames from 'classnames';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;

/**
 * https://www.npmjs.com/package/react-grid-layout
 * 初始化配置项
 */
let initHeight = 100;
let layoutCfg = {
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 50,
  margin: [15, 15],
  containerPadding: [15, 15],
};
let zoom = initHeight / layoutCfg.rowHeight;

const maxCols = 12;

let chartList = [
  {
    name: '柱状图',
    type: 'GroupColumn',
  },
  {
    name: '曲线图',
    type: 'Line',
  },
  {
    name: '堆叠柱形图',
    type: 'StackColumn',
  },
  {
    name: '雷达图',
    type: 'Radar',
  },
  {
    name: '占位区域',
    type: 'blank',
  },
  {
    name: '进度条',
    type: 'progress',
  },
  {
    name: '滚动表单',
    type: 'scrollBoard',
  },
  {
    name: '排名表',
    type: 'rankingBoard',
  },
  {
    name: '翻牌器',
    type: 'flipboard',
  },
  {
    name: '动态环图',
    type: 'activeRingChart',
  },
  {
    name: '百分比环图',
    type: 'RingChart',
  },
  {
    name: '水球图',
    type: 'water',
  },
];

export default () => {
  const [state, setState] = useSetState({
    layouts: {},
    widgets: [],
    borderName: '边框29',
  });

  // 改由文件加载
  // useEffect(() => {
  //   let config = loadLayout();
  //   setState(config);
  // }, []);

  const addChart = (widgetType, type) => {
    const addItem = {
      x: (state.widgets.length * 3) % maxCols,
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2 * zoom,
      i: getNonce(),
    };
    let widgets = [
      ...state.widgets,
      {
        ...addItem,
        config: { widgetType, type },
      },
    ];
    setState({
      widgets,
    });
  };

  const onRemoveItem = idx => {
    let widgets = R.clone(state.widgets).filter((item, index) => index !== idx);
    setState({
      widgets,
    });
  };

  const onLayoutChange = (_, layouts) => {
    setState({ layouts });
  };

  const save = () => {
    console.log(state);
    let layout = saveLayout(state);
    saveToLS('dashboard', layout);
    lib.saveDashboard(layout);
  };

  // mock完毕
  const onMockChange = ({ config, data }, idx) => {
    let widgets = R.clone(state.widgets);
    let item = R.nth(idx)(widgets);

    config.configs = { theme: 'dashboard', padding: 'auto', ...(config.configs || {}) };
    item.config = {
      widgetType: 'autochart',
      config,
      data,
    };
    R.update(idx, item)(widgets);
    setState({ widgets });
  };

  return (
    <>
      <Content className={styles.theme1}>
        <div className={styles.header}>某业务仪表盘</div>
        <ResponsiveReactGridLayout
          className={classNames('layout', styles.canvas)}
          {...layoutCfg}
          layouts={state.layouts}
          onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
        >
          {state.widgets.map(({ i: key, config, ...grid }, idx) => (
            <div data-grid={grid} key={key}>
              <ChartItem
                config={config}
                onMockChange={onMockChange}
                idx={idx}
                borderName={state.borderName}
                onRemoveItem={onRemoveItem}
              />
            </div>
          ))}
        </ResponsiveReactGridLayout>
        <div className={styles.footer} />
      </Content>
      <Header className={styles.config}>
        {chartList.map(item => (
          <Button
            key={item.type}
            style={{ marginRight: 7 }}
            onClick={() => addChart('chart', item.type)}
          >
            添加{item.name}
          </Button>
        ))}
        <br />
        <Button
          type="primary"
          style={{ marginRight: 7, marginLeft: 15 }}
          onClick={() => {
            setState({
              layouts: {},
              widgets: [],
            });
          }}
        >
          清空
        </Button>
        <Button style={{ marginRight: 7, marginLeft: 15 }} onClick={save}>
          <VerticalAlignBottomOutlined /> 存储配置
        </Button>
        <Upload
          showUploadList={false}
          accept=".dashboard"
          style={{ padding: 10 }}
          beforeUpload={file => {
            lib.loadDashboard(file).then(config => {
              let dashboard = loadLayout(config);
              setState(dashboard);
            });
            return false;
          }}
        >
          <Button>
            <VerticalAlignTopOutlined /> 载入配置
          </Button>
        </Upload>
      </Header>
    </>
  );
};
