fs = require('fs')
path = require('path')
glob = require('glob-fs')()

exports.scanFiles = (inDir, outDir) ->
  inDir = if inDir.slice(-1) == '/' then inDir else inDir + '/'
  outDir = if outDir.slice(-1) == '/' then outDir else outDir + '/'
  output =
    stylesheets:
      joinTo: {}
    javascripts:
      joinTo: {}
      entryPoints: {}

  components = glob.readdirSync(inDir + '**/{entry,join}.{js,styl}')

  components.forEach((source) ->
    ext = path.extname(source)
    base = path.basename(source, ext)
    type = if ext == '.js' then 'javascripts' else 'stylesheets'
    pattern = if ext == '.js' then '*.js' else '*.{styl,css}'

    sourceDir = path.dirname(source)
    targetDir = sourceDir.replace(inDir, outDir)
    targetExt = if ext == '.styl' then '.css' else ext
    target = targetDir + targetExt

    if base == 'entry'
      output[type]['entryPoints'][source] =
        "#{target}": [
          "#{sourceDir}/**/#{pattern}"
        ]
    else
      output[type]['joinTo'][target] = [
        "#{sourceDir}/**/#{pattern}"
      ]
  )

  output
