/**
 * DOM 工具函数
 */

/**
 * 创建 Shadow DOM 容器
 */
export const createShadowContainer = (id: string): { container: HTMLDivElement; shadowRoot: ShadowRoot } => {
  // 检查是否已存在
  let container = document.getElementById(id) as HTMLDivElement
  if (container) {
    return { container, shadowRoot: container.shadowRoot! }
  }

  // 创建容器
  container = document.createElement('div')
  container.id = id
  // 移除 all: initial，它可能会阻止事件
  container.style.cssText = 'position: fixed; z-index: 2147483647; pointer-events: none;'
  document.body.appendChild(container)

  // 创建 Shadow DOM
  const shadowRoot = container.attachShadow({ mode: 'open' })
  
  // 添加基础样式，确保内部元素可以接收事件
  const baseStyle = document.createElement('style')
  baseStyle.textContent = `
    :host {
      all: initial;
      pointer-events: none;
    }
    * {
      pointer-events: auto;
    }
  `
  shadowRoot.appendChild(baseStyle)

  return { container, shadowRoot }
}

/**
 * 注入样式到 Shadow DOM
 */
export const injectStyles = (shadowRoot: ShadowRoot, styles: string): void => {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  shadowRoot.appendChild(styleSheet)
}

/**
 * 获取选中文本的位置信息
 */
export interface SelectionPosition {
  text: string
  rect: DOMRect
  x: number
  y: number
}

export const getSelectionPosition = (mouseEvent?: MouseEvent): SelectionPosition | null => {
  const selection = window.getSelection()
  console.log('[DOM] getSelectionPosition called, selection:', selection)
  
  if (!selection || selection.rangeCount === 0) {
    console.log('[DOM] No selection or no ranges')
    return null
  }

  const text = selection.toString().trim()
  console.log('[DOM] Selected text:', text, 'length:', text.length)
  
  if (!text || text.length < 5) {
    console.log('[DOM] Text too short or empty')
    return null
  }

  try {
    const range = selection.getRangeAt(0)
    let rect = range.getBoundingClientRect()
    
    console.log('[DOM] Selection rect:', rect)
    
    // 检查 rect 是否有效
    if (rect.width === 0 && rect.height === 0) {
      console.log('[DOM] Invalid rect (zero dimensions), trying alternative methods')
      
      // 备用方法 1：使用 Range.getClientRects() 获取所有矩形片段
      const rects = range.getClientRects()
      console.log('[DOM] Client rects count:', rects.length)
      
      if (rects.length > 0) {
        // 使用第一个有效的矩形
        for (let i = 0; i < rects.length; i++) {
          const r = rects[i]
          if (r.width > 0 && r.height > 0) {
            rect = r
            console.log('[DOM] Using client rect:', rect)
            break
          }
        }
      }
      
      // 备用方法 2：创建临时 span 来获取精确位置
      if (rect.width === 0 && rect.height === 0) {
        console.log('[DOM] Still invalid, trying span insertion method')
        try {
          // 在选择的起始位置插入一个临时 span
          const span = document.createElement('span')
          span.style.cssText = 'position: absolute; visibility: hidden; pointer-events: none;'
          span.textContent = '\u200B' // 零宽空格
          
          // 在 range 的起始位置插入 span
          const startContainer = range.startContainer
          const startOffset = range.startOffset
          
          if (startContainer.nodeType === Node.TEXT_NODE) {
            // 文本节点：在文本中插入 span
            const textNode = startContainer as Text
            const tempRange = document.createRange()
            tempRange.setStart(textNode, startOffset)
            tempRange.insertNode(span)
            
            const spanRect = span.getBoundingClientRect()
            // 只有当 span rect 有效时才使用
            if (spanRect.width > 0 || spanRect.height > 0 || (spanRect.top > 0 && spanRect.top < window.innerHeight)) {
              rect = spanRect
              console.log('[DOM] Using span rect:', rect)
            } else {
              console.log('[DOM] Span rect invalid:', spanRect)
            }
            
            // 清理临时 span
            span.remove()
          }
        } catch (error) {
          console.error('[DOM] Span insertion failed:', error)
        }
      }
      
      // 备用方法 3：使用鼠标事件坐标（最可靠的方法）
      if ((rect.width === 0 && rect.height === 0) && mouseEvent) {
        console.log('[DOM] Using mouse event coordinates:', mouseEvent.clientX, mouseEvent.clientY)
        // 创建一个虚拟的 DOMRect，使用鼠标坐标
        rect = {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
          width: 1,
          height: 1,
          top: mouseEvent.clientY,
          bottom: mouseEvent.clientY + 1,
          left: mouseEvent.clientX,
          right: mouseEvent.clientX + 1,
          toJSON: () => ({})
        } as DOMRect
        console.log('[DOM] Created rect from mouse event:', rect)
      }
      
      // 备用方法 4：使用容器元素的位置（最后的备用方案）
      if (rect.width === 0 && rect.height === 0) {
        console.log('[DOM] Using final fallback: container position')
        const container = range.startContainer
        if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
          rect = container.parentElement.getBoundingClientRect()
          console.log('[DOM] Using parent element rect:', rect)
        } else if (container.nodeType === Node.ELEMENT_NODE) {
          rect = (container as Element).getBoundingClientRect()
          console.log('[DOM] Using container element rect:', rect)
        }
      }
      
      // 最后检查
      if (rect.width === 0 && rect.height === 0) {
        console.log('[DOM] Cannot get valid rect, returning null')
        return null
      }
    }

    // 计算工具栏位置
    let x = rect.left + rect.width / 2
    let y = rect.top
    
    // 确保工具栏不会超出视口顶部
    // 工具栏高度约为 60px，工具栏会显示在 y - 60 的位置
    // 所以 y 至少要是 140px (60px 工具栏高度 + 80px 顶部边距)
    const toolbarHeight = 60
    const topMargin = 80
    const minY = toolbarHeight + topMargin // 140px
    
    if (y < minY) {
      console.log(`[DOM] Y position too small (${y}), adjusting to ${minY}`)
      y = minY
    }
    
    // 确保工具栏不会超出视口底部
    const maxY = window.innerHeight - 100
    if (y > maxY) {
      console.log(`[DOM] Y position too large (${y}), adjusting to ${maxY}`)
      y = maxY
    }
    
    console.log('[DOM] Final position:', { x, y })

    // 使用视口坐标（不加 scrollY），因为工具栏是 position: fixed
    return {
      text,
      rect,
      x,
      y,
    }
  } catch (error) {
    console.error('[DOM] Error getting selection position:', error)
    return null
  }
}

/**
 * 检查点击是否在元素外部
 */
export const isClickOutside = (event: MouseEvent, element: HTMLElement): boolean => {
  return !element.contains(event.target as Node)
}

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy text:', error)
    // 降级方案
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}

/**
 * 检测暗黑模式
 */
export const isDarkMode = (): boolean => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 监听暗黑模式变化
 */
export const watchDarkMode = (callback: (isDark: boolean) => void): (() => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => callback(e.matches)

  mediaQuery.addEventListener('change', handler)

  return () => mediaQuery.removeEventListener('change', handler)
}
