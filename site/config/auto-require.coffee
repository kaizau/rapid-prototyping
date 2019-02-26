module.exports = (config) ->
  scripts = config.entryPoints
  output = {}
  for entry, value of scripts
    moduleName = config.nameCleaner(entry)
    exit = Object.keys(value)[0]
    output[exit] = [moduleName]
  output
