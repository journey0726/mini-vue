export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}

let uid = 0
let activeEffect   // 当前正在调用的effect
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

export function track(target, type, key) {

}

export function trigger() {

}