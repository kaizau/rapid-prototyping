const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();

// TODO Investigate controlling now-lambda-runner from here
module.exports = (config, callback) => {
  const siteURL = `http://${config.hostname}:${config.port}/`;
  const apiURL = `http://${config.hostname}:${config.port + 1}/api/`;

  app.use(express.static(path.join(__dirname, config.path)));

  app.all('/api/*', proxy(apiURL, {
    proxyErrorHandler: (err, res) => {
      return res.send('ERROR: Restart dev API with `npm run dev-api`');
    },
  }));

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`
           ${siteURL} serving from ./${config.path}
           ${siteURL}api/(.*) proxying to ${apiURL}$1
`);
    callback();
  });

  return app;
};
