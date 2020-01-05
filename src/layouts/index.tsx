import React from 'react';
import { Layout } from 'antd';
import './index.less';
export default props => {
  return <Layout>{props.children}</Layout>;
};
