export const isObject = (value: any) => typeof value === 'object' && value !== null
export const extend = Object.assign
export const isArray = Array.isArray
export const isFunction = (value: any) => typeof value === 'function'
export const isNumber = (value: any) => typeof value === 'number'
export const isString = (value: any) => typeof value === 'string'
export const isIntegerKey = (value: any) => parseInt(value) + '' === value
export const hasOwn = (target: any, key: any) => Object.prototype.hasOwnProperty.call(target, key)
export const hasChange = (oldV, newV) => oldV !== newV && !(Number.isNaN(oldV) && Number.isNaN(newV))
