import { axios } from '@/utils/axios';
export const getConfig = async (url) => {
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
  return { type: 'local', page: JSON.parse(page), panel: JSON.parse(panel) };
};

export const backgroundStyle = { backgroundRepeat: 'no-repeat', backgroundPosition: 'top center' };
