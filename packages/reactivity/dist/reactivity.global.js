var VueReactivity = (function (exports) {
  'use strict';

  const isObject = (value) => typeof value === 'object' && value !== null;
  const extend = Object.assign;
  const isArray = Array.isArray;
  const isIntegerKey = (value) => parseInt(value) + '' === value;
  const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
  const hasChange = (oldV, newV) => oldV !== newV && !(Number.isNaN(oldV) && Number.isNaN(newV));

  function effect(fn, options = {}) {
      const effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  }
  let uid = 0;
  let activeEffect; // 当前正在调用的effect
  const effectStack = []; //防止effect 嵌套出现问题
  function createReactiveEffect(fn, options) {
      const effect = function reactiveEffect() {
          if (!effectStack.includes(effect)) { // 已经加入effectStack的就不需要再次加入了
              try {
                  effectStack.push(effect);
                  activeEffect = fn;
                  return fn();
              }
              finally {
                  effectStack.pop();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.id = uid++; // 区分effect
      effect._isEffect = true; // 标识 这个是响应式effect
      effect.raw = fn;
      effect.options = options;
      return effect;
  }
  const targetMap = new WeakMap();
  function track(target, type, key) {
      if (activeEffect === undefined) {
          return;
      }
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, depsMap = new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, dep = new Set());
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
      }
      console.log(targetMap);
  }
  function trigger(target, type, key, value, oldValue) {
      console.log('trigger');
  }

  const get = createGetter();
  const shallowGet = createGetter(false, true);
  const readonlyGet = createGetter(true, false);
  const shallowReadonlyGet = createGetter(true, true);
  const set = createSetter(false);
  const shallowSet = createSetter(true);
  const readonlyObj = {
      set: (target, key) => {
          console.warn(`set ${target} on key ${key} failed`);
      }
  };
  const mutateHander = {
      get,
      set
  };
  const shallowMutateHander = {
      get: shallowGet,
      set: shallowSet
  };
  const readonlyHander = extend({
      get: readonlyGet,
  }, readonlyObj);
  const shallowReadonlyHander = extend({
      get: shallowReadonlyGet,
  }, readonlyObj);
  function createGetter(isReadonly = false, isShallow = false) {
      return function get(target, key, receiver) {
          const res = Reflect.get(target, key, receiver);
          if (!isReadonly) {
              //收集依赖
              track(target, 0 /* GET */, key);
          }
          if (isShallow) {
              return res;
          }
          if (isObject(res)) {
              return isReadonly ? readonly(res) : reactive(res);
          }
          return res;
      };
  }
  function createSetter(isShallow = false) {
      return function set(target, key, value, receiver) {
          const oldVal = target[key];
          let hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
          const res = Reflect.set(target, key, value, receiver);
          //需要区分是新增还是修改
          //新增
          if (!hasKey) {
              trigger();
          }
          else if (hasChange(oldVal, value)) {
              // 修改
              trigger();
          }
          return res;
      };
  }

  function reactive(target) {
      return createReactiveObject(target, false, mutateHander);
  }
  function shallowReactive(target) {
      return createReactiveObject(target, false, shallowMutateHander);
  }
  function readonly(target) {
      return createReactiveObject(target, true, readonlyHander);
  }
  function shallowReadonly(target) {
      return createReactiveObject(target, true, shallowReadonlyHander);
  }
  const reactiveMap = new WeakMap();
  const readonlyMap = new WeakMap();
  function createReactiveObject(target, isReadonly, hander) {
      // 如果不是对象，直接返回，只能代理对象
      if (!isObject(target)) {
          return target;
      }
      //找缓存，找到直接返回
      const proxyMap = isReadonly ? readonlyMap : reactiveMap;
      if (proxyMap.get(target)) {
          return proxyMap.get(target);
      }
      const proxy = new Proxy(target, hander);
      proxyMap.set(target, proxy);
      return proxy;
  }

  exports.effect = effect;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.shallowReactive = shallowReactive;
  exports.shallowReadonly = shallowReadonly;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=reactivity.global.js.map
