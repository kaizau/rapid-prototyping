const fs = require('fs');
const pathlib = require('path');
const { src, dest, series, parallel, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const named = require('vinyl-named');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const pug = require('gulp-pug');
const replace = require('gulp-manifest-replace');
const del = require('del');

// ENV vars passed to webpack and pug
if (process.env.USE_LOCAL_ENV) require('now-env');

const env = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  EXAMPLE_BUILD_VAR: process.env.EXAMPLE_BUILD_VAR,
};

//
// Transforms site/* to dist/* with webpack, stylus, pug
//

function assets() {
  const isProd = env.NODE_ENV === 'production';
  const stylusConfig = {
    loader: 'stylus-loader',
    options: { 'include css': true, include: 'site/' },
  };
  const webpackConfig = {
    mode: isProd ? 'production' : 'development',
    output: { filename: isProd ? '[name].[chunkhash:8].js' : '[name].js' },
    plugins: [
      new webpack.EnvironmentPlugin(env),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[chunkhash:8].css' : '[name].css',
      }),
      new ManifestPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(jpg|png|gif|svg)$/,
          use: ['file-loader'],
        },
        {
          test: /(?!\.css).{4}\.styl$/,
          use: ['style-loader', 'css-loader', stylusConfig],
        },
        {
          test: /\.css\.styl$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', stylusConfig],
        },
      ],
    },
  };

  return src(['site/**/index.{js,styl,css.styl}', 'site/**/*.{jpg,png,gif,svg}'])
    .pipe(named(file => {
      const basename = file.dirname + '/' + file.stem;
      const relative = pathlib.relative(file.base, basename);
      return relative.slice(-4) === '.css' ? relative.slice(0, -4) : relative;
    }))
    // .pipe(eslint({ fix: true }))
    // .pipe(babel())
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

const compile = series(clean, assets, html)

exports.default = compile;

exports.watch = function watchTask() {
  watch('site/**/*', { ignoreInitial: false }, compile);
}

//
// Utilities
//

function clean() {
  return del('dist/');
}
