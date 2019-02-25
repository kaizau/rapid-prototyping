#
# http://brunch.io/docs/config.html
#

require('dotenv/config')
cjs = require('commonjs-require-definition') # included with brunch

# Used by custom brunch-config/* helpers
exports.customPaths =
  input: 'source/'
  output: 'public/'
  compiled: 'assets/'

exports.paths =
  watched: ['source/', 'static/']

exports.conventions =
  ignored: /\/_(?!.+\.js)/
  assets: /static\//

# Imports all source/*/index.{js,styl} as entry points
exports.files = require('./brunch-config/entry-points')(exports)

exports.modules =
  definition: (file) ->
    if file.indexOf('global.js') > -1 then cjs else ''
  nameCleaner: (file) ->
    file.replace('source/', '')

# Makes every module self-executing
exports.modules.autoRequire = require('./brunch-config/auto-require')(exports)

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
    onCompile: require('./brunch-config/cachebust')(exports)
