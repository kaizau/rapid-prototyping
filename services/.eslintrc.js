// https://github.com/airbnb/javascript
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  env: {
    browser: false,
    node: true,
    es6: true
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {"devDependencies": ["services/**/*.js"]}
    ],
    "import/prefer-default-export": "off"
  }
};
