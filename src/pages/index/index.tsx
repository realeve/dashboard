import React, { PureComponent } from 'react';
import { Layout, Button } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
import { AChart } from '../chart';
import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;

export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
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
    const option = {
      data: [
        { year: '1951 年', sales: 38 },
        { year: '1952 年', sales: 52 },
        { year: '1956 年', sales: 61 },
        { year: '1957 年', sales: 145 },
        { year: '1958 年', sales: 48 },
      ],
      toolbar: true,
      title: '不同年份销量数据',
      description: '一个简单的图表',
      development: true,
      theme: 'dark',
      height: '100%',
    };
    return _.map(this.state.widgets, (l, i) => {
      return (
        <div key={l.i} data-grid={l}>
          <CloseOutlined className="remove" onClick={this.onRemoveItem.bind(this, i)} />
          <AChart option={option} />
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
    console.log(this.state.widgets);
    this.setState({
      widgets: this.state.widgets.filter((item, index) => index != i),
    });
  }

  onLayoutChange(layout, layouts) {
    this.saveToLS('layouts', layouts);
    this.setState({ layouts });
  }

  render() {
    return (
      <>
        <Header
          style={{
            position: 'fixed',
            background: 'rgb(34,45,77)',
            zIndex: 1,
            bottom: 0,
            width: '100%',
            padding: '0 30px',
          }}
        >
          <Button
            type="primary"
            style={{ marginRight: '7px' }}
            onClick={this.addChart.bind(this, 'bar')}
          >
            添加图表
          </Button>
        </Header>
        <Content>
          <div style={{ background: 'rgb(34,45,77)', padding: 10, height: '100vh' }}>
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
