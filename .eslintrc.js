// 0 = off, 1 = warn, 2 = error
module.exports = {
  plugins: ['react-hooks'],
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    // hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ===
    eqeqeq: 'warn',

    // 变量名允许下划线
    'no-underscore-dangle': 'off',

    // constructor中允许定义变量
    '@typescript-eslint/no-parameter-properties': 'off',

    // 循环中允许用i++
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // 类型定义，优先用interface
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    // 导入时优先使用type 代替interface
    '@typescript-eslint/consistent-type-imports': 'off',

    'no-param-reassign': ['off', { props: true, ignorePropertyModificationsFor: ['current'] }],

    // 允许  a && b这种形式
    // https://cloud.tencent.com/developer/section/1135777
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
    ],

    // 允许空函数，如catch
    'no-empty': ['error', { allowEmptyCatch: true }],

    // 必须返回内容，在clean effect时无法允许
    // https://cloud.tencent.com/developer/section/1135600
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],

    // 允许使用this
    '@typescript-eslint/no-invalid-this': 'off',

    // import后换行
    'import/newline-after-import': 'off',

    // 允许使用 console
    'no-console': 'off',

    // 允许使用匿名函数，调试时可能不便
    'func-names': ['warn', 'as-needed'],

    // ts 中允许使用this
    '@typescript-eslint/no-this-alias': 'off',

    // 允许使用 a = b =2
    'no-multi-assign': 'off',

    // 允许 {} 替代 Record<string,any>
    'ban-types': 'off',

    // 允许 interface中内容为空
    '@typescript-eslint/no-empty-interface': 'off',

    // 优先使用解析，在部分场景如 var foo ='bar'; foo = baz[0]时会报错误
    'prefer-destructuring': 'off',

    'func-names': 'off',
  },
};

// 1.禁用代码块

// /* eslint-disable */
// consle.log("foo");
// consle.log("bar");
// /* eslint-disable */
// 2.禁用单行(放在该行代码后面)

// consle.log("foo"); // eslint-disable-line
// 3.禁用下一行

// // eslint-disable-next-line
// console.log("foo")
// 4.禁用文件(放在代码最顶部)

// /* eslint-disable */
// consle.log("foo");
// consle.log("bar");
