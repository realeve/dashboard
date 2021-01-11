import React, { useState } from 'react';
import styles from './index.less';
import { useToggle } from 'react-use';
import { Modal, Steps } from 'antd';
import { AssetItem } from './config';
import backgrounds from '@/component/widget/assets/backgrounds';

const { Step } = Steps;

export default ({ onChange, config }) => {
  const [show, setShow] = useToggle(false);
  const [current, setCurrent] = useState(0);
  const [border] = useState(config.border || null);
  const [background, setBackground] = useState(config.background || null);
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
            background,
            header: config.header || null,
            footer: config.footer || null,
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
          size="small"
        >
          <Step title="背景" />
          <Step title="边框样式" />
          <Step title="头部样式" />
          <Step title="底部样式" />
          <Step title="标题样式" />
          <Step title="图表" />
          <Step title="接口" />
        </Steps>
        <div className={styles.content}>
          {current === 0 && (
            <AssetItem assets={backgrounds} value={background} onChange={setBackground} />
          )}
          {/* {current === 1 && <AssetItem assetKey="borders" value={border} onChange={setBorder} />}
          {current === 2 && <AssetItem assetKey="headers" value={header} onChange={setHeader} />}
          {current === 3 && <AssetItem assetKey="footers" value={footer} onChange={setFooter} />} */}
        </div>
      </Modal>
    </div>
  );
};
