fs = require('fs')
path = require('path')
glob = require('glob-fs')()

module.exports = (config) ->
  inDir = config.customPaths.input
  outDir = config.customPaths.compiled
  inDir = if inDir.slice(-1) == '/' then inDir else inDir + '/'
  outDir = if outDir.slice(-1) == '/' then outDir else outDir + '/'
  output =
    stylesheets:
      joinTo: {}
    javascripts:
      entryPoints: {}

  for file in glob.readdirSync(inDir + "**/index{,~*}.{js,styl}")
    ext = path.extname(file)
    base = path.basename(file, ext)
    source = path.dirname(file)
    target = source.replace(inDir, outDir)
    targetFile = if ext == '.js' then "#{target}.js" else "#{target}.css"
    matchers = ["#{source}/**/*"]

    if ext == '.js'
      if base.indexOf('~') > -1
        modules = base.split('~')
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
