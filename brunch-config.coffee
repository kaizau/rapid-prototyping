fs = require('fs')
path = require('path')

#
# http://brunch.io/docs/config.html
#

exports.paths =
  watched: [ 'components', 'content', 'static' ]

exports.conventions =
  assets: /static\//

# TODO Generate dynamically
exports.files =
  stylesheets:
    joinTo:
      # 'output.js': [ 'module/included/if/matched/**/*' ]
      'assets/global.css': [
        'components/global/**/*.(styl|css)'
      ]
  javascripts:
    entryPoints:
      # 'entry.js':
      #   'output.js': [ 'module/included/if/matched/**/*' ]
      'components/global/index.js':
        'assets/global.js': [
          'node_modules/**/*.js'
          'components/global/**/*.js'
        ]

exports.modules =
  nameCleaner: (file) ->
    file.replace('components/', '')
  autoRequire:
    'assets/global.js': ['global/index.js']

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
  replace = require('replace')

  exports.hooks =
    onCompile: (generated, changed) ->
      manifest = JSON.parse(fs.readFileSync('./public/manifest.json', 'utf8'))
      Object.keys(manifest).forEach((key) ->
        replace(
          regex: key
          replacement: manifest[key]
          paths: ['./public']
          exclude: 'manifest.json'
          recursive: true
          silent: true
        )
      )
      fs.unlinkSync('./public/manifest.json')
