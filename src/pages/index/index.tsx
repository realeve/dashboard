import React, { PureComponent } from 'react';
import { Layout, Button } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';

// AVA 图表
// import { AChart } from '@/component/chart/ava';

import { AChart as GChart } from '@/component/chart/g2plot';
import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import './index.less';

import getOption from './option';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;

const headerStyle = {
  position: 'fixed',
  background: '#222e4e',
  zIndex: 1,
  bottom: 0,
  width: '100%',
  padding: '0 20px',
};

export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 150,
  };

  constructor(props) {
    super(props);

    this.state = {
      layouts: this.getFromLS('layouts') || {},
      widgets: [],
    };
  }

  getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
      ls = JSON.parse(global.localStorage.getItem('rgl-8') || '{}');
    }
    return ls[key];
  }

  saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(
        'rgl-8',
        JSON.stringify({
          [key]: value,
        }),
      );
    }
  }

  generateDOM = () => {
    return _.map(this.state.widgets, (item, i) => {
      return (
        <div key={item.i} data-grid={item}>
          <CloseOutlined className="remove" onClick={this.onRemoveItem.bind(this, i)} />
          <GChart option={getOption(item.type)} />
        </div>
      );
    });
  };

  addChart(type) {
    const addItem = {
      x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    this.setState({
      widgets: this.state.widgets.concat({
        ...addItem,
        type,
      }),
    });
  }

  onRemoveItem(i) {
    this.setState({
      widgets: this.state.widgets.filter((item, index) => index != i),
    });
  }

  onLayoutChange(layout, layouts) {
    this.saveToLS('layouts', layouts);
    this.setState({ layouts });
  }

  render() {
    let chartList = [
      {
        name: '柱状图',
        type: 'PercentageStackBar',
      },
      {
        name: '曲线图',
        type: 'Line',
      },
    ];
    return (
      <>
        <Header style={headerStyle}>
          {chartList.map(item => (
            <Button
              key={item.type}
              type="primary"
              style={{ marginRight: '7px' }}
              onClick={this.addChart.bind(this, item.type)}
            >
              添加{item.name}
            </Button>
          ))}
        </Header>
        <Content>
          <div style={{ background: '#222e4e', padding: 10, height: '100vh' }}>
            <ResponsiveReactGridLayout
              className="layout"
              {...this.props}
              layouts={this.state.layouts}
              onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
            >
              {this.generateDOM()}
            </ResponsiveReactGridLayout>
          </div>
        </Content>
      </>
    );
  }
}
