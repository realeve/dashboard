import React from 'react';
import styles from './index.less';
import beautify from 'js-beautify';

const beautyOption = {
  indent_size: 2,
  wrap_line_length: 80,
  jslint_happy: true,
};

export default ({ value, onChange }) => {
  return (
    <div className={styles.jsonwrapper}>
      <div className={styles.title}>(在下方粘贴模拟数据)</div>
      <textarea
        className={styles.json}
        value={beautify(value, beautyOption)}
        onChange={e => onChange && onChange(e.target.value.replace(/\n/g, ''))}
      />
    </div>
  );
};

// useEffect(() => {
//   update();
//   monaco.editor.setTheme('vs-dark');
// }, []);

// useEffect(() => {
//   update();
// }, [json]);

// const update = () => {
//   if (!editor?.current) return;
//   monaco.editor.create(editor.current, {
//     value: beautify(json, beautyOption),
//     language: 'json',
//   });
// };
