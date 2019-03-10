fs = require('fs')
path = require('path')
glob = require('glob')

module.exports = (config) ->
  inDir = config.compileSource
  outDir = config.publishAssets
  inDir = if inDir.slice(-1) == '/' then inDir else inDir + '/'
  outDir = if outDir.slice(-1) == '/' then outDir else outDir + '/'
  output =
    stylesheets:
      joinTo: {}
    javascripts:
      entryPoints: {}

  files = glob.sync(inDir + "**/index{,#{config.moduleSeparator}*}.{js,styl}")
  for file in files
    ext = path.extname(file)
    base = path.basename(file, ext)
    source = path.dirname(file)
    target = source.replace(inDir, outDir)
    targetFile = if ext == '.js' then "#{target}.js" else "#{target}.css"
    matchers = ["#{source}/**/*"]

    if ext == '.js'
      if base.indexOf(config.moduleSeparator) > -1
        modules = base.split(config.moduleSeparator)
        modules.shift()
        for module in modules
          if module == '_shared'
            matchers.unshift("#{inDir}_shared/**/*")
          else
            matchers.unshift("node_modules/#{module}/**/*")
      output.javascripts.entryPoints[file] =
        "#{targetFile}": matchers

    else
      output.stylesheets.joinTo[targetFile] = matchers

  output
