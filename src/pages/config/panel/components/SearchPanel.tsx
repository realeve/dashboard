import styles from './index.less';
import classnames from 'classnames';

export interface ISearchState {
  category: string; //类目
  title: string; //标题
  image: string; //缩略图
  key: string;
  panel: any; //配置项
  title_simple: string; // 拼音简写
  title_full: string; //拼音全称
}

export default ({ data, onAdd }: { data: ISearchState[]; onAdd: (e) => void }) => {
  return (
    <div className={styles.searchResult}>
      <ul>
        {data.map((item) => (
          <li
            key={item.key}
            onClick={() => {
              onAdd?.(item.panel);
            }}
          >
            <p className={classnames(styles['components-from-text'], styles.ellipsis)}>
              {item.category}
            </p>
            <div className={styles['flex-wp']}>
              <div
                className={styles['components-item-img']}
                style={{
                  backgroundImage: `url('${item.image}')`,
                }}
              />
              <div className={styles['components-info']}>
                <p className={styles.line2}>{item.title}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
