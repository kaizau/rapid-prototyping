const fs = require('fs');
const pathlib = require('path');
const glob = require('glob');
const { src, dest, series, watch } = require('gulp');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const pug = require('gulp-pug');
const addSrc = require('gulp-add-src');
const replace = require('gulp-manifest-replace');
const del = require('del');

// ENV vars passed to webpack and pug
if (process.env.USE_LOCAL_ENV) require('now-env');

const env = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  EXAMPLE_VAR: process.env.EXAMPLE_VAR,
  EXAMPLE_BUILD_VAR: process.env.EXAMPLE_BUILD_VAR,
};

//
// Transforms site/* to dist/* with webpack, stylus, pug
//

function assets(cb, watch) {
  const isProd = env.NODE_ENV === 'production';
  const stylusLoader = {
    loader: 'stylus-loader',
    options: { 'include css': true, include: 'site/' },
  };
  // css-loader is buggy when handling url() in stylus, so we disable it. Only
  // included because otherwise webpack complains. Instead, use absolute paths,
  // which will get replaced by gulp.
  const cssLoader = {
    loader: 'css-loader',
    options: { url: false },
  };
  const webpackConfig = {
    mode: isProd ? 'production' : 'development',
    watch: watch === 'watch',
    context: pathlib.join(__dirname, 'site/'),
    entry() {
      const entries = {};
      glob.sync('site/**/index.{js,styl,css.styl}').forEach(entry => {
        createWebpackEntry(entries, entry);
      });
      glob.sync('site/**/*.{png,jpg,gif,svg}').forEach(entry => {
        createWebpackEntry(entries, entry);
      });
      return entries;
    },
    output: {
      path: pathlib.join(__dirname, 'dist'),
      filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
    },
    resolve: {
      alias: {
        // Duplicated to allow stylus to use same alias
        '~shared': pathlib.resolve(__dirname, 'site', '_shared'),
        'shared': pathlib.resolve(__dirname, 'site', '_shared'),
      },
    },
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
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: { name: isProd ? '[path][name].[hash:8].[ext]' : '[path][name].[ext]' },
        },
        {
          test: /(?!\.css).{4}\.styl$/,
          use: ['style-loader', cssLoader, stylusLoader],
        },
        {
          test: /\.css\.styl$/,
          use: [MiniCssExtractPlugin.loader, cssLoader, stylusLoader],
        },
      ],
    },
  };

  webpack(webpackConfig, function webpackCb(error, stats) {
    console.log(stats.toString({ colors: true, modules: false }));
    cb(error);
  });
}

function html() {
  const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));
  return src(['site/**/*.pug', '!site/_shared/**'])
    .pipe(pug({
      basedir: 'site/',
      locals: env
    }))
    .pipe(addSrc('dist/**/*.{css,js}')) // Also rewrite Webpack output
    .pipe(replace({ manifest }))
    .pipe(dest('dist/'));
}

//
// Public Tasks
//

exports.default = series(clean, assets, html);

exports.watch = series(clean, activateWatch);

//
// Utilities
//

function clean() {
  return del('dist/');
}

function activateWatch() {
  watch('dist/manifest.json', html);
  watch('site/**/*.pug', html);
  assets(function noop() {}, 'watch');
}

function createWebpackEntry(entries, entry) {
  const relative = pathlib.relative('site/', entry);
  const dir = pathlib.dirname(relative);
  const ext = pathlib.extname(relative);
  const base = pathlib.basename(pathlib.basename(relative, ext), '.css');
  const key = pathlib.join(dir, base);
  entries[key] = entries[key] || [];
  entries[key].push('./' + relative);
}
