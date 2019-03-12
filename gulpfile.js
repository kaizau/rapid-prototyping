const fs = require('fs');
const del = require('del');
const { src, dest, series, watch } = require('gulp');
const webpack = require('webpack');
const pug = require('gulp-pug');
const addSrc = require('gulp-add-src');
const replace = require('gulp-manifest-replace');
const purgeCss = require('gulp-purgecss');
const cleanCss = require('gulp-clean-css');
const makeWebpackConfig = require('./webpack');
if (process.env.USE_LOCAL_ENV) require('now-env');

//
// Static site + serverless functions
// Powered by Gulp, Webpack, Stylus, Pug, Zeit
//

const config = {
  source: 'site/',
  output: 'dist/',
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
    EXAMPLE_VAR: process.env.EXAMPLE_VAR,
    EXAMPLE_BUILD_VAR: process.env.EXAMPLE_BUILD_VAR,
  },
};
config.isProd = config.env.NODE_ENV === 'production';
const webpackConfig = makeWebpackConfig(config);

//
// Public Tasks
//

exports.default = series(clean, assets, html, optimize);

exports.watch = series(clean, startWatch);

function startWatch() {
  webpackConfig.watch = true;
  watch([
    `${config.output}/manifest.json`,
    `${config.source}/**/*.pug`,
  ], series(html, optimize));
  assets(function noop() {});
}

//
// Build Tasks
//

function clean() {
  return del(config.output);
}

function assets(cb) {
  webpack(webpackConfig, function webpackCb(error, stats) {
    // eslint-disable-next-line no-console
    console.log(stats.toString({ colors: true, modules: false }));
    cb(error);
  });
}

function html() {
  let task = src([`${config.source}/**/*.pug`, `!${config.source}/_shared/**`])
    .pipe(pug({
      basedir: config.source,
      locals: config.env,
    }));

  if (config.isProd) {
    // Rewrite hashed asset paths. Also rewrites for webpack output due to
    // css-loader url() bug.
    const manifest = JSON.parse(fs.readFileSync(`./${config.output}/manifest.json`, 'utf8'));
    task = task.pipe(addSrc(`${config.output}/**/*.{css,js}`))
      .pipe(replace({ manifest }));
  }

  return task.pipe(dest(config.output));
}

function optimize(cb) {
  if (!config.isProd) {
    cb(); return;
  }

  return src(`${config.output}/**/*.css`)
    .pipe(purgeCss({ content: [`${config.output}/**/*.html`] }))
    .pipe(cleanCss({
      level: {
        1: { specialComments: false },
      },
    }))
    .pipe(dest(config.output));
}
