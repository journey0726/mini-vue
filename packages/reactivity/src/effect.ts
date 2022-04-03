import { isArray, isNumber, isIntegerKey } from '@vue/share'
import { triggerOpTypes } from './operators'

export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}

let uid = 0
let activeEffect: any    // 当前正在调用的effect
const effectStack = []   //防止effect 嵌套出现问题
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {  // 已经加入effectStack的就不需要再次加入了
      try {
        effectStack.push(effect)
        activeEffect = fn
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }

  effect.id = uid++    // 区分effect
  effect._isEffect = true  // 标识 这个是响应式effect
  effect.raw = fn
  effect.options = options
  return effect
}

const targetMap = new WeakMap()
export function track(target, type, key) {
  if (activeEffect === undefined) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
}

export function trigger(target, type, key?, value?, oldValue?) {
  const depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }
  let effects = new Set()
  const add = (e) => {
    e.forEach(effect => {
      effects.add(effect)
    })
  }
  if (isArray(target) && key === 'length') {
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key > value) {
        add(dep)
      }
    })
  } else {
    if (key) {
      add(depsMap.get(key))
    }
    switch (type) {
      case triggerOpTypes.ADD: //新增了一个索引，还需要修改长度
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length'))
        }
    }
  }
  effects.forEach((effect: any) => effect())

}