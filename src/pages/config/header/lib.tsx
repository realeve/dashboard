import { getLocalConfig } from '@/pages/index/lib';
import { history } from 'umi';
import { api } from '@/utils/setting';
import * as lib from '@/utils/lib';

export const beautyOption = {
  indent_size: 2,
  wrap_line_length: 80,
  jslint_happy: true,
};

export const onPreview = async () => {
  const props = await getLocalConfig();
  if (!props) {
    return;
  }
  history.push('/');
};

// 此处保存完毕后为utf-8格式编码，需要转换为ANSI(结论：暂时无解)
export const saveBat = async (title) => {
  const str = `@echo on
rem move file
copy .\\${title}.* ${api.deployDir}
rem open website
start ${window.location.origin}?id=/data/${title}.json&autoresize=movie
rem remove temp files
del .\\${title}.*
del .\\${title}_deploy.bat
pause`;

  const blob = new Blob([str], { type: 'text/plain;charset=ansi' });
  const { saveAs } = await import('file-saver');
  saveAs(blob, `${title  }_deploy.bat`);
};

export const onCopy = async (title) => {
  const props = await getLocalConfig();
  if (!props) {
    return;
  }

  const { page, panel } = props;

  const dashboard = {
    rec_time: lib.now(),
    panel,
    page: {
      ...page,
      thumbnail: `./${title}.jpg`,
    },
  };

  const { js_beautify: beautify } = await import('js-beautify/js/lib/beautify');
  const { saveAs } = await import('file-saver');

  const json = beautify(JSON.stringify(dashboard), beautyOption);
  const blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${title  }.json`);
};
