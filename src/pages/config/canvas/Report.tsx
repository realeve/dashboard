import React, { useState } from 'react';
import { Button } from 'antd';
import type { IAxiosState } from '@/utils/axios';
import styles from './Report.less';
import { TableOutlined } from '@ant-design/icons';
import { Confirm } from '@/component/Editor/Popup/Popup';
import HandsonTable from '@/component/HandsonTable';
import { json2Array } from '@/utils/lib';

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
          <div style={{ paddingTop: 20 }}>
            <HandsonTable
              style={{ width: '100%', height: '100%' }}
              data={json2Array(data)}
              sheetHeight={800}
              params={{
                mergev: '0',
                merge: '0-1',
                mergetext: '合并两列',
              }}
            />
          </div>
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
