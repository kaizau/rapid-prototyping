#
# http://brunch.io/docs/config.html
#

exports.paths =
  watched: [ 'components', 'content' ]

exports.conventions =
  # Include _redirects for netlify
  ignored: /\/_(?!redirects)/
  assets: /\/content\//

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
  fingerprint:
    autoClearOldFiles: true
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
