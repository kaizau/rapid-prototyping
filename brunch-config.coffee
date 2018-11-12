{scanFiles} = require('./brunch/scan-files')
{rewriteAssets} = require('./brunch/rewrite-assets')
{configureAutoRequire} = require('./brunch/auto-require')

#
# http://brunch.io/docs/config.html
#

exports.paths =
  watched: [ 'source/components', 'source/pages', 'source/static' ]

exports.conventions =
  ignored: /\/_(?!shared\/.+\.js)/
  assets: /source\/static\//

exports.files = scanFiles('source/components', 'assets')

exports.modules =
  nameCleaner: (file) ->
    file.replace('source/components/', '')

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
