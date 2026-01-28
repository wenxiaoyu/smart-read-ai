# 结果卡片智能定位与拖拽功能

## 功能概述

结果卡片现在支持：
1. **智能定位** - 自动调整位置，避免超出屏幕边界
2. **拖拽移动** - 用户可以拖动卡片到任意位置

## 1. 智能定位

### 问题背景

当用户在屏幕边缘选择文本时，结果卡片可能会超出视口边界，导致部分内容不可见。

### 解决方案

使用 `useEffect` 监听卡片位置和尺寸变化，自动调整位置：

```typescript
useEffect(() => {
  if (!cardRef.current) return

  const card = cardRef.current
  const cardRect = card.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let newX = position.x
  let newY = position.y + 20 // 默认在选中文本下方

  // 水平方向调整
  if (newX + cardRect.width / 2 > viewportWidth - 20) {
    // 右侧超出，向左调整
    newX = viewportWidth - cardRect.width / 2 - 20
  } else if (newX - cardRect.width / 2 < 20) {
    // 左侧超出，向右调整
    newX = cardRect.width / 2 + 20
  }

  // 垂直方向调整
  if (newY + cardRect.height > viewportHeight - 20) {
    // 下方超出，显示在选中文本上方
    newY = position.y - cardRect.height - 20
    
    // 如果上方也超出，则固定在顶部
    if (newY < 20) {
      newY = 20
    }
  }

  setAdjustedPosition({ x: newX, y: newY })
}, [position, expanded])
```

### 调整策略

#### 水平方向

1. **默认位置**：居中对齐选中文本（`position.x`）
2. **右侧超出**：向左调整，保持 20px 边距
3. **左侧超出**：向右调整，保持 20px 边距

#### 垂直方向

1. **默认位置**：选中文本下方 20px
2. **下方超出**：显示在选中文本上方
3. **上下都超出**：固定在顶部 20px

### 边距设置

- 所有方向保持 20px 安全边距
- 确保卡片完全可见
- 避免遮挡浏览器 UI

## 2. 拖拽移动

### 功能特点

- **拖拽区域**：只能在头部区域拖拽
- **视觉反馈**：拖拽时显示 `grabbing` 光标
- **阴影增强**：拖拽时阴影加深，提供深度感
- **流畅体验**：禁用过渡动画，实时跟随鼠标

### 实现原理

#### 1. 拖拽开始（mousedown）

```typescript
const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  // 只允许在头部拖拽
  if (!(e.target as HTMLElement).closest('.smartread-result-header')) {
    return
  }
  
  // 不允许在按钮上拖拽
  if ((e.target as HTMLElement).closest('.smartread-result-action-btn')) {
    return
  }

  setIsDragging(true)
  const cardRect = cardRef.current!.getBoundingClientRect()
  setDragOffset({
    x: e.clientX - cardRect.left - cardRect.width / 2,
    y: e.clientY - cardRect.top,
  })
  
  // 阻止文本选择
  e.preventDefault()
}
```

**关键点**：
- 检查点击位置是否在头部
- 排除按钮区域
- 计算鼠标相对卡片的偏移量
- 阻止默认行为（文本选择）

#### 2. 拖拽中（mousemove）

```typescript
useEffect(() => {
  if (!isDragging) return

  const handleMouseMove = (e: MouseEvent) => {
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    setAdjustedPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  return () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
}, [isDragging, dragOffset])
```

**关键点**：
- 在 `document` 上监听事件（全局）
- 实时更新卡片位置
- 鼠标释放时结束拖拽
- 清理事件监听器

#### 3. 视觉反馈

```typescript
<div
  ref={cardRef}
  className={`smartread-result-card ${isDragging ? 'smartread-dragging' : ''}`}
  style={{
    left: `${adjustedPosition.x}px`,
    top: `${adjustedPosition.y}px`,
    cursor: isDragging ? 'grabbing' : 'default',
  }}
  onMouseDown={handleMouseDown}
>
  <div 
    className="smartread-result-header"
    style={{ cursor: 'grab' }}
  >
```

**样式变化**：
```css
.smartread-result-card.smartread-dragging {
  transition: none;  /* 禁用过渡动画 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25),  /* 阴影加深 */
              0 0 0 1px rgba(255, 255, 255, 0.4) inset;
}

.smartread-result-header {
  cursor: grab;  /* 默认显示抓手 */
  user-select: none;  /* 禁止选择文本 */
}
```

### 用户体验优化

#### 1. 光标变化

- **头部区域**：`cursor: grab`（可抓取）
- **拖拽中**：`cursor: grabbing`（抓取中）
- **内容区域**：`cursor: default`（默认）

#### 2. 文本选择

- **头部区域**：`user-select: none`（禁止选择）
- **内容区域**：`user-select: text`（允许选择）

#### 3. 视觉反馈

- **拖拽时**：阴影加深，提供深度感
- **拖拽时**：禁用过渡动画，实时跟随
- **释放后**：恢复正常阴影

## 3. 技术细节

### 状态管理

```typescript
const [adjustedPosition, setAdjustedPosition] = useState(position)
const [isDragging, setIsDragging] = useState(false)
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
const cardRef = useRef<HTMLDivElement>(null)
```

- `adjustedPosition`: 调整后的位置（智能定位 + 拖拽）
- `isDragging`: 是否正在拖拽
- `dragOffset`: 鼠标相对卡片的偏移量
- `cardRef`: 卡片 DOM 引用

### 依赖关系

```typescript
useEffect(() => {
  // 智能定位
}, [position, expanded])

useEffect(() => {
  // 拖拽监听
}, [isDragging, dragOffset])
```

- 智能定位依赖：初始位置、展开状态
- 拖拽监听依赖：拖拽状态、偏移量

### 性能优化

1. **条件渲染**：只在拖拽时添加事件监听器
2. **事件清理**：useEffect 返回清理函数
3. **禁用动画**：拖拽时禁用 transition
4. **防抖节流**：无需防抖，原生事件已优化

## 4. 使用场景

### 场景 1: 屏幕右侧选择文本

**问题**：卡片右侧超出屏幕
**解决**：自动向左调整，保持 20px 边距

### 场景 2: 屏幕底部选择文本

**问题**：卡片下方超出屏幕
**解决**：显示在选中文本上方

### 场景 3: 屏幕左上角选择文本

**问题**：卡片上方和左侧都超出
**解决**：固定在左上角（20px, 20px）

### 场景 4: 用户想调整卡片位置

**操作**：拖动头部区域
**效果**：卡片跟随鼠标移动

### 场景 5: 用户想选择卡片内容

**操作**：在内容区域选择文本
**效果**：正常选择，不触发拖拽

## 5. 测试清单

### 智能定位测试

- [ ] 在屏幕中央选择文本 → 卡片居中显示
- [ ] 在屏幕右侧选择文本 → 卡片向左调整
- [ ] 在屏幕左侧选择文本 → 卡片向右调整
- [ ] 在屏幕底部选择文本 → 卡片显示在上方
- [ ] 在屏幕顶部选择文本 → 卡片显示在下方
- [ ] 在屏幕角落选择文本 → 卡片完全可见

### 拖拽功能测试

- [ ] 拖动头部区域 → 卡片跟随移动
- [ ] 拖动标题文字 → 卡片跟随移动
- [ ] 点击展开/关闭按钮 → 不触发拖拽
- [ ] 在内容区域选择文本 → 不触发拖拽
- [ ] 拖拽到屏幕边缘 → 可以超出边界
- [ ] 释放鼠标 → 停止拖拽

### 交互测试

- [ ] 拖拽时光标变为 grabbing
- [ ] 头部区域光标为 grab
- [ ] 内容区域可以选择文本
- [ ] 拖拽时阴影加深
- [ ] 释放后阴影恢复

## 6. 已知限制

### 限制 1: 拖拽后不再自动调整

**原因**：用户拖拽后，位置由用户控制
**影响**：窗口大小改变时，卡片可能超出边界
**解决**：用户可以重新拖拽调整

### 限制 2: 移动端支持

**状态**：当前仅支持鼠标拖拽
**影响**：触摸设备无法拖拽
**计划**：未来添加触摸事件支持

### 限制 3: 多显示器

**状态**：基于当前视口计算
**影响**：在多显示器环境下可能不准确
**解决**：使用 `window.innerWidth/Height`

## 7. 未来改进

### 改进 1: 记住位置

```typescript
// 保存用户拖拽的位置
localStorage.setItem('resultCardPosition', JSON.stringify(position))

// 下次打开时恢复
const savedPosition = localStorage.getItem('resultCardPosition')
```

### 改进 2: 磁吸效果

```typescript
// 拖拽到边缘时自动吸附
if (newX < 50) newX = 20
if (newY < 50) newY = 20
```

### 改进 3: 触摸支持

```typescript
// 添加触摸事件
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
```

### 改进 4: 动画优化

```typescript
// 释放后平滑回弹到边界内
if (newX < 0) {
  animate(newX, 20, 300) // 300ms 动画
}
```

## 8. 代码示例

### 完整的拖拽实现

```typescript
export const ResultCard: React.FC<ResultCardProps> = ({ position, ... }) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // 智能定位
  useEffect(() => {
    if (!cardRef.current) return
    const card = cardRef.current
    const cardRect = card.getBoundingClientRect()
    // ... 调整逻辑
    setAdjustedPosition({ x: newX, y: newY })
  }, [position, expanded])

  // 拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!e.target.closest('.smartread-result-header')) return
    if (e.target.closest('.smartread-result-action-btn')) return
    
    setIsDragging(true)
    const cardRect = cardRef.current!.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - cardRect.left - cardRect.width / 2,
      y: e.clientY - cardRect.top,
    })
    e.preventDefault()
  }

  // 拖拽监听
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setAdjustedPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={cardRef}
      className={`smartread-result-card ${isDragging ? 'smartread-dragging' : ''}`}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="smartread-result-header" style={{ cursor: 'grab' }}>
        {/* 头部内容 */}
      </div>
      <div className="smartread-result-body" style={{ userSelect: 'text' }}>
        {/* 内容区域 */}
      </div>
    </div>
  )
}
```

## 9. 相关文档

- [毛玻璃效果设计](./GLASSMORPHISM_DESIGN.md)
- [Shadow DOM 选择修复](./SHADOW_DOM_SELECTION_FIX.md)
- [UI Demo 完成总结](./DEMO_COMPLETION_SUMMARY.md)

## 10. 更新日志

**2026-01-28**:
- ✅ 实现智能定位功能
- ✅ 实现拖拽移动功能
- ✅ 添加视觉反馈（光标、阴影）
- ✅ 优化用户体验（文本选择、按钮排除）
- ✅ 创建技术文档

---

**核心功能**: 智能定位、拖拽移动、边界检测、用户体验优化

**技术栈**: React Hooks, useEffect, useRef, useState, DOM API
