#
# http://brunch.io/docs/config.html
#

require('dotenv/config')
cjs = require('commonjs-require-definition') # included with brunch

config = {}
config.compileSource = 'site/source/'
config.compileStatic = 'site/static/'
config.publishRoot = 'publish/site/'
config.publishAssets = 'assets/'
config.nameCleaner = (file) ->
  file.replace(config.compileSource, '')

# Import all site/source/**/index.{js,styl} as entry points
config.entryPoints = require('./site/config/entry-points')(config)

exports.paths =
  watched: [config.compileSource, config.compileStatic]
  public: config.publishRoot

exports.conventions =
  ignored: /\/_(?!.+\.js)/
  assets: config.compileStatic + '**'

exports.files = config.entryPoints

exports.modules =
  definition: (file) ->
    if file.indexOf('global.js') > -1 then cjs else ''
  nameCleaner: config.nameCleaner
  autoRequire: require('./site/config/auto-require')(config)

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
            basedir: config.compileSource
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
    paths: [config.compileSource]
    plugins: [require('autoprefixer-stylus')({hideWarnings: true})]

# For production builds, apply cachebusting hashes to all assets
if process.env.NODE_ENV == 'production'
  exports.hooks =
    onCompile: require('./site/config/cachebust')(config)
