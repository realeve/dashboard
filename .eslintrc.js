module.exports = {
  extends: [
    'eslint-config-umi',
    'plugin:react-hooks/recommended',
    require.resolve('@umijs/fabric/dist/eslint'),
  ],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
