// module.exports = {
// extends: [
// 'eslint-config-umi',
// 'plugin:react-hooks/recommended',
// require.resolve('@umijs/fabric/dist/eslint'),
// ],
// plugins: ['react-hooks'],
// rules: {
//   'react-hooks/rules-of-hooks': 'error',
//   'react-hooks/exhaustive-deps': 'warn',
// },
// };

// 0 = off, 1 = warn, 2 = error
module.exports = {
  plugins: ['react-hooks'],
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    eqeqeq: 'warn',
    // 'no-plusplus': 0,
    // 'import/newline-after-import': 0,
  },
};
