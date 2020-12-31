import styles from './index.less';
import LeftSide from './LeftSide';
import RightSide from './RightSide';

import { api } from '@/utils/setting';
import useFetch from '@/component/hooks/useFetch';
import DNA from '@/pages/index/dna';

export interface IScreenItem {
  file: string;
  id: number;
  img: string;
  rec_time: string;
  title: string;
  publish?: number;
  group_name?: string;
}
const List = () => {
  const { data, loading, error, reFetch } = useFetch<{ data: IScreenItem[] }>({
    param: {
      url: api.getDashboardList,
      params: { cache: 0 },
    },
  });

  if (error) {
    return <DNA title={`大屏列表加载失败，请刷新重试或联系管理员!`} />;
  }

  return (
    <div className={styles.list}>
      <div className={styles.navMain}>
        <div className={styles.headerImg}>
          <img className={styles['nav-img-text']} src="/img/list/logo.png" />
          <div
            className={styles['nav-img']}
            style={{ backgroundImage: `url("/img/list/header.png.webp")` }}
          />
        </div>
      </div>
      <div className={styles.navShadow} />
      <div className={styles.project}>
        {loading || !data ? (
          <DNA />
        ) : (
          <>
            <LeftSide data={data.data} />
            <RightSide data={data.data} onRefresh={reFetch} />
          </>
        )}
      </div>
    </div>
  );
};

export default List;
