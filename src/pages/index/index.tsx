import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import DNA from './dna';
import styles from './index.less';

import { getConfig, getStyle } from './lib';
import { GROUP_COMPONENT_KEY } from '@/models/common';
import { ChartItem } from '@/pages/config/canvas/chartItem';
import { getDashboardStyle } from '@/component/Editor/Editor';

const Index = ({ location }) => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig(null);
    getConfig(location.query.id).then(setConfig);
  }, [location.query.id]);

  if (!config) {
    return <DNA />;
  }
  let { page, panel } = config;

  return (
    <div className={styles.dashboard} style={getDashboardStyle(page)}>
      {panel.map(
        (item) =>
          item.key !== GROUP_COMPONENT_KEY && (
            <div style={getStyle({ style: item.style, page })} key={item.id}>
              <ChartItem config={item} page={page} />
            </div>
          ),
      )}
    </div>
  );
};

export default connect()(Index);
