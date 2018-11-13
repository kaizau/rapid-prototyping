// https://github.com/airbnb/javascript
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: "airbnb-base",
  env: {
    browser: true,
    es6: true
  },
  rules: {
    "arrow-body-style": "off",
    "camelcase": "off",
    "prefer-destructuring": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {"devDependencies": ["services/**/*.js"]}
    ]
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["source"]
      }
    }
  }
};
