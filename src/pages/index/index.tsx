import React, { useEffect } from 'react';
import { Layout, Button, Upload } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import * as R from 'ramda';
import { useSetState } from 'react-use';
// AVA 图表
import GridItem from '@/component/chart/chart';
import * as lib from '@/utils/lib';

import { saveLayout, loadLayout, saveToLS } from './lib';

import {
  CloseOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import './index.less';
import { getNonce } from '@/component/chart/lib';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  background: '#222e4e',
  zIndex: 1,
  bottom: 0,
  width: '100%',
  padding: '0 20px',
};

let layoutCfg = {
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 150,
};

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
    name: '占位区域',
    type: '',
  },
];

export default () => {
  const [state, setState] = useSetState({
    layouts: {},
    widgets: [],
  });

  // 改由文件加载
  // useEffect(() => {
  //   let config = loadLayout();
  //   setState(config);
  // }, []);

  const addChart = type => {
    const addItem = {
      x: (state.widgets.length * 3) % maxCols,
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: getNonce(),
    };
    let widgets = [
      ...state.widgets,
      {
        ...addItem,
        type,
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
    let layout = saveLayout(state);
    saveToLS('dashboard', layout);
    lib.saveDashboard(layout);
    console.log(state);
  };

  return (
    <>
      <Content>
        <div
          style={{
            background: '#222e4e',
            // padding: 10,
            minHeight: 'calc( 100vh - 64px )',
          }}
        >
          <ResponsiveReactGridLayout
            className="layout"
            {...layoutCfg}
            layouts={state.layouts}
            onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
          >
            {state.widgets.map(({ i: key, type, ...grid }, idx) => (
              <div data-grid={grid} key={key}>
                <CloseOutlined className="remove" onClick={() => onRemoveItem(idx)} />
                <GridItem type={type} />
              </div>
            ))}
          </ResponsiveReactGridLayout>
        </div>
      </Content>
      <Header style={headerStyle}>
        {chartList.map(item => (
          <Button
            key={item.type}
            type="primary"
            style={{ marginRight: 7 }}
            onClick={() => addChart(item.type)}
          >
            添加{item.name}
          </Button>
        ))}
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
