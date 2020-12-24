import { Layout } from 'antd';

export default (props) => {
  return (
    <Layout>
      {/* {process.env.NODE_ENV === 'development' && <FPSStats style={{ left: 210 }} />} */}
      {props.children}
    </Layout>
  );
};
