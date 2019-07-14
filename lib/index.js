'use strict'

const fs = require('fs')
const path = require('path')
const Minimatch = require('minimatch').Minimatch

function readDir (root, options) {
  const entries = fs.readdirSync(root)
  const result = {}

  for (const entry of entries) {
    const name = path.basename(entry, path.extname(entry))
    const fullPath = path.join(root, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      if (options.flat) {
        const inner = readDir(fullPath, options)
        for (const key in inner) {
          result[`${name}/${key}`] = inner[key]
        }
      } else {
        result[name] = readDir(fullPath, options)
      }
    } else if (stat.isFile()) {
      if (options.patterns.every((pattern) => pattern.match(path.relative(options.root, fullPath)))) {
        result[name] = options.fn(fullPath)
      }
    }
  }

  return result
}

exports.load = function (opts) {
  const defaults = {
    fn: (path) => fs.readFileSync(path, 'utf8'),
    patterns: ['*'],
    flat: false
  }

  const options = Object.assign({}, defaults, opts)
  options.patterns = options.patterns.map((pattern) => new Minimatch(pattern, { matchBase: true }))

  if (!options.root) {
    throw new Error(`Must specify 'root' parameter`)
  }
  options.root = path.resolve(options.root)

  return readDir(options.root, options)
}
