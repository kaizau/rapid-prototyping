const pathlib = require('path');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const autoprefixer = require('autoprefixer-stylus');

// Not a standard webpack.config.js function
module.exports = function runWebpack(config, watch) {
  const webpackConfig = makeWebpackConfig(config);
  if (watch === 'watch') {
    webpackConfig.watch = true;
  }

  return new Promise(function webpackPromise(resolve, reject) {
    webpack(webpackConfig, function webpackCb(error, stats) {
      if (error) reject(error);

      // eslint-disable-next-line no-console
      console.log(stats.toString({
        chunks: false,
        colors: true,
        entrypoints: false,
        modules: false,
      }));

      // Concat commons.js with core.js
      config.manifest = JSON.parse(fs.readFileSync(`./${config.output}/manifest.json`, 'utf8'));
      const commons = pathlib.join(config.output, config.manifest['commons.js']);
      const core = pathlib.join(config.output, config.manifest['core/index.js']);
      const concat = fs.readFileSync(commons) + fs.readFileSync(core);
      fs.writeFileSync(core, concat);

      // Cleanup image entry points and commons.js
      const cleanup = [commons];
      Object.keys(config.manifest).forEach(file => {
        const ext = pathlib.extname(file).slice(1);
        if (config.fileExts.indexOf(ext) > -1) {
          const key = file.slice(0, file.lastIndexOf('.')) + '.js';
          const js = pathlib.join(config.output, config.manifest[key]);
          cleanup.push(js);
        }
      })
      del(cleanup).then(() => resolve());
    });
  });
}

function makeWebpackConfig(config) {
  const cssLoaders = [];

  // css-loader is buggy when handling url() in stylus, so we disable it. Only
  // included because otherwise webpack complains. Instead, use absolute paths,
  // which will get replaced by gulp.
  cssLoaders.push({
    loader: 'css-loader',
    options: { url: false },
  });

  if (config.isProd) {
    cssLoaders.push({
      loader: 'clean-css-loader',
      options: {
        level: {
          1: { specialComments: false },
        },
      },
    });
  }

  cssLoaders.push({
    loader: 'stylus-loader',
    options: {
      'include css': true,
      include: config.source,
      preferPathResolver: 'webpack',
      use: [autoprefixer()],
    },
  });

  const cssInjected = cssLoaders.slice();
  cssInjected.unshift('style-loader');
  const cssExtracted = cssLoaders.slice();
  cssExtracted.unshift(MiniCssExtractPlugin.loader);

  return {
    mode: config.isProd ? 'production' : 'development',
    context: pathlib.join(__dirname, config.source),
    entry() {
      const entries = {};
      const compiled = glob.sync(`${config.source}/**/index.{js,styl,css.styl}`);
      const fileExts = config.fileExts.join(',');
      const copied = glob.sync(`${config.source}/**/*.{${fileExts}}`);
      compiled.concat(copied).forEach(entry => {
        addWebpackEntry(entries, entry);
      });
      return entries;
    },
    output: {
      path: pathlib.join(__dirname, config.output),
      filename: config.isProd ? '[name].[chunkhash:8].js' : '[name].js',
    },
    resolve: {
      alias: {
        // Duplicated to allow stylus to use same alias
        '~shared': pathlib.resolve(__dirname, config.source, '_shared'),
        'shared': pathlib.resolve(__dirname, config.source, '_shared'),
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin(config.env),
      new MiniCssExtractPlugin({
        filename: config.isProd ? '[name].[chunkhash:8].css' : '[name].css',
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
          test: new RegExp(`\\.(${config.fileExts.join('|')})$`),
          loader: 'file-loader',
          options: { name: config.isProd ? '[path][name].[hash:8].[ext]' : '[path][name].[ext]' },
        },
        { test: /(?!\.css).{4}\.styl$/, use: cssInjected },
        { test: /\.css\.styl$/, use: cssExtracted },
      ],
    },
    optimization: {
      // Creates a commons.js that contains:
      // - Shared webpack runtime code
      // - Any module shared between 2 chunks
      //
      // Webpack doesn't allow concat'ing this directly to a single core
      // entry point, so we do it with gulp instead.
      // - https://github.com/webpack/webpack/issues/6977
      runtimeChunk: {
        name: 'commons',
      },
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  function addWebpackEntry(entries, entry) {
    const relative = pathlib.relative(config.source, entry);
    const dir = pathlib.dirname(relative);
    const ext = pathlib.extname(relative);
    const base = pathlib.basename(pathlib.basename(relative, ext), '.css');
    const key = pathlib.join(dir, base);
    entries[key] = entries[key] || [];
    entries[key].push('./' + relative);
  }
}
