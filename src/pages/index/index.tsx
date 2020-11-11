import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import DNA from './dna';
import styles from './index.less';
import { getConfig, getStyle, getAutoSizeStyle, getBackground } from './lib';
import { GROUP_COMPONENT_KEY } from '@/models/common';
import { ChartItem } from '@/pages/config/canvas/chartItem';

// DEMO:  http://localhost:8000/?id=/data/01.json&autoresize=1
const Index = ({ location }) => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig(null);
    getConfig(location.query.id).then(setConfig);
  }, [location.query.id]);
  if (!config) {
    return <DNA />;
  }
  let { page, panel } = config,
    autoSize = location?.query?.autoresize == '1';
  return (
    <div className={styles.dashboard} style={getBackground(page)}>
      <div style={getAutoSizeStyle(page, autoSize)}>
        {panel.map(
          (item) =>
            item.key !== GROUP_COMPONENT_KEY && (
              <div style={getStyle({ style: item.style, autoSize, page })} key={item.id}>
                <ChartItem config={item} page={page} />
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default connect()(Index);
