const del = require('del');
const { src, dest, series, watch } = require('gulp');
const pug = require('gulp-pug');
const addSrc = require('gulp-add-src');
const replace = require('gulp-replace');
const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const {webpackConfig, webpackCallback} = require('./webpack');
const nowConfig = require('./now.json');
if (process.env.USE_DOTENV) require('dotenv').config();

//
// Static site + serverless functions
// Powered by Gulp, Webpack, Stylus, Pug, Zeit
//

const config = {
  source: 'site',
  output: 'dist',
  coreDir: 'core',
  entryBase: 'bundle',
  fileExts: ['png', 'jpg', 'gif', 'svg'],
  env: { NODE_ENV: process.env.NODE_ENV || 'production' },
};
config.isProd = config.env.NODE_ENV === 'production';
Object.keys(nowConfig.build.env)
  .forEach(key => config.env[key] = process.env[key]);

//
// Public Tasks
//

exports.default = series(clean, assets, html);

exports.watch = series(clean, devServer);

//
// Dev Server
//

function devServer(cb) {
  connect.server({
    root: config.output,
    port: 8888,
    livereload: !config.isProd,
    middleware() {
      return [
        proxy('/api', { target: 'http://localhost:8889' }),
      ];
    },
  });

  const paths = [
    `${config.output}/manifest.json`,
    `${config.source}/**/*.pug`,
  ];
  watch(paths, series(html, reload));

  const webpackWatch = webpackConfig(config);
  webpackWatch.watch = true;
  webpack(webpackWatch, (error, stats) => {
    webpackCallback(error, stats, config);
  });

  cb();
}

function reload() {
  return src('gulpfile.js', { read: false })
    .pipe(connect.reload());
}

//
// Build Tasks
//

function clean() {
  return del(config.output);
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
      locals: config.env,
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
