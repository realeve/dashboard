import React, { useState, Suspense } from 'react';
import { Button, Spin } from 'antd';
import type { IAxiosState } from '@/utils/axios';
import styles from './Report.less';
import { TableOutlined, DownloadOutlined } from '@ant-design/icons';
import { Confirm } from '@/component/Editor/Popup/Popup';
// import HandsonTable from '@/component/HandsonTable';
import { json2Array } from '@/utils/lib';
import qs from 'qs';
import { AUTHOR } from '@/utils/setting';
import { mergeConfig } from '@/component/HandsonTable/excelConfig';

const HandsonTable = React.lazy(() => import('@/component/HandsonTable'));

/**
 * 导出xls文件
 * @param param 表头合并
 * @param data 原始数据
 */
const exportXls = ({
  param,
  data,
}: {
  param: { merge?: string; mergetext?: string; mergev?: string; mergesize?: number };
  data: IAxiosState;
}) => {
  const tableData = json2Array(data);
  // 将外部数据接口中的merge配置信息注入替换
  const columns = mergeConfig(
    data.header.map((title, idx) => ({ title, dataIndex: `col${idx}` })),
    param,
  );

  const excelConfig = {
    columns,
    creator: AUTHOR,
    source: data.source,
    filename: data.title.trim(),
    header: data.header,
    body: tableData.data,
    params: param,
    extra: '',
  };

  import('../../../component/HandsonTable/exceljs').then(({ save }) => {
    save(excelConfig);
  });
};

export default ({
  data: { data, param },
}: {
  data: { data: IAxiosState; param: { reportParam?: string; showReport?: boolean } };
}) => {
  const [show, setShow] = useState(false);
  const tableData = React.useMemo(() => json2Array(data), [data.hash]);
  return (
    <div className={styles.report}>
      {show && (
        <Confirm
          title={
            <div>
              {data.title}
              <Button
                icon={<DownloadOutlined />}
                size="small"
                style={{ marginLeft: 10 }}
                onClick={() => exportXls({ param: qs.parse(param.reportParam), data })}
              >
                下载
              </Button>
            </div>
          }
          style={{ width: 1600, maxWidth: 1600, minHeight: 900, height: 900 }}
          onCancel={() => {
            setShow(false);
          }}
          showFooter={false}
        >
          <Suspense fallback={<Spin spinning />}>
            <div style={{ paddingTop: 20 }}>
              <HandsonTable
                style={{ width: '100%', height: '100%' }}
                data={tableData}
                sheetHeight={800}
                params={qs.parse(param.reportParam || '')}
              />
            </div>
          </Suspense>
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
