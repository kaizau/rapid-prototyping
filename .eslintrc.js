// https://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: "eslint:recommended",
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "comma-dangle": ["warn", "only-multiline"],
    "indent": ["warn", 2],
    "linebreak-style": ["warn", "unix"],
    "no-console": "warn",
    "no-duplicate-imports": "warn",
    "no-trailing-spaces": "warn",
    "no-var": "warn",
    "no-unused-vars": "warn",
    "space-before-function-paren": ["warn", "never"],
  },
};
