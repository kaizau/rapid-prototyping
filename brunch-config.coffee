#
# http://brunch.io/docs/config.html
#

exports.paths =
  watched: [ 'components', 'content', 'static' ]

exports.conventions =
  # Include _redirects for netlify
  ignored: /\/_(?!redirects)/
  assets: /static\//

exports.files =
  stylesheets:
    joinTo:
      # 'output.js': [ 'module/included/if/matched/**/*.css' ]
      'assets/global.css': [
        'components/global/**/*.styl'
      ]
  javascripts:
    entryPoints:
      # 'entry.js':
      #   'output.js': [ 'module/included/if/matched/**/*.js' ]
      'components/global/index.js':
        'assets/global.js': [
          'node_modules/**/*.js'
          'components/global/**/*.js'
        ]

exports.modules =
  nameCleaner: (path) ->
    path.replace('components/', '')
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
            fileTransform: (path) ->
              path.replace(/\.pug$/, '.html')
          )
        ]
      )
    ]
  stylus:
    includeCss: true

if process.env.NODE_ENV == 'production'
  exports.hooks =
    onCompile: (generated, changed) ->
      fs = require('fs')
      replace = require('replace')
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
