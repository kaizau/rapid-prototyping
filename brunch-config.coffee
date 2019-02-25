#
# http://brunch.io/docs/config.html
#

require('dotenv/config')
entryPoints = require('./brunch-config/entry-points')
autoRequire = require('./brunch-config/auto-require')
rewriteAssets = require('./brunch-config/rewrite-assets')
cjs = require('commonjs-require-definition') # included with brunch

exports.paths =
  watched: ['source/', 'static/']

exports.conventions =
  ignored: /\/_(?!.+\.js)/
  assets: /static\//

# Imports all source/*/index.{js,styl} as entry points
exports.files = entryPoints('source/', 'assets/', 'js,styl')

exports.modules =
  definition: (file) ->
    if file.indexOf('global.js') > -1 then cjs else ''
  nameCleaner: (file) ->
    file.replace('source/', '')

# Makes every module self-executing
exports.modules.autoRequire = autoRequire(exports)

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
            basedir: 'source/'
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
    paths: ['source/']
    plugins: [require('autoprefixer-stylus')({hideWarnings: true})]

# For production builds, apply cachebusting hashes to all assets
if process.env.NODE_ENV == 'production'
  exports.hooks =
    onCompile: () ->
      rewriteAssets('./public/manifest.json')
