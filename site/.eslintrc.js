// https://eslint.org/docs/user-guide/configuring

module.exports = {
  env: {
    browser: true,
    node: false,
  },
  globals: {
    // For ENV var replacement
    process: 'readonly',
  },
};
