import React, { PureComponent } from 'react';
import { Layout, Button } from 'antd';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
import { AChart } from '@/component/chart/g2chart';
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
    const data = [
      {
        year: '1991',
        value: 31,
      },
      {
        year: '1992',
        value: 41,
      },
      {
        year: '1993',
        value: 35,
      },
      {
        year: '1994',
        value: 55,
      },
      {
        year: '1995',
        value: 49,
      },
      {
        year: '1996',
        value: 15,
      },
      {
        year: '1997',
        value: 17,
      },
      {
        year: '1998',
        value: 29,
      },
      {
        year: '1999',
        value: 33,
      },
    ];

    const option = {
      title: {
        visible: true,
        text: '某图表',
      },
      description: {
        visible: true,
        text: '某图表',
      },
      data,
      xField: 'year',
      yField: 'value',
      type: 'Column',
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
            background: '#222e4e',
            zIndex: 1,
            bottom: 0,
            width: '100%',
            padding: '0 20px',
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
