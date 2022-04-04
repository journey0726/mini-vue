import { reactive } from './reactive'
import { track, trigger } from './effect';
import { triggerOpTypes } from './operators'
import { isObject, hasChange } from '@vue/share';

export function ref(value: any) {
  if (isRef(value)) return value
  return new RefImpl(value)
}

class RefImpl {
  __value: any
  __isRef: Boolean
  constructor(value) {
    this.__value = convert(value)
    this.__isRef = true
  }
  get value() {
    track(this, triggerOpTypes.ADD, 'value')
    return this.__value
  }
  set value(newValue) {
    if (hasChange(this.__value, newValue)) {
      this.__value = convert(newValue)
      trigger(this, triggerOpTypes.ADD, 'value')
    }
  }
}

function isRef(target) {
  return !!(target && target.__isRef)
}

function convert(target) {
  return isObject(target) ? reactive(target) : target
}