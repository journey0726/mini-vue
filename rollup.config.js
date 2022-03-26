import path, { format } from 'path'
import json from '@rollup/plugin-json'
import ts from 'rollup-plugin-typescript2'  // ts插件
import node_resolve from '@rollup/plugin-node-resolve'   //解析第三方模块

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = (p) => {
  return path.resolve(packageDir, p)
}

const pkg = require(resolve('package.json'))

const name = path.basename(packageDir)

const outputConfig = {
  'esm': {
    file: resolve(`dist/${name}.esm-builder.js`),
    format: 'es'
  },
  'cjs': {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  'global': {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'  //立即执行函数 ，或者给 umd
  }
}

function createConfig(format, output) {
  output.name = options.name
  output.sourcemap = true
  return {
    input: resolve('src/index.ts'),
    output,
    plugin: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      node_resolve()
    ]
  }
}

const options = pkg.buildOptions

export default options.formats.map(format => {
  return createConfig(format, outputConfig[format])
})