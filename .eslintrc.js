// https://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: "eslint:recommended",
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    "comma-dangle": ["warn", "only-multiline"],
    "indent": ["warn", 2],
    "linebreak-style": ["warn", "unix"],
    "no-trailing-spaces": "warn",
    "space-before-function-paren": ["warn", "never"],
  }
};
