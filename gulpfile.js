const del = require('del');
const { src, dest, series, watch } = require('gulp');
const pug = require('gulp-pug');
const addSrc = require('gulp-add-src');
const replace = require('gulp-replace');
const webpack = require('./webpack');
if (process.env.USE_LOCAL_ENV) require('now-env');

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
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
    EXAMPLE_VAR: process.env.EXAMPLE_VAR,
    EXAMPLE_BUILD_VAR: process.env.EXAMPLE_BUILD_VAR,
  },
};
config.isProd = config.env.NODE_ENV === 'production';

//
// Public Tasks
//

exports.default = series(clean, assets, html);

exports.watch = series(clean, startWatch);

function startWatch() {
  const paths = [
    `${config.output}/manifest.json`,
    `${config.source}/**/*.pug`,
  ]
  watch(paths, html);
  webpack(config, 'watch');
}

//
// Build Tasks
//

function clean() {
  return del(config.output);
}

function assets() {
  return webpack(config);
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
