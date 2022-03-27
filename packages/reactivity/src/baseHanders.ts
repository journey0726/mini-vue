import { extend } from '@vue/share';

function createGetter(isReadonly = false, isShallow = false) {

}
function createSetter(isShallow) {

}

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

export {
  mutateHander,
  shallowMutateHander,
  readonlyHander,
  shallowReadonlyHander
}