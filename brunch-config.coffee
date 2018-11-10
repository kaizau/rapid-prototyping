{scanFiles} = require('./brunch/scan-files')
{rewriteAssets} = require('./brunch/rewrite-assets')
{configureAutoRequire} = require('./brunch/auto-require')

#
# http://brunch.io/docs/config.html
#

exports.paths =
  watched: [ 'components', 'content', 'static' ]

exports.conventions =
  ignored: /\/_(?!shared\/.+\.js)/
  assets: /static\//

exports.files = scanFiles('components', 'assets')

exports.modules =
  nameCleaner: (file) ->
    file.replace('components/', '')

configureAutoRequire(exports)

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
            fileMatch: /\.pug$/
            fileTransform: (file) ->
              file.replace(/\.pug$/, '.html')
          )
        ]
      )
    ]
  stylus:
    includeCss: true
    plugins: [
      require('autoprefixer-stylus')({ hideWarnings: true })
    ]

if process.env.NODE_ENV == 'production'
  exports.hooks =
    onCompile: () ->
      rewriteAssets('./public/manifest.json')
