# 代码块选择工具栏不显示问题修复

## 问题描述

用户在代码块（`<pre>` 或 `<code>` 标签）中选择文本时，工具栏不显示或显示位置不正确。

## 问题症状

从控制台日志可以看到：

```
[DOM] Selection rect: DOMRect {x: 0, y: 0, width: 0, height: 0, top: 0, …}
[DOM] Invalid rect (zero dimensions), trying alternative method
[DOM] Using container element rect: DOMRect {x: 272, y: 23.899999618530273, ...}
[SmartRead AI] Showing toolbar at: 569.2000122070312 23.899999618530273
```

工具栏被定位在 `y: 23.9px`，然后在 SelectionToolbar 组件中减去 60px（`top: ${position.y - 60}px`），导致工具栏位置为负数或非常接近顶部，超出视口范围。

## 根本原因

### 原因 1：`range.getBoundingClientRect()` 返回零尺寸

当选择代码块或自定义元素（如 `<xer-code-example>`）中的文本时，`Range.getBoundingClientRect()` 可能返回零尺寸的矩形（width: 0, height: 0）。这是因为：

1. 代码块通常使用特殊的布局（如 `white-space: pre`）
2. 自定义元素可能使用 Shadow DOM 或特殊的渲染方式
3. 选择可能跨越多个文本节点或嵌套元素
4. 某些网站的 CSS 可能影响选择矩形的计算

### 原因 2：备用方法获取的位置不准确

当主方法失败时，使用容器元素的 `getBoundingClientRect()` 会返回整个容器的位置，而不是选择的实际位置。例如：
- 容器可能是整个代码块元素
- 工具栏会显示在容器的中心，而不是选中文本附近
- 对于大型容器，工具栏可能离选中文本很远

### 原因 3：工具栏定位计算未考虑自身高度

工具栏在 SelectionToolbar 组件中使用 `position.y - 60` 来定位，但 `getSelectionPosition()` 返回的 y 值没有考虑这个偏移量。

## 解决方案

### 修复 1：改进备用定位方法

在 `src/utils/dom.ts` 的 `getSelectionPosition()` 函数中，添加多层备用方案：

```typescript
// 检查 rect 是否有效
if (rect.width === 0 && rect.height === 0) {
  console.log('[DOM] Invalid rect (zero dimensions), trying alternative methods')
  
  // 备用方法 1：使用 Range.getClientRects() 获取所有矩形片段
  const rects = range.getClientRects()
  if (rects.length > 0) {
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i]
      if (r.width > 0 && r.height > 0) {
        rect = r
        break
      }
    }
  }
  
  // 备用方法 2：插入临时 span 元素获取精确位置
  if (rect.width === 0 && rect.height === 0) {
    try {
      const span = document.createElement('span')
      span.style.cssText = 'position: absolute; visibility: hidden; pointer-events: none;'
      span.textContent = '\u200B' // 零宽空格
      
      const startContainer = range.startContainer
      const startOffset = range.startOffset
      
      if (startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer as Text
        const tempRange = document.createRange()
        tempRange.setStart(textNode, startOffset)
        tempRange.insertNode(span)
        
        rect = span.getBoundingClientRect()
        span.remove() // 立即清理
      }
    } catch (error) {
      console.error('[DOM] Span insertion failed:', error)
    }
  }
  
  // 备用方法 3：使用鼠标事件坐标（最可靠的方法）
  if ((rect.width === 0 && rect.height === 0) && mouseEvent) {
    console.log('[DOM] Using mouse event coordinates')
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
  }
  
  // 备用方法 4：使用容器元素的位置（最后的备用方案）
  if (rect.width === 0 && rect.height === 0) {
    const container = range.startContainer
    if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
      rect = container.parentElement.getBoundingClientRect()
    } else if (container.nodeType === Node.ELEMENT_NODE) {
      rect = (container as Element).getBoundingClientRect()
    }
  }
}
```

**关键改进**：
- 添加了鼠标事件坐标作为备用方案 3
- 这是最可靠的方法，因为鼠标坐标总是准确的
- 特别适用于自定义元素（如 `<xer-code-example>`）和 Shadow DOM 内的选择

### 修复 2：调整最小 Y 位置计算

考虑工具栏高度和定位偏移：

```typescript
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
```

**关键点**：
- 工具栏在 SelectionToolbar 中使用 `top: ${position.y - 60}px`
- 所以 `position.y` 必须至少是 `140px`（60px 工具栏高度 + 80px 顶部边距）
- 这样工具栏的实际位置才会是 `140 - 60 = 80px`，在视口内可见

## 测试步骤

1. **重新构建扩展**：
   ```bash
   pnpm build
   ```

2. **重新加载扩展**：
   - 打开 `chrome://extensions/`
   - 找到 SmartRead AI 扩展
   - 点击"重新加载"按钮

3. **测试代码块选择**：
   - 打开包含代码块的网页
   - 选择代码块中的文本（至少 5 个字符）
   - 检查工具栏是否显示在合适的位置

4. **检查控制台日志**：
   ```
   [DOM] Y position too small (23.9), adjusting to 140
   [DOM] Final position: {x: 569.2, y: 140}
   [SmartRead AI] Showing toolbar at: 569.2 140
   ```

5. **验证工具栏位置**：
   - 工具栏应该显示在距离顶部至少 80px 的位置
   - 工具栏应该完全可见，不会被裁剪
   - 工具栏应该在选择文本的上方或附近

## 预防措施

### 1. 始终考虑组件的实际渲染位置

当计算位置时，要考虑组件内部的偏移量：
- SelectionToolbar 使用 `top: ${position.y - 60}px`
- 所以 `position.y` 必须足够大，确保 `position.y - 60 >= 80`

### 2. 提供多层备用方案

对于选择矩形的获取：
1. 主方法：`range.getBoundingClientRect()`
2. 备用方法 1：`range.getClientRects()[0]`
3. 备用方法 2：容器元素的 `getBoundingClientRect()`
4. 最后检查：确保矩形有效，否则返回 null

### 3. 添加详细的调试日志

在关键步骤添加日志，便于排查问题：
```typescript
console.log('[DOM] Selection rect:', rect)
console.log('[DOM] Invalid rect, trying alternative method')
console.log('[DOM] Y position too small, adjusting')
console.log('[DOM] Final position:', { x, y })
```

## 相关文件

- `src/utils/dom.ts` - `getSelectionPosition()` 函数
- `src/content/index.tsx` - `handleSelection()` 方法
- `src/content/components/SelectionToolbar.tsx` - 工具栏组件
- `docs/chrome-extension-best-practices.md` - Chrome 扩展最佳实践

## 已知限制

1. **某些特殊布局可能仍然有问题**：
   - 使用 `position: fixed` 或 `position: sticky` 的代码块
   - 使用 CSS transforms 的代码块
   - 在 iframe 中的代码块

2. **跨多行选择的位置计算**：
   - 当前使用第一个矩形的位置
   - 可能需要根据选择的中心点来计算更合适的位置

3. **滚动时的位置更新**：
   - 工具栏使用 `position: fixed`，不会随页面滚动
   - 如果用户滚动页面，工具栏位置可能不再准确

## 后续优化建议

1. **动态调整工具栏位置**：
   - 监听滚动事件，更新工具栏位置
   - 或者在滚动时隐藏工具栏

2. **智能定位算法**：
   - 检测工具栏是否会超出视口
   - 自动选择最佳显示位置（上方、下方、左侧、右侧）

3. **视觉调试模式**：
   - 添加开发者选项，显示选择矩形的边界
   - 显示工具栏的计算位置和实际位置

## 总结

代码块选择问题的核心是：
1. `range.getBoundingClientRect()` 可能返回零尺寸
2. 备用方法可能返回过于靠近顶部的位置
3. 工具栏定位计算必须考虑自身高度和偏移量

通过改进备用定位方法和调整最小 Y 位置计算，确保工具栏始终显示在视口内的合适位置。
