import { getLocalConfig } from '@/pages/index/lib';
import { router } from 'umi';
import { api } from '@/utils/setting';

import * as lib from '@/utils/lib';
import beautify from 'js-beautify';

import { saveAs } from 'file-saver';

export const beautyOption = {
  indent_size: 2,
  wrap_line_length: 80,
  jslint_happy: true,
};

export const onPreview = async () => {
  let props = await getLocalConfig();
  if (!props) {
    return;
  }
  router.push('/');
};

// 此处保存完毕后为utf-8格式编码，需要转换为ANSI(结论：暂时无解)
export const saveBat = (title) => {
  let str = `@echo on
rem move file
copy .\\${title}.* ${api.deployDir}
rem open website
start ${window.location.origin}?id=/data/${title}.json&autoresize=movie
rem remove temp files
del .\\${title}.*
del .\\${title}_deploy.bat
pause`;

  let blob = new Blob([str], { type: 'text/plain;charset=ansi' });
  saveAs(blob, title + '_deploy.bat');
};

export const onCopy = async (title) => {
  let props = await getLocalConfig();
  if (!props) {
    return;
  }

  let { page, panel } = props;

  let dashboard = {
    rec_time: lib.now(),
    panel,
    page: {
      ...page,
      thumbnail: `./${title}.jpg`,
    },
  };

  let json = beautify(JSON.stringify(dashboard), beautyOption);
  let blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, title + '.json');
};
