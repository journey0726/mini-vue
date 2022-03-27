import { isObject } from '@vue/share';
import {
  mutateHander,
  shallowMutateHander,
  readonlyHander,
  shallowReadonlyHander
} from './baseHanders'



function reactive(target) {
  return createReactiveObject(target, false, mutateHander)
}

function shallowReactive(target) {
  return createReactiveObject(target, false, shallowMutateHander)
}

function readonly(target) {
  return createReactiveObject(target, true, readonlyHander)
}

function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHander)
}

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
function createReactiveObject(target, isReadonly, hander) {
  // 如果不是对象，直接返回，只能代理对象
  if (!isObject(target)) {
    return target
  }

  //找缓存，找到直接返回
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  if (proxyMap.get(target)) {
    return proxyMap.get(target)
  }

  const proxy = new Proxy(target, hander)
  proxyMap.set(target, proxy)
  return proxy
}

export {
  reactive,
  shallowReactive,
  readonly,
  shallowReadonly
}