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

    // 变量名允许下划线
    'no-underscore-dangle': 'off',

    // constructor中允许定义变量
    '@typescript-eslint/no-parameter-properties': 'off',

    // 循环中允许用i++
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // 类型定义，优先用interface
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'no-param-reassign': ['warn', { props: true, ignorePropertyModificationsFor: ['current'] }],

    // 允许  a && b这种形式
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
    ],
    // 'import/newline-after-import': 0,

    // 允许空函数，如catch
    'no-empty': ['error', { allowEmptyCatch: true }],
    'consistent-return': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-invalid-this': 'off',
    'import/newline-after-import': 'off',
  },
};
