const {src, dest, series, watch} = require('gulp');
const connect = require('gulp-connect');
const fs = require('fs-extra');
const glob = require('glob');
const pathlib = require('path');
const notifier = require('node-notifier');
const pug = require('gulp-pug');
const addSrc = require('gulp-add-src');
const replace = require('gulp-replace');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const {webpackConfig, webpackCallback} = require('./webpack');

//
// Static site + serverless functions
// Powered by Gulp, Webpack, Stylus, Pug, Zeit
//

const config = {
  source: 'site',
  output: 'dist',
  entryBase: 'bundle',
  fileExts: ['png', 'jpg', 'gif', 'svg'],
  isProd: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
};

//
// Public
//

exports.build = series(clean, assets, html, finalize);

exports.watch = series(clean, devServer);

exports.now = exports.build;

//
// Watch
//

function devServer(cb) {
  connect.server({
    port: process.env.PORT || 8888
  });

  // Rebuild markup
  const markupFiles = [
    `${config.output}/webpack.json`,
    `${config.source}/**/*.pug`,
  ];
  watch(markupFiles, html);

  // Lint and format JS
  const jsFiles = ['**/*.js', '!dist/**', '!node_modules/**'];
  watch(jsFiles)
    .on('add', file => lint(file))
    .on('change', file => lint(file));

  // Compile webpack assets
  const watchWebpack = webpackConfig(config);
  watchWebpack.watch = true;
  webpack(watchWebpack, (error, stats) => {
    webpackCallback(error, stats, config);
  });

  // Restart if webpack entries changed
  const webpackEntries = [
    `${config.source}/**/${config.entryBase}.{js,styl,css.styl}`,
  ];
  watch(webpackEntries)
    .on('add', file => restart(`Webpack entry ${file} was added.`))
    .on('unlink', file => restart(`Webpack entry ${file} was removed.`));

  // Restart if config changed
  const configFiles = [
    'gulpfile.js',
    'webpack.js',
    'package-lock.json',
    '.env.build',
  ];
  watch(configFiles)
    .on('change', file => restart(`${file} was changed.`));

  cb();
}

function lint(file) {
  return src(file)
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(dest(pathlib.dirname(file)));
}

function restart(reason) {
  const message = 'Restart needed. ' + reason;
  // eslint-disable-next-line no-console
  console.log(message);
  notifier.notify({
    message,
    title: 'Gulp',
  });
  process.exit();
}

//
// Build
//

function clean() {
  return fs.emptyDir(config.output);
}

function assets(cb) {
  webpack(webpackConfig(config), (error, stats) => {
    webpackCallback(error, stats, config);
    cb();
  });
}

function html() {
  let task = src([`${config.source}/**/*.pug`, `!${config.source}/_shared/**`])
    .pipe(pug({
      basedir: config.source,
      locals: process.env,
    }));

  if (config.isProd) {
    // Rewrite asset paths in .html, .css, and .js
    task = task.pipe(addSrc(`${config.output}/**/*.{css,js}`));
    Object.keys(config.manifest).forEach(function rewriteAssetPath(key) {
      const value = config.manifest[key];
      task = task.pipe(replace(key, value));
    });
  }

  return task.pipe(dest(config.output));
}

function finalize() {
  const commons = glob.sync(`${config.output}/commons.*js`)[0];
  return Promise.all([
    fs.remove(commons),
    fs.remove(`${config.output}/webpack.json`),
    fs.remove(`${config.output}/_shared/`),
  ]);
}
