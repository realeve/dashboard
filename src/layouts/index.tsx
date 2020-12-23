import { Layout } from 'antd';

// import FPSStats from '@/component/Stats';

//  top: -4, transform: `scale(0.8)`
export default (props) => {
  return (
    <Layout>
      {/* {process.env.NODE_ENV === 'development' && <FPSStats style={{ left: 210 }} />} */}
      {props.children}
    </Layout>
  );
};
