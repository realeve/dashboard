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
    'no-underscore-dangle': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'no-param-reassign': ['error', { props: false, ignorePropertyModificationsFor: ['current'] }],
    // 'import/newline-after-import': 0,
  },
};
