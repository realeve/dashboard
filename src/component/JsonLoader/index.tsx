import * as lib from '@/utils/lib';
import { Upload } from 'antd';

export default ({ children, onLoad }: { children: React.ReactNode; onLoad: (e: any) => void }) => (
  <Upload
    showUploadList={false}
    accept=".json"
    style={{ padding: 10 }}
    beforeUpload={(file) => {
      lib.loadDashboard(file).then(onLoad);
      return false;
    }}
  >
    {children}
  </Upload>
);
