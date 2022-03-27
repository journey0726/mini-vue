//单个进行打包
const fs = require('fs')
const execa = require('execa')  //开启子进程 打包

const target = 'reactivity'

async function build(target) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}
function runParallel(target, build) {
  return build(target)
}

runParallel(target, build)
