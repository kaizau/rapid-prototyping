const { src, dest, series, parallel, watch } = require('gulp');
const named = require('vinyl-named');
const pathlib = require('path');
const stylus = require('gulp-stylus');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const pug = require('gulp-pug');
const del = require('del');

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('now-env');
}

//
// Static Site Compilation
// - Transforms site/* to dist/* with webpack, stylus, pug
// - Using webpack as a simple js bundler, nothing more
//
// TODO
// - data pipeline
// - production
// - consider rolling all compilation into webpack

const assets = parallel(copied, css, js);
const all = series(assets, markup);

function copied() {
  return src(['site/**/*.{jpg,png,gif,svg}', '!site/_shared/**'])
    .pipe(dest('dist/'));
}

function css() {
  return src('site/**/index.styl')
    .pipe(stylus({ include: 'site/' }))
    .pipe(dest('dist/'));
}

function js() {
  return src('site/**/index.js')
    .pipe(named(file => {
      const basename = file.dirname + '/' + file.stem;
      return pathlib.relative(file.base, basename);
    }))
    .pipe(eslint({ fix: true }))
    // TODO Handle babel, process.env replacement, etc in webpack
    .pipe(babel())
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: '[name].js',
      },
    }))
    .pipe(dest('dist/'));
}

function markup() {
  return src(['site/**/*.pug', '!site/_shared/**'])
    .pipe(pug({ basedir: 'site/' }))
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
