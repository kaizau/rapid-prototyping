const { src, dest, series, parallel, watch } = require('gulp');
const named = require('vinyl-named');
const pathlib = require('path');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const pug = require('gulp-pug');
const del = require('del');

// ENV vars passed webpack and pug
if (process.env.USE_LOCAL_ENV) require('now-env');

const env = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  EXAMPLE_BUILD_VAR: process.env.EXAMPLE_BUILD_VAR,
};

//
// Static Site Compilation
// - Transforms site/* to dist/* with webpack, stylus, pug
// - Using webpack as a simple js bundler, nothing more
//
// TODO
// - data pipeline

const assets = parallel(copied, css, js);
const all = series(assets, html);

function copied() {
  return src(['site/**/*.{jpg,png,gif,svg}', '!site/_shared/**'])
    .pipe(dest('dist/'));
}

function css() {
  return src('site/**/index.styl')
    .pipe(stylus({
      include: 'site/',
      'include css': true,
      compress: env.NODE_ENV === 'production',
    }))
    .pipe(autoprefixer())
    .pipe(dest('dist/'));
}

function js() {
  const mode = env.NODE_ENV === 'production' ? 'production' : 'development';
  const filename = env.NODE_ENV === 'production' ? '[name].[chunkhash:8].js' : '[name].js';
  return src('site/**/index.js')
    .pipe(named(file => {
      const basename = file.dirname + '/' + file.stem;
      return pathlib.relative(file.base, basename);
    }))
    .pipe(eslint({ fix: true }))
    .pipe(babel())
    .pipe(webpackStream({
      mode,
      output: { filename },
      plugins: [ new webpack.EnvironmentPlugin(env) ]
    }))
    .pipe(dest('dist/'));
}

function html() {
  return src(['site/**/*.pug', '!site/_shared/**'])
    .pipe(pug({
      basedir: 'site/',
      locals: env
    }))
    .pipe(dest('dist/'));
}

//
// Public Tasks
//

exports.default = series(clean, all);

exports.watch = function watchTask() {
  clean();
  watch('site/**/*', { ignoreInitial: false }, all);
}

//
// Utilities
//

function clean() {
  return del('dist/');
}
