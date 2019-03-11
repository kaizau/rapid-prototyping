const { src, dest, series, parallel, watch } = require('gulp');
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
// - Transforms site/* to dist/* with babel, stylus, pug
//
// TODO
// - data pipeline
// - production

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
    .pipe(eslint({ fix: true }))
    .pipe(babel())
    .pipe(webpack({
      mode: 'development'
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
