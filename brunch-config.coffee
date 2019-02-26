#
# http://brunch.io/docs/config.html
#

require('dotenv/config')
cjs = require('commonjs-require-definition') # included with brunch

# Used by custom brunch-config/* helpers
exports.customPaths =
  input: 'site/source/'
  output: 'publish/site/'
  assetPrefix: 'assets/'

exports.paths =
  watched: ['site/source/', 'site/static/']
  public: 'publish/site/'

exports.conventions =
  ignored: /\/_(?!.+\.js)/
  assets: /site\/static\//

# Imports all site/source/*/index.{js,styl} as entry points
exports.files = require('./site/config/entry-points')(exports)

exports.modules =
  definition: (file) ->
    if file.indexOf('global.js') > -1 then cjs else ''
  nameCleaner: (file) ->
    file.replace('site/source/', '')

# Makes every module self-executing
exports.modules.autoRequire = require('./site/config/auto-require')(exports)

exports.plugins =
  cleancss:
    keepSpecialComments: 0
    removeEmpty: true
  static:
    processors: [
      require('html-brunch-static')(
        processors: [
          require('pug-brunch-static')(
            pretty: true
            basedir: 'site/source/'
            fileMatch: /\.pug$/
            fileTransform: (file) ->
              file = file.replace('index/index', 'index')
              file.replace(/\.pug$/, '.html')
          )
        ]
      )
    ]
  stylus:
    includeCss: true
    paths: ['site/source/']
    plugins: [require('autoprefixer-stylus')({hideWarnings: true})]

# For production builds, apply cachebusting hashes to all assets
if process.env.NODE_ENV == 'production'
  exports.hooks =
    onCompile: require('./site/config/cachebust')(exports)
