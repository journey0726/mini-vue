import { extend, isObject, isArray, isIntegerKey, hasOwn, hasChange } from '@vue/share';
import { track, trigger } from './effect';
import { TrackOpTypes, triggerOpTypes } from './operators';
import { readonly, reactive } from './reactive';


const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true, false)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter(false)
const shallowSet = createSetter(true)

const readonlyObj = {
  set: (target, key) => {
    console.warn(`set ${target} on key ${key} failed`)
  }
}

const mutateHander = {
  get,
  set
}

const shallowMutateHander = {
  get: shallowGet,
  set: shallowSet
}

const readonlyHander = extend({
  get: readonlyGet,
}, readonlyObj)

const shallowReadonlyHander = extend({
  get: shallowReadonlyGet,
}, readonlyObj)



function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      //收集依赖
      track(target, TrackOpTypes.GET, key)
    }
    if (isShallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
function createSetter(isShallow = false) {
  return function set(target, key, value, receiver) {
    const oldVal = target[key]
    let hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    const res = Reflect.set(target, key, value, receiver)
    //需要区分是新增还是修改

    //新增
    if (!hasKey) {
      trigger(target, triggerOpTypes.ADD, key, value)
    } else if (hasChange(oldVal, value)) {
      // 修改
      trigger(target, triggerOpTypes.SET, key, value, oldVal)
    }

    return res
  }
}

export {
  mutateHander,
  shallowMutateHander,
  readonlyHander,
  shallowReadonlyHander
}