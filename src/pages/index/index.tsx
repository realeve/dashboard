import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import DNA from './dna';
import styles from './index.less';
import assets from '@/component/widget/assets';
import { getConfig, backgroundStyle } from './lib';
import { GROUP_COMPONENT_KEY } from '@/models/common';
import { ChartItem } from '@/pages/config/canvas/chartItem';

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
  console.log(config);

  return (
    <div
      className={styles.dashboard}
      style={{
        width: `${page.width}px`,
        height: `${page.height}px`,
        backgroundImage: page.background
          ? `url('${assets.backgrounds[page.background].url}')`
          : 'url(/img/panel/panelbg.png)',
        backgroundSize: 'cover',
        ...backgroundStyle,
      }}
    >
      {panel.map(
        (item) =>
          item.key !== GROUP_COMPONENT_KEY && (
            <div
              style={{
                ...item.style,
                transform: `translate(${item?.style?.transform?.translate}) rotate(${item?.style?.transform?.rotate}) scale(${item?.style?.transform?.scale})`,
              }}
              key={item.id}
            >
              <ChartItem config={item} page={page} />
            </div>
          ),
      )}
    </div>
  );
};

export default connect()(Index);
