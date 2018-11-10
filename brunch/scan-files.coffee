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

  components = glob.readdirSync(inDir + '**/{entry,join}{,~*}.{js,styl}')

  components.forEach((source) ->
    ext = path.extname(source)
    base = path.basename(source, ext)
    type = if ext == '.js' then 'javascripts' else 'stylesheets'

    sourceDir = path.dirname(source)
    targetDir = sourceDir.replace(inDir, outDir)
    targetExt = if ext == '.styl' then '.css' else ext
    target = targetDir + targetExt

    matchers = ["#{sourceDir}/**/*"]
    if base.indexOf('~') > -1
      modules = base.split('~')
      modules.shift()
      modules.forEach((module) ->
        if module == '_shared'
          matchers.unshift("#{inDir}_shared/**/*")
        else
          matchers.unshift("node_modules/#{module}/**/*")
      )

    if base.indexOf('entry') > -1
      output[type]['entryPoints'][source] =
        "#{target}": matchers
    else
      output[type]['joinTo'][target] = matchers
  )

  output
