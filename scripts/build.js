//找到packages下所有包 然后进行打包
const fs = require('fs')
const execa = require('execa')  //开启子进程 打包

const targets = fs.readdirSync('packages').filter(f => {
  return fs.statSync(`packages/${f}`).isDirectory()
})

async function build(target) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}
function runParallel(targets, Fns) {
  let res = []
  for (let target of targets) {
    let r = build(target)
    res.push(r)
  }
  return Promise.all(res)
}

runParallel(targets, build)
