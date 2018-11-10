exports.configureAutoRequire = (config) ->
  scripts = config.files.javascripts.entryPoints
  output = {}

  Object.keys(scripts).forEach((key) ->
    autoRequired = config.modules.nameCleaner(key)
    component = Object.keys(scripts[key])[0]
    output[component] = [autoRequired]
  )

  config.modules.autoRequire = output
