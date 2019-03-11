const fs = require('fs');
const pathlib = require('path');
const { src, dest, series, parallel, watch } = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const named = require('vinyl-named');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const ManifestPlugin = require('webpack-manifest-plugin');
const pug = require('gulp-pug');
const replace = require('gulp-manifest-replace');
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
  const isProd = env.NODE_ENV === 'production';
  const mode = isProd ? 'production' : 'development';
  const filename = isProd ? '[name].[chunkhash:8].js' : '[name].js';
  const plugins = [
    new ManifestPlugin(),
    new webpack.EnvironmentPlugin(env),
  ];
  const webpackConfig = { mode, plugins, output: { filename } };

  return src('site/**/index.js')
    .pipe(named(file => {
      const basename = file.dirname + '/' + file.stem;
      return pathlib.relative(file.base, basename);
    }))
    .pipe(eslint({ fix: true }))
    .pipe(babel())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(dest('dist/'));
}

function html() {
  const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));
  return src(['site/**/*.pug', '!site/_shared/**'])
    .pipe(pug({
      basedir: 'site/',
      locals: env
    }))
    .pipe(replace({ manifest }))
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
