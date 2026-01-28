/**
 * 性能优化工具函数
 * 包含防抖（debounce）和节流（throttle）
 */

/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * 
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 * 
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching:', query)
 * }, 300)
 * 
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value)
 * })
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}

/**
 * 节流函数
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 * 
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scrolling...')
 * }, 100)
 * 
 * window.addEventListener('scroll', throttledScroll)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean // 是否在开始时执行
    trailing?: boolean // 是否在结束时执行
  } = {}
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0
  const { leading = true, trailing = true } = options

  return function (this: any, ...args: Parameters<T>) {
    const context = this
    const now = Date.now()

    // 如果不需要在开始时执行，则设置 previous 为当前时间
    if (!previous && !leading) {
      previous = now
    }

    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      // 时间到了，执行函数
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    } else if (!timeout && trailing) {
      // 设置定时器，在剩余时间后执行
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }
}

/**
 * 请求动画帧节流
 * 使用 requestAnimationFrame 实现的节流，确保在浏览器重绘前执行
 * 适用于需要频繁更新 DOM 的场景（如滚动、拖拽）
 * 
 * @param func 要节流的函数
 * @returns 节流后的函数
 * 
 * @example
 * const rafThrottledUpdate = rafThrottle(() => {
 *   updatePosition()
 * })
 * 
 * element.addEventListener('mousemove', rafThrottledUpdate)
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    if (rafId !== null) {
      return
    }

    rafId = requestAnimationFrame(() => {
      func.apply(context, args)
      rafId = null
    })
  }
}

/**
 * 取消防抖/节流
 * 用于清理防抖或节流函数的定时器
 * 
 * @param func 防抖或节流后的函数
 * 
 * @example
 * const debouncedFunc = debounce(myFunc, 300)
 * // ... 使用 debouncedFunc
 * cancel(debouncedFunc) // 取消待执行的调用
 */
export function cancel(func: any): void {
  if (func && typeof func.cancel === 'function') {
    func.cancel()
  }
}

/**
 * 创建可取消的防抖函数
 * 返回的函数包含 cancel 方法，可以取消待执行的调用
 * 
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 可取消的防抖函数
 * 
 * @example
 * const debouncedFunc = createCancelableDebounce(myFunc, 300)
 * debouncedFunc() // 调用
 * debouncedFunc.cancel() // 取消
 */
export function createCancelableDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debouncedFunc = function (this: any, ...args: Parameters<T>) {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      timeout = null
      func.apply(context, args)
    }, wait)
  }

  debouncedFunc.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debouncedFunc
}

/**
 * 创建可取消的节流函数
 * 返回的函数包含 cancel 方法，可以取消待执行的调用
 * 
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @returns 可取消的节流函数
 * 
 * @example
 * const throttledFunc = createCancelableThrottle(myFunc, 100)
 * throttledFunc() // 调用
 * throttledFunc.cancel() // 取消
 */
export function createCancelableThrottle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  const throttledFunc = function (this: any, ...args: Parameters<T>) {
    const context = this
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }

  throttledFunc.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    previous = 0
  }

  return throttledFunc
}
