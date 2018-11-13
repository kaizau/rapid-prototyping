#
# http://brunch.io/docs/config.html
#

makeInputOutput = require('./config/input-output')
makeAutoRequire = require('./config/auto-require')
rewriteAssets = require('./config/rewrite-assets')
cjs = require('commonjs-require-definition') # included with brunch

exports.paths =
  watched: ['source/', 'static/']

exports.conventions =
  ignored: /\/_(?!.+\.js)/
  assets: /static\//

exports.files = makeInputOutput('source/', 'assets/', 'js,styl')

exports.modules =
  definition: (file) ->
    if file.indexOf('global.js') > -1 then cjs else ''
  nameCleaner: (file) ->
    file.replace('source/', '')

exports.modules.autoRequire = makeAutoRequire(exports)

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
              file.replace(/\.pug$/, '.html')
          )
        ]
      )
    ]
  stylus:
    includeCss: true
    paths: ['source/']
    plugins: [require('autoprefixer-stylus')({hideWarnings: true})]

if process.env.NODE_ENV == 'production'
  exports.hooks =
    onCompile: () ->
      rewriteAssets('./public/manifest.json')
