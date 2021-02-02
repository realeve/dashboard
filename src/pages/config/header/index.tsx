import styles from './index.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import type { IHideProps, TFnHide } from '../panel/setting';
import qs from 'querystring';
// import pinyin from '@/utils/pinyin';
import type { FnOnLoadConfig } from './Actions';
import Actions from './Actions';

export default ({
  setHide,
  hide,
  author = '未知作者',
  ...props
}: {
  hide: IHideProps;
  setHide: TFnHide;
  title: string;
  author: string;
  getThumbnail: (scale: number, filename: string | null) => Promise<string | void>;
  onLoadConfig: FnOnLoadConfig;
}) => {
  const query: { file?: string; id?: string } = qs.parse(window.location.search.slice(1));
  const fileTitle = query.file
    ? query.file.replace('.json', '').split('/').slice(-1)[0]
    : props.title; // pinyin.toPinYinFull(props.title);

  return (
    <div className={styles.header}>
      <div className={styles['datav-edit-header']}>
        <div className={styles['editor-header-wp']}>
          <div className={styles['editor-config']}>
            <Tooltip title="图层" placement="bottom">
              <div
                className={classnames(styles['header-button'], {
                  [styles.selected]: !hide.layer,
                })}
                onClick={() => {
                  setHide({ layer: !hide.layer });
                }}
              >
                <i className="datav-icon datav-font icon-layer header-button-icon" />
              </div>
            </Tooltip>

            <Tooltip title="组件" placement="bottom">
              <div
                className={classnames(
                  styles['header-button'],
                  {
                    [styles.selected]: !hide.components,
                  },
                  'component-list-btn',
                )}
                onClick={() => {
                  setHide({ components: !hide.components });
                }}
              >
                <i className="datav-icon datav-font icon-component-list header-button-icon" />
              </div>
            </Tooltip>

            <Tooltip title="设置" placement="bottom">
              <div
                className={classnames(styles['header-button'], {
                  [styles.selected]: !hide.config,
                })}
                onClick={() => {
                  setHide({ config: !hide.config });
                }}
              >
                <i className="datav-icon datav-font icon-right-panel header-button-icon" />
              </div>
            </Tooltip>

            <Tooltip title="工具" placement="bottom">
              <div
                className={classnames(styles['header-button'], {
                  [styles.selected]: !hide.toolbox,
                })}
                onClick={() => {
                  setHide({ toolbox: !hide.toolbox });
                }}
              >
                <i className="datav-icon datav-font icon-tool header-button-icon" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className={styles['screen-info']}>
          <i
            className={classnames('datav-icon datav-font icon-workspace', styles['workspace-icon'])}
          />
          <span className="v-md">
            {props.title}-({author})
          </span>
        </div>
        <Actions fileTitle={fileTitle} isEditMode={typeof query.file === 'string'} {...props} />
      </div>
    </div>
  );
};
