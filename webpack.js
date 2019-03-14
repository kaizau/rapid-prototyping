const pathlib = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = function runWebpack(config, watch) {
  const webpackConfig = makeWebpackConfig(config);
  webpackConfig.watch = watch === 'watch';

  return webpack(webpackConfig, (error, stats) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.log(error); return;
    }
    webpackCallback(config, stats);
  });
}

function webpackCallback(config, stats) {
  // eslint-disable-next-line no-console
  console.log(stats.toString({
    chunks: false,
    colors: true,
    entrypoints: false,
    modules: false,
  }));

  // Load manifest into config for gulp
  const output = pathlib.join(__dirname, config.output);
  const manifest = pathlib.join(output, 'manifest.json');
  config.manifest = JSON.parse(fs.readFileSync(manifest, 'utf8'));

  // Concat commons.js with [config.globalEntry].js
  const commons = pathlib.join(output, config.manifest['commons.js']);
  const core = pathlib.join(output, config.manifest[`${config.coreDir}/${config.entryBase}.js`]);
  const concat = fs.readFileSync(commons) + fs.readFileSync(core);
  fs.writeFileSync(core, concat);

  // Remove commons.js and image entry points from manifest to avoid attempting
  // to replace them in asset URLs.
  //
  // We could delete these files as well, but as of 2019.03.14, this leads to
  // bugs when webpack is running in development watch mode (production seems
  // fine). commons and image.js files are generated initially but not
  // regenerated on watched recompile. Potentially a caching issue?
  delete config.manifest['commons.js']
  Object.keys(config.manifest).forEach(file => {
    const ext = pathlib.extname(file).slice(1);
    if (config.fileExts.indexOf(ext) > -1) {
      const jsFile = file.slice(0, file.lastIndexOf('.')) + '.js';
      delete config.manifest[jsFile];
    }
  });
}

// Not a standard webpack.config.js function
function makeWebpackConfig(config) {
  return {
    mode: config.isProd ? 'production' : 'development',
    context: pathlib.join(__dirname, config.source),
    entry: webpackEntries(config),
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
        {
          test: /(?!\.css).{4}\.styl$/,
          use: ['style-loader', ...sharedStyleLoaders(config)],
        },
        {
          test: /\.css\.styl$/,
          use: [MiniCssExtractPlugin.loader, ...sharedStyleLoaders(config)],
        },
      ],
    },
    optimization: {
      // Creates a commons.js that contains:
      // - Shared webpack runtime code
      // - Any module shared between 2 chunks
      //
      // Webpack doesn't allow concat'ing this directly to a single primary
      // entry point, so we do it with gulp instead.
      // - https://github.com/webpack/webpack/issues/6977
      runtimeChunk: { name: 'commons' },
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
}

function webpackEntries(config) {
  const entries = {};
  const compiled = glob.sync(`${config.source}/**/${config.entryBase}.{js,styl,css.styl}`);
  const fileExts = config.fileExts.join(',');
  const copied = glob.sync(`${config.source}/**/*.{${fileExts}}`);
  compiled.concat(copied).forEach(entry => {
    const relative = pathlib.relative(config.source, entry);
    const dir = pathlib.dirname(relative);
    const ext = pathlib.extname(relative);
    const base = pathlib.basename(pathlib.basename(relative, ext), '.css');
    const key = pathlib.join(dir, base);
    entries[key] = entries[key] || [];
    entries[key].push('./' + relative);
  });
  return entries;
}

function sharedStyleLoaders(config) {
  // css-loader is buggy when handling url() in stylus, so we disable it. Only
  // included because otherwise webpack complains. Instead, use absolute paths,
  // which will get replaced by gulp.
  const cssLoader = {
    loader: 'css-loader',
    options: { url: false },
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [ autoprefixer() ],
    },
  };
  if (config.isProd) {
    postcssLoader.options.plugins.push(cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
      }],
    }));
  }

  const stylusLoader = {
    loader: 'stylus-loader',
    options: {
      'include css': true,
      include: config.source,
      preferPathResolver: 'webpack',
    },
  };

  return [cssLoader, postcssLoader, stylusLoader];
}
