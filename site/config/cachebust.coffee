fs = require('fs')
crypto = require('crypto')
pathlib = require('path')
replace = require('replace')

calculateHash = (file) ->
  shasum = crypto.createHash('md5')
  shasum.update(fs.readFileSync(file))
  precision = 8
  shasum.digest('hex')[0...precision]

hashPath = (path) ->
  dir = pathlib.dirname(path)
  ext = pathlib.extname(path)
  base = pathlib.basename(path, ext)
  hash = calculateHash(path)
  outputFile = "#{base}-#{hash}#{ext}"
  pathlib.join(dir, outputFile)

outputFolder = null

onCompile = (files, assets) ->
  generated = files.concat(
    assets.map(
      (asset) -> path: asset.destinationPath
    )
  )

  for asset in generated
    hashedPath = hashPath(asset.path)
    fs.renameSync(asset.path, hashedPath)
    original = pathlib.relative(outputFolder, asset.path)
    hashed = pathlib.relative(outputFolder, hashedPath)
    replace(
      regex: original
      replacement: hashed
      paths: [outputFolder]
      recursive: true
      silent: true
    )

module.exports = (config) ->
  outputFolder = config.publishRoot
  onCompile
