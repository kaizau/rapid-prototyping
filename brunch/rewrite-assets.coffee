fs = require('fs')
path = require('path')
replace = require('replace')

exports.rewriteAssets = (file) ->
  dir = path.dirname(file)
  manifest = JSON.parse(fs.readFileSync(file, 'utf8'))
  Object.keys(manifest).forEach((key) ->
    replace(
      regex: key
      replacement: manifest[key]
      paths: [dir]
      exclude: 'manifest.json'
      recursive: true
      silent: true
    )
  )
  fs.unlinkSync(file)
