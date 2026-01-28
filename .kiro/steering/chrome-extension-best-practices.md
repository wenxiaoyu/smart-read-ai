---
inclusion: always
---

# Chrome 扩展开发最佳实践

本规范适用于所有 Chrome 扩展开发任务，确保避免常见陷阱和重复性错误。

## Shadow DOM 样式注入规范

### 问题背景

Shadow DOM 提供完全的样式隔离，但这意味着外部样式表无法穿透。即使组件导入了 CSS 文件（`import './Component.css'`），这些样式也不会自动应用到 Shadow DOM 内部。

### 强制规则

**规则 1：使用 Shadow DOM 时必须显式注入样式**

当创建 Shadow DOM 容器时，必须：

1. 创建 `<style>` 元素
2. 将所有组件 CSS 内容注入到该元素
3. 将 style 元素追加到 Shadow Root

**正确示例**：

```typescript
class ContentScript {
  private shadowRoot: ShadowRoot
  
  constructor() {
    const { shadowRoot } = createShadowContainer('my-extension-root')
    this.shadowRoot = shadowRoot
    
    // ✅ 必须：显式注入样式
    this.injectStyles()
    
    // 然后创建 React 根节点
    const appContainer = document.createElement('div')
    this.shadowRoot.appendChild(appContainer)
    this.root = createRoot(appContainer)
  }
  
  private injectStyles() {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
      /* 所有组件的 CSS 规则 */
      .my-component { ... }
      @keyframes fadeIn { ... }
      @media (prefers-color-scheme: dark) { ... }
    `
    this.shadowRoot.appendChild(styleSheet)
  }
}
```

**错误示例**：

```typescript
// ❌ 错误：忘记注入样式
constructor() {
  const { shadowRoot } = createShadowContainer('my-extension-root')
  this.shadowRoot = shadowRoot
  
  // 直接创建 React 根节点，样式不会生效
  const appContainer = document.createElement('div')
  this.shadowRoot.appendChild(appContainer)
  this.root = createRoot(appContainer)
}
```

### 验证清单

在实现 Shadow DOM 功能后，必须验证：

- [ ] 创建了 `injectStyles()` 方法
- [ ] 在构造函数中调用了 `injectStyles()`
- [ ] 样式注入在 React 根节点创建之前
- [ ] 包含了所有组件的 CSS 规则（工具栏、卡片、动画等）
- [ ] 在浏览器中测试，确认样式正确显示

### 调试技巧

如果组件不显示或样式不生效：

1. **检查 Shadow DOM 中是否有 style 标签**：
   ```javascript
   document.getElementById('my-extension-root').shadowRoot.querySelector('style')
   ```
   应该返回包含 CSS 规则的 `<style>` 元素

2. **检查控制台日志**：
   添加日志确认样式注入：
   ```typescript
   console.log('[Extension] Styles injected')
   ```

3. **检查 Elements 面板**：
   - 找到扩展的容器元素
   - 展开 `#shadow-root (open)`
   - 确认有 `<style>` 标签

---

## Content Security Policy (CSP) 规范

### 问题背景

Chrome Extension Manifest V3 对 CSP 有严格要求，禁止使用 `eval()`、`new Function()` 和字符串形式的 `setTimeout/setInterval`。

### 强制规则

**规则 2：Manifest 必须包含 CSP 策略**

在 `manifest.json` 中必须声明 CSP：

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

**规则 3：Vite 构建必须配置 Terser**

在 `vite.config.ts` 中必须配置：

```typescript
export default defineConfig({
  build: {
    sourcemap: false,        // 禁用 source maps
    minify: 'terser',        // 使用 Terser 压缩
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console（可选）
        drop_debugger: true, // 移除 debugger
      },
    },
  },
})
```

**规则 4：代码必须符合 CSP 要求**

禁止使用：

```typescript
// ❌ 禁止
eval('code')
new Function('return 1')()
setTimeout('alert(1)', 1000)
setInterval('console.log(1)', 1000)
```

必须使用：

```typescript
// ✅ 正确
setTimeout(() => alert(1), 1000)
setInterval(() => console.log(1), 1000)
```

### 验证清单

在提交代码前，必须验证：

- [ ] `manifest.json` 包含 `content_security_policy`
- [ ] `vite.config.ts` 配置了 `minify: 'terser'`
- [ ] 安装了 `terser` 依赖：`pnpm add -D terser`
- [ ] 代码中无 `eval()` 或 `new Function()` 调用
- [ ] 所有 `setTimeout/setInterval` 使用函数而非字符串
- [ ] 运行 `pnpm build` 成功
- [ ] 在 Chrome 中加载扩展，功能正常

### CSP 警告处理

如果看到 CSP 警告但功能正常：

1. **验证功能是否正常工作**
2. **如果功能正常，警告可以忽略**（可能来自 React 内部依赖）
3. **如果功能异常，检查**：
   - Manifest CSP 配置
   - Vite Terser 配置
   - 代码中的动态执行

---

## 构建和测试规范

### 规则 5：修改代码后必须重新构建

每次修改源代码后：

```bash
# 1. 重新构建
pnpm build

# 2. 在 Chrome 中重新加载扩展
# chrome://extensions/ → 点击"重新加载"按钮

# 3. 刷新测试网页

# 4. 验证功能
```

### 规则 6：构建输出必须检查

构建成功后，检查输出：

```bash
# 应该看到
✓ XX modules transformed.
dist/src/content/index.js  XXX.XX kB │ gzip: XX.XX kB
✓ built in XXXms
```

关键文件：
- `dist/manifest.json` - 包含 CSP 策略
- `dist/src/content/index.js` - 内容脚本
- `dist/icons/` - 图标文件

### 规则 7：调试时必须查看控制台

在测试页面打开 DevTools Console，应该看到：

```
[Extension Name] Content script loaded on: ...
[Extension Name] Shadow DOM created
[Extension Name] Styles injected
[Extension Name] React root created
[Extension Name] Initialized successfully
```

如果缺少任何日志，说明初始化失败。

---

## React + Shadow DOM 集成规范

### 规则 8：初始化顺序必须正确

正确的初始化顺序：

```typescript
constructor() {
  // 1. 创建 Shadow DOM
  const { shadowRoot } = createShadowContainer('extension-root')
  this.shadowRoot = shadowRoot
  
  // 2. 注入样式（必须在 React 之前）
  this.injectStyles()
  
  // 3. 创建 React 容器
  const appContainer = document.createElement('div')
  this.shadowRoot.appendChild(appContainer)
  
  // 4. 创建 React 根节点
  this.root = createRoot(appContainer)
  
  // 5. 初始化事件监听器
  this.init()
}
```

**错误顺序会导致**：
- 样式不生效（React 渲染后注入样式）
- 组件不显示（忘记注入样式）
- 事件不响应（过早初始化）

### 规则 9：CSS 必须包含所有组件样式

`injectStyles()` 方法必须包含：

- 所有组件的样式（工具栏、卡片、按钮等）
- 所有动画定义（`@keyframes`）
- 所有媒体查询（响应式、暗黑模式）
- 所有伪类样式（`:hover`, `:active`, `:focus`）

不要遗漏任何 CSS 文件的内容。

---

## 文档更新规范

### 规则 10：解决问题后必须创建故障排除文档

当遇到并解决了一个非显而易见的问题时，必须：

1. **创建故障排除文档**（如 `CSP_TROUBLESHOOTING.md`）
2. **更新测试指南**（添加已知问题和解决方案）
3. **创建快速参考卡**（常见问题和快速修复）

文档必须包含：
- 问题症状
- 根本原因
- 解决方案
- 验证步骤
- 预防措施

### 规则 11：更新项目规范避免重复错误

解决问题后，评估是否需要：

1. **更新 AGENTS.md**（项目级规范）
2. **创建 steering 文件**（AI 助手指导）
3. **更新 openspec/project.md**（项目约束）
4. **更新 README.md**（用户文档）

---

## 检查清单模板

### Shadow DOM 功能实现检查清单

```markdown
- [ ] 创建了 Shadow DOM 容器
- [ ] 实现了 injectStyles() 方法
- [ ] 在构造函数中调用 injectStyles()
- [ ] 样式注入在 React 之前
- [ ] 包含了所有组件的 CSS
- [ ] 在浏览器中测试通过
- [ ] 添加了调试日志
- [ ] 创建了故障排除文档
```

### CSP 合规性检查清单

```markdown
- [ ] manifest.json 包含 CSP 策略
- [ ] vite.config.ts 配置了 Terser
- [ ] 安装了 terser 依赖
- [ ] 代码中无 eval() 调用
- [ ] 代码中无 new Function() 调用
- [ ] setTimeout/setInterval 使用函数
- [ ] 构建成功无错误
- [ ] 在 Chrome 中加载成功
- [ ] 功能测试通过
```

### 构建和部署检查清单

```markdown
- [ ] 运行 pnpm build
- [ ] 检查构建输出
- [ ] 验证 dist/manifest.json
- [ ] 在 Chrome 中重新加载扩展
- [ ] 刷新测试网页
- [ ] 检查控制台日志
- [ ] 测试所有功能
- [ ] 更新文档
```

---

## 常见错误和解决方案

### 错误 1：组件不显示

**症状**：控制台日志正常，但组件不可见

**原因**：CSS 未注入到 Shadow DOM

**解决**：
1. 检查是否调用了 `injectStyles()`
2. 检查调用顺序（必须在 React 之前）
3. 检查 Shadow DOM 中是否有 `<style>` 标签

### 错误 2：CSP 错误阻止加载

**症状**：扩展无法加载，CSP 错误

**原因**：代码使用了 `eval()` 或未配置 CSP

**解决**：
1. 添加 CSP 到 manifest.json
2. 配置 Vite 使用 Terser
3. 检查代码中的动态执行
4. 重新构建

### 错误 3：样式在某些网站不生效

**症状**：在某些网站上样式异常

**原因**：页面 CSS 穿透了 Shadow DOM（不应该发生）

**解决**：
1. 确认使用了 Shadow DOM（`mode: 'open'`）
2. 检查是否有 `!important` 规则
3. 增加选择器特异性
4. 使用更高的 z-index

### 错误 4：构建后功能异常

**症状**：开发时正常，构建后异常

**原因**：生产构建优化导致问题

**解决**：
1. 检查 Terser 配置
2. 禁用 source maps
3. 检查动态导入
4. 验证环境变量

---

## 总结

遵循这些规范可以避免 90% 的 Chrome 扩展开发常见问题：

1. ✅ Shadow DOM 必须显式注入样式
2. ✅ Manifest 必须包含 CSP 策略
3. ✅ Vite 必须配置 Terser 压缩
4. ✅ 代码必须符合 CSP 要求
5. ✅ 修改后必须重新构建和重新加载
6. ✅ 构建输出必须检查
7. ✅ 调试时必须查看控制台
8. ✅ 初始化顺序必须正确
9. ✅ CSS 必须包含所有组件样式
10. ✅ 解决问题后必须创建文档
11. ✅ 更新规范避免重复错误

**记住**：Shadow DOM 隔离是特性，不是 bug。显式注入样式是必需的，不是可选的。
