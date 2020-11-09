import React, { useEffect, useState } from 'react';

import { connect } from 'dva';
import { axios } from '@/utils/axios';
import DNA from './dna';

const getConfig = async (url) => {
  if (url) {
    let option: { url: string; [key: string]: string } = { url };
    if (['./data/', '/data/'].includes(url.slice(0, 6))) {
      option = {
        ...option,
        baseURL: window.location.origin,
      };
    }
    return axios(option).then((config) => ({ type: 'online', ...config }));
  }
  let { panel, page } = window.localStorage;
  if (!panel || !page) {
    return { type: 'error' };
  }
  return { type: 'local', page, panel };
};

const Index = ({ location }) => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig(null);
    getConfig(location.query.id).then(setConfig);
  }, [location.query.id]);

  return <DNA />;

  return <div>dashboard</div>;
};

export default connect()(Index);
