'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (value) => typeof value === 'object' && value !== null;
const extend = Object.assign;
const isArray = Array.isArray;
const isFunction = (value) => typeof value === 'function';
const isNumber = (value) => typeof value === 'number';
const isString = (value) => typeof value === 'string';
const isIntegerKey = (value) => parseInt(value) + '' === value;
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
const hasChange = (oldV, newV) => oldV !== newV && !(Number.isNaN(oldV) && Number.isNaN(newV));

exports.extend = extend;
exports.hasChange = hasChange;
exports.hasOwn = hasOwn;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isIntegerKey = isIntegerKey;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
//# sourceMappingURL=share.cjs.js.map
