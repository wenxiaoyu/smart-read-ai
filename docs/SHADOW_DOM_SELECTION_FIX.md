# Shadow DOM 选择文本问题修复

## 问题描述

用户在工具栏或结果卡片上选择文本时，界面会意外消失。

## 根本原因

### 问题 1: Shadow DOM 事件传播

Shadow DOM 使用 `mode: 'open'` 创建，事件会穿透 Shadow DOM 边界传播到外部文档。当用户在 Shadow DOM 内部点击时：

1. `mouseup` 事件冒泡到 `document`
2. 外部的 `handleSelection` 监听器被触发
3. 检测到新的选择，触发状态更新
4. 导致界面消失或重新定位

### 问题 2: event.target 的局限性

```typescript
// ❌ 不够准确
if (shadowContainer?.shadowRoot?.contains(event.target as Node)) {
  return
}
```

`event.target` 只能检测到事件的直接目标，但在某些情况下（如事件委托、合成事件），可能无法准确判断。

## 解决方案

### 使用 event.composedPath()

`composedPath()` 返回事件传播的完整路径，包括穿透 Shadow DOM 边界的路径。

```typescript
private handleSelection = (event: MouseEvent) => {
  const shadowContainer = document.getElementById('smartread-ai-root')
  
  // 1. 检查 event.target
  if (shadowContainer?.shadowRoot?.contains(event.target as Node)) {
    console.log('[SmartRead AI] Click inside Shadow DOM (event.target), ignoring')
    return
  }
  
  // 2. 检查 event.composedPath() - 更准确
  const path = event.composedPath()
  if (path.some(node => {
    // 只检查 Node 类型的对象（排除 Window 等非 Node 对象）
    if (node instanceof Node) {
      return node === shadowContainer || shadowContainer?.shadowRoot?.contains(node)
    }
    return false
  })) {
    console.log('[SmartRead AI] Click inside Shadow DOM (composedPath), ignoring')
    return
  }
  
  // 3. 处理外部选择
  setTimeout(() => {
    const selectionInfo = getSelectionPosition()
    if (selectionInfo) {
      this.setState({
        toolbarVisible: true,
        toolbarPosition: { x: selectionInfo.x, y: selectionInfo.y },
        selectedText: selectionInfo.text,
        resultVisible: false,
      })
    }
  }, 10)
}
```

## 工作原理

### event.composedPath() 详解

```typescript
// 示例：点击结果卡片中的文本
const path = event.composedPath()
// 返回：
[
  <span>,                    // 文本节点的父元素
  <div class="smartread-section-content">,
  <div class="smartread-result-body">,
  <div class="smartread-result-card">,
  <div>,                     // React 容器
  #shadow-root (open),       // Shadow Root
  <div id="smartread-ai-root">,
  <body>,
  <html>,
  #document,
  Window
]
```

### 检查逻辑

```typescript
path.some(node => {
  // 只检查 Node 类型的对象（排除 Window 等非 Node 对象）
  if (node instanceof Node) {
    return node === shadowContainer ||                    // 检查是否是容器本身
           shadowContainer?.shadowRoot?.contains(node)    // 检查是否在 Shadow DOM 内
  }
  return false
})
```

**关键点**：
- `composedPath()` 返回的数组包含 `Window` 对象
- `Window` 不是 `Node` 类型
- 必须先用 `instanceof Node` 检查类型
- 否则 `contains()` 会抛出 TypeError

如果路径中任何节点在 Shadow DOM 内，返回 `true`，忽略该事件。

## 测试场景

### ✅ 应该忽略的情况

1. **在工具栏上选择文本**
   - 选择"简化"、"解释"、"复制"等按钮文字
   - 工具栏保持显示

2. **在结果卡片上选择文本**
   - 选择标题、原文、结果内容
   - 结果卡片保持显示

3. **点击工具栏按钮**
   - 点击按钮执行操作
   - 正常触发功能

4. **点击结果卡片按钮**
   - 点击复制、收藏、关闭按钮
   - 正常触发功能

### ✅ 应该响应的情况

1. **在网页上选择文本**
   - 选择网页内容
   - 工具栏出现

2. **在网页上点击空白处**
   - 点击网页其他区域
   - 工具栏消失（如果没有结果卡片）

3. **选择新的网页文本**
   - 选择不同的网页内容
   - 工具栏移动到新位置
   - 结果卡片消失

## 调试日志

### 正常流程（网页选择）

```
[SmartRead AI] Mouse up detected
[SmartRead AI] Selection info: {text: "...", rect: DOMRect, x: 100, y: 200}
[SmartRead AI] Showing toolbar at: 100 200
[SmartRead AI] Rendering, state: {toolbarVisible: true, resultVisible: false}
```

### 忽略流程（Shadow DOM 选择）

```
[SmartRead AI] Mouse up detected
[SmartRead AI] Click inside Shadow DOM (composedPath), ignoring
```

## 浏览器兼容性

### event.composedPath()

- ✅ Chrome 53+
- ✅ Edge 79+
- ✅ Firefox 52+
- ✅ Safari 10+

所有现代浏览器都支持。

## 性能考虑

### composedPath() 性能

- `composedPath()` 返回一个数组，包含事件传播路径
- 数组长度通常 < 20 个节点
- `Array.some()` 在找到匹配时立即返回
- 性能影响可忽略不计

### 优化建议

如果需要进一步优化，可以缓存 `shadowContainer`：

```typescript
class SmartReadAI {
  private shadowContainer: HTMLElement | null = null
  
  constructor() {
    // ...
    this.shadowContainer = document.getElementById('smartread-ai-root')
  }
  
  private handleSelection = (event: MouseEvent) => {
    const path = event.composedPath()
    if (path.some(node => 
      node === this.shadowContainer || 
      this.shadowContainer?.shadowRoot?.contains(node as Node)
    )) {
      return
    }
    // ...
  }
}
```

## 替代方案

### 方案 1: 使用 pointer-events

```css
.smartread-toolbar-container {
  pointer-events: none; /* 容器不响应事件 */
}

.smartread-toolbar-button {
  pointer-events: auto; /* 按钮响应事件 */
}
```

**缺点**：
- 无法选择文本
- 用户体验不佳

### 方案 2: 停止事件传播

```typescript
// 在 Shadow DOM 内部
element.addEventListener('mouseup', (e) => {
  e.stopPropagation() // 阻止事件冒泡
})
```

**缺点**：
- 需要在每个元素上添加监听器
- 代码复杂度增加
- 可能影响其他功能

### 方案 3: 使用 closed Shadow DOM

```typescript
const shadowRoot = element.attachShadow({ mode: 'closed' })
```

**缺点**：
- 事件仍然会冒泡
- 无法从外部访问 Shadow DOM
- 调试困难

## 最佳实践

### ✅ 推荐做法

1. **使用 composedPath() 检查事件路径**
   - 准确、可靠
   - 性能良好
   - 代码简洁

2. **双重检查**
   - 先检查 `event.target`（快速路径）
   - 再检查 `composedPath()`（完整路径）

3. **添加调试日志**
   - 便于排查问题
   - 了解事件流

### ❌ 避免做法

1. **不要使用 pointer-events: none**
   - 会阻止文本选择
   - 用户体验差

2. **不要过度使用 stopPropagation()**
   - 可能影响其他功能
   - 代码难以维护

3. **不要依赖 event.target**
   - 在某些情况下不准确
   - 需要配合其他方法

## 相关问题

### Q: 为什么不在 Shadow DOM 内部监听事件？

A: Shadow DOM 内部是 React 组件，使用 React 的事件系统。我们需要在外部监听 `document` 的事件来检测网页上的文本选择。

### Q: 为什么需要 setTimeout？

A: 文本选择是异步的，需要等待浏览器完成选择操作后再获取选择信息。

### Q: 为什么 resultVisible 设置为 false？

A: 当用户在网页上选择新文本时，应该隐藏之前的结果卡片，显示新的工具栏。但如果选择发生在 Shadow DOM 内部，我们会提前返回，不会执行这个逻辑。

## 更新日志

**2026-01-28**:
- ✅ 添加 `event.composedPath()` 检查
- ✅ 添加 `instanceof Node` 类型检查（修复 Window 对象错误）
- ✅ 修复工具栏选择文本消失问题
- ✅ 修复结果卡片选择文本消失问题
- ✅ 添加详细的调试日志
- ✅ 创建技术文档

---

**关键技术**: Shadow DOM, event.composedPath(), 事件冒泡, React

**相关文档**: 
- [Shadow DOM 规范](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath)
- [Chrome 扩展最佳实践](./.kiro/steering/chrome-extension-best-practices.md)
