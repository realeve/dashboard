import React, { useState } from 'react';
import { Button } from 'antd';
import type { IAxiosState } from '@/utils/axios';
import styles from './Report.less';
import { TableOutlined } from '@ant-design/icons';
import { Confirm } from '@/component/Editor/Popup/Popup';

export default ({ data }: { data: IAxiosState }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.report}>
      {show && (
        <Confirm
          title={data.title}
          style={{ width: 1600, maxWidth: 1600, minHeight: 900, height: 900 }}
          onCancel={() => {
            setShow(false);
          }}
          showFooter={false}
        >
          <div style={{ paddingTop: 20 }}>{data.rows}</div>
        </Confirm>
      )}
      <Button
        type="primary"
        icon={<TableOutlined />}
        onClick={() => {
          setShow(true);
        }}
      >
        查看报表
      </Button>
    </div>
  );
};
