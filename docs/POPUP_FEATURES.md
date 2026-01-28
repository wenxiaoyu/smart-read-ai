# Popup 弹窗功能说明

## 功能概述

智阅 AI 的 Popup 弹窗提供了快速访问核心功能的界面，包括：
1. **知识检索** - 搜索已保存的知识节点
2. **Token 统计** - 查看 AI 使用情况
3. **快速设置** - 切换主题等常用设置

## 界面布局

### 1. 头部区域

**Logo 和标题**：
- 📖 图标 + "智阅 AI" 渐变文字
- 渐变色：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

**设置按钮**：
- ⚙️ 图标
- 点击打开 Options 设置页
- Hover 效果：放大 + 背景加深

### 2. 搜索区域

**搜索输入框**：
- 🔍 搜索图标
- 占位符："搜索知识库..."
- 实时搜索（输入 2 个字符后触发）
- × 清除按钮（有内容时显示）

**搜索结果列表**：
- 最多显示所有匹配结果
- 最大高度 300px，超出滚动
- 每个结果包含：
  - 类型图标（📖 术语 / 💡 结论）
  - 标题（粗体）
  - 摘要（前 60 字符）
  - 标签（彩色标签）

**无结果提示**：
- 🔍 大图标（半透明）
- "未找到相关知识" 提示文字

### 3. Token 统计区域

**统计数字**：
- 已使用 / 总额度
- 使用百分比
- 大号数字 + 渐变色

**进度条**：
- 渐变填充：`linear-gradient(90deg, #667eea 0%, #764ba2 100%)`
- 高度 8px，圆角 4px
- 平滑动画过渡

**详细统计**：
- 今日使用
- 本月使用
- 小号标签 + 大号数字

### 4. 快速设置区域

**主题切换**：
- 三个按钮：☀️ 浅色 / 🌙 暗黑 / 🔄 自动
- 当前主题高亮（渐变背景 + 白色文字）
- Hover 效果：上浮 2px

### 5. 底部信息

**版本和链接**：
- "智阅 AI v0.1.1"
- "完整设置" 链接（点击打开 Options）

## 毛玻璃效果

### 整体容器
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px) saturate(180%);
```

### 各区域背景
- 头部：`rgba(255, 255, 255, 0.5)` + `blur(10px)`
- Token 区域：`rgba(255, 255, 255, 0.3)` + `blur(10px)`
- 底部：`rgba(255, 255, 255, 0.3)` + `blur(10px)`

### 暗黑模式
- 整体：`rgba(30, 30, 30, 0.95)`
- 头部：`rgba(40, 40, 40, 0.5)`
- 其他区域：相应调整透明度

## 交互功能

### 1. 知识搜索

**触发条件**：
- 输入 2 个或更多字符
- 实时搜索，无需按回车

**搜索逻辑**：
```typescript
const results = mockKnowledgeNodes.filter(node =>
  node.content.toLowerCase().includes(query.toLowerCase()) ||
  (node.explanation && node.explanation.toLowerCase().includes(query.toLowerCase())) ||
  node.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
)
```

**匹配范围**：
- 内容标题
- 解释说明
- 标签

### 2. Token 统计

**数据来源**：
- `mockTokenUsage` Mock 数据
- 实际应用中从 `chrome.storage` 读取

**计算逻辑**：
```typescript
// 使用百分比
const tokenPercentage = tokenUsage.percentage

// 今日使用（24小时内）
const todayUsed = tokenUsage.history
  .filter(h => Date.now() - h.timestamp < 86400000)
  .reduce((sum, h) => sum + h.tokens, 0)

// 本月使用
const monthUsed = tokenUsage.totalTokens
```

### 3. 主题切换

**保存设置**：
```typescript
const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
  setTheme(newTheme)
  chrome.storage.local.set({ theme: newTheme })
}
```

**加载设置**：
```typescript
useEffect(() => {
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme && typeof result.theme === 'string') {
      setTheme(result.theme as 'light' | 'dark' | 'auto')
    }
  })
}, [])
```

### 4. 打开设置页

```typescript
const handleOpenOptions = () => {
  chrome.runtime.openOptionsPage()
}
```

## 尺寸规范

### 容器尺寸
- 宽度：380px
- 最小高度：500px
- 自适应内容高度

### 内边距
- 头部：20px
- 搜索区域：20px
- Token 区域：20px
- 快速设置：20px
- 底部：16px 20px

### 间距
- 区域间距：通过 border 分隔
- 元素间距：8px - 16px

## 响应式设计

### 小屏幕优化
虽然 Popup 尺寸固定，但内容会自适应：
- 搜索结果列表滚动
- 文字自动换行
- 标签自动换行

### 暗黑模式
- 自动检测系统主题
- 用户可手动切换
- 所有颜色自动适配

## 性能优化

### 1. 搜索防抖
当前实现：实时搜索
建议优化：添加 300ms 防抖

```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    // 搜索逻辑
  }, 300),
  []
)
```

### 2. 虚拟滚动
当前实现：渲染所有结果
建议优化：结果超过 50 条时使用虚拟滚动

### 3. 缓存搜索结果
当前实现：每次重新搜索
建议优化：缓存最近的搜索结果

## 使用场景

### 场景 1: 快速查找知识

1. 点击扩展图标打开 Popup
2. 在搜索框输入关键词
3. 查看搜索结果
4. 点击结果查看详情（未来功能）

### 场景 2: 查看 Token 使用

1. 打开 Popup
2. 查看 Token 统计区域
3. 了解今日/本月使用情况
4. 判断是否需要充值

### 场景 3: 切换主题

1. 打开 Popup
2. 滚动到快速设置区域
3. 点击主题按钮
4. 主题立即生效

### 场景 4: 打开完整设置

1. 打开 Popup
2. 点击头部的 ⚙️ 按钮
3. 或点击底部的"完整设置"链接
4. 打开 Options 设置页

## 技术实现

### 状态管理

```typescript
const [searchQuery, setSearchQuery] = useState('')
const [searchResults, setSearchResults] = useState<typeof mockKnowledgeNodes>([])
const [tokenUsage, setTokenUsage] = useState(mockTokenUsage)
const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')
```

### Chrome API 使用

**Storage API**：
```typescript
// 读取
chrome.storage.local.get(['theme'], (result) => {
  setTheme(result.theme)
})

// 写入
chrome.storage.local.set({ theme: newTheme })
```

**Runtime API**：
```typescript
// 打开设置页
chrome.runtime.openOptionsPage()
```

### Mock 数据集成

```typescript
import { mockKnowledgeNodes, mockTokenUsage } from '../mock/knowledge-data'
```

## 未来改进

### 1. 点击搜索结果

**功能**：点击搜索结果打开详情弹窗
**实现**：
```typescript
const handleResultClick = (node: KnowledgeNode) => {
  // 显示详情模态框
  setSelectedNode(node)
  setShowDetail(true)
}
```

### 2. 搜索历史

**功能**：记录最近的搜索关键词
**实现**：
```typescript
const [searchHistory, setSearchHistory] = useState<string[]>([])

// 保存到 storage
chrome.storage.local.set({ searchHistory })
```

### 3. 快捷键

**功能**：使用快捷键打开 Popup
**实现**：在 `manifest.json` 中配置
```json
{
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+S"
      }
    }
  }
}
```

### 4. 统计图表

**功能**：显示 Token 使用趋势图
**实现**：使用 Chart.js 或 Recharts

### 5. 通知提示

**功能**：Token 即将用完时提醒
**实现**：
```typescript
if (tokenPercentage > 90) {
  // 显示警告提示
}
```

## 测试清单

### 功能测试

- [ ] 搜索功能正常工作
- [ ] 搜索结果正确显示
- [ ] 清除按钮正常工作
- [ ] Token 统计正确显示
- [ ] 进度条正确显示
- [ ] 主题切换正常工作
- [ ] 设置按钮打开 Options
- [ ] 底部链接打开 Options

### 样式测试

- [ ] 毛玻璃效果正确显示
- [ ] 暗黑模式正确适配
- [ ] 所有按钮 Hover 效果正常
- [ ] 滚动条样式正确
- [ ] 文字颜色对比度足够

### 兼容性测试

- [ ] Chrome 最新版本
- [ ] Edge 最新版本
- [ ] 不同屏幕分辨率
- [ ] 不同系统主题

## 构建结果

```
✓ TypeScript 编译成功
✓ Vite 构建成功
✓ Popup Script: 6.21 kB (gzip: 2.40 kB)
✓ Popup CSS: 6.36 kB (gzip: 1.68 kB)
✓ 无错误、无警告
```

## 相关文档

- [毛玻璃效果设计](./GLASSMORPHISM_DESIGN.md)
- [UI Demo 完成总结](./DEMO_COMPLETION_SUMMARY.md)
- [Mock 数据说明](../src/mock/knowledge-data.ts)

## 更新日志

**2026-01-28**:
- ✅ 创建 Popup 页面结构
- ✅ 实现知识检索功能
- ✅ 实现 Token 统计展示
- ✅ 实现进度条组件
- ✅ 实现快速设置面板
- ✅ 实现主题切换功能
- ✅ 实现毛玻璃效果
- ✅ 实现暗黑模式适配
- ✅ 创建技术文档

---

**核心功能**: 知识检索、Token 统计、主题切换、快速访问

**技术栈**: React, TypeScript, Chrome Extension API, CSS Glassmorphism
