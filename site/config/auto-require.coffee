module.exports = (config) ->
  scripts = config.files.javascripts.entryPoints
  output = {}
  for entry, value of scripts
    moduleName = config.modules.nameCleaner(entry)
    exit = Object.keys(value)[0]
    output[exit] = [moduleName]
  output
