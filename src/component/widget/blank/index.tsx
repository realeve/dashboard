import React, { useState } from 'react';
import styles from './index.less';
import { useToggle } from 'react-use';
import { Modal, Steps } from 'antd';
import { BorderPanel } from './config';
const { Step } = Steps;

export default ({ onChange }) => {
  const [show, setShow] = useToggle(false);
  const [current, setCurrent] = useState(0);
  const [border, setBorder] = useState(null);

  return (
    <div className={styles.mock_guide}>
      <div style={{ marginBottom: 16 }}>
        <img src="/img/no-data.svg" />
      </div>
      <div>暂无数据</div>
      <div className={styles.button} onClick={() => setShow()}>
        初始化
      </div>

      <Modal
        title="配置组件"
        visible={show}
        okText="确认"
        cancelText="取消"
        width="810px"
        onOk={() => {
          setShow(false);
          onChange({
            border,
          });
        }}
        onCancel={() => {
          setShow(false);
        }}
        className={styles.configPanel}
      >
        <Steps
          type="navigation"
          current={current}
          onChange={setCurrent}
          className="site-navigation-steps"
        >
          <Step title="边框样式" />
          <Step title="标题样式" />
          <Step title="图表" />
          <Step title="接口" />
        </Steps>
        <div className={styles.content}>
          {current === 0 && <BorderPanel onChange={setBorder} />}
        </div>
      </Modal>
    </div>
  );
};
