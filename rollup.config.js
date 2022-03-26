import path, { format } from 'path'

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = (p) => {
  return path.resolve(packageDir, p)
}

const pkg = require(resolve('package.json'))

const name = path.basename(packageDir)

const outputConfig = {
  'esm': {
    file: `dist/${name}.esm-builder.js`,
    format: 'es'
  },
  'cjs': {
    file: `dist/${name}.cjs.js`,
    format: 'cjs'
  },
  'global': {
    file: `dist/${name}.global.js`,
    format: 'iife'  //立即执行函数 ，或者给 umd
  }
}

function createConfig(format, output) {
  output.name = options.name
  output.sourcemap = true
  return output
}

const options = pkg.buildOptions

export default options.formats.map(format => {
  return createConfig(format, outputConfig[format])
})