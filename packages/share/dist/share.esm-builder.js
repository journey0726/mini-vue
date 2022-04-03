const isObject = (value) => typeof value === 'object' && value !== null;
const extend = Object.assign;
const isArray = Array.isArray;
const isFunction = (value) => typeof value === 'function';
const isNumber = (value) => typeof value === 'number';
const isString = (value) => typeof value === 'string';
const isIntegerKey = (value) => parseInt(value) + '' === value;
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
const hasChange = (oldV, newV) => oldV !== newV && !(Number.isNaN(oldV) && Number.isNaN(newV));

export { extend, hasChange, hasOwn, isArray, isFunction, isIntegerKey, isNumber, isObject, isString };
//# sourceMappingURL=share.esm-builder.js.map
