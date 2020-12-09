import React from 'react';
import { Layout } from 'antd';
import './index.less';
import FPSStats from '@/component/Stats';

export default (props) => {
  return (
    <Layout>
      {process.env.NODE_ENV === 'development' && <FPSStats style={{ left: 210, top: -4 }} />}
      {props.children}
    </Layout>
  );
};
