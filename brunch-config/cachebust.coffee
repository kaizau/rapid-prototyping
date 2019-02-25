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

module.exports = (files, assets) ->
  publicFolder = 'public/'
  generated = files.concat(
    assets.map(
      (asset) -> path: asset.destinationPath
    )
  )

  for asset in generated
    hashedPath = hashPath(asset.path)
    fs.renameSync(asset.path, hashedPath)
    original = pathlib.relative(publicFolder, asset.path)
    hashed = pathlib.relative(publicFolder, hashedPath)
    replace(
      regex: original
      replacement: hashed
      paths: [publicFolder]
      recursive: true
      silent: true
    )
