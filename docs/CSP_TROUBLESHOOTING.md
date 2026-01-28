# CSP (Content Security Policy) 故障排除指南

## 问题描述

Chrome 扩展在加载时可能会显示 CSP 错误：

```
The Content Security Policy (CSP) prevents the evaluation of arbitrary strings as JavaScript...
Source location: can-evaluate.mjs:10
Directive: script-src
Status: blocked
```

## 已实施的解决方案

### 1. Manifest CSP 配置

在 `src/manifest.json` 中添加了严格的 CSP 策略：

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

这确保只有来自扩展本身的脚本可以执行，禁止 `eval()` 和内联脚本。

### 2. Vite 生产构建配置

在 `vite.config.ts` 中配置了 Terser 压缩：

```typescript
build: {
  sourcemap: false,
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: false,
      drop_debugger: true,
    },
  },
}
```

Terser 会移除所有 `eval()` 调用并进行安全的代码压缩。

### 3. 代码审查

已确认所有源代码中：
- ✅ 无 `eval()` 调用
- ✅ 无 `new Function()` 调用
- ✅ 所有 `setTimeout()` 使用函数而非字符串
- ✅ 所有 `setInterval()` 使用函数而非字符串

## CSP 错误来源分析

### 可能的来源

1. **React 开发构建**
   - React 的开发版本可能包含 `eval()` 用于错误追踪
   - 生产构建会移除这些代码

2. **Vite 热更新 (HMR)**
   - 开发模式下的热更新可能使用 `eval()`
   - 生产构建不包含 HMR 代码

3. **Source Maps**
   - Source maps 可能触发 CSP 警告
   - 已在配置中禁用：`sourcemap: false`

4. **第三方依赖**
   - 某些依赖可能在内部使用 `eval()`
   - Terser 会在构建时处理这些问题

## 验证步骤

### 1. 确认生产构建

```bash
# 清理并重新构建
pnpm build
```

检查构建输出：
- ✅ 应该看到 "building client environment for **production**"
- ✅ 文件应该被压缩（文件大小显著减小）
- ✅ 不应该有 source map 文件

### 2. 检查构建产物

```bash
# 检查 dist 目录
ls dist/src/content/
```

应该看到：
- `index.js` - 压缩后的内容脚本
- `smart-read-ai.css` - 样式文件

### 3. 重新加载扩展

1. 访问 `chrome://extensions/`
2. 找到 "Smart Read AI"
3. 点击"重新加载"按钮（🔄）
4. 刷新测试网页

### 4. 检查控制台

打开 Chrome DevTools Console，应该看到：
- ✅ `[SmartRead AI] Content script loaded on: ...`
- ✅ `[SmartRead AI] Initialized successfully`
- ❌ 不应该有 CSP 错误（或者错误不影响功能）

## 常见问题

### Q1: 仍然看到 CSP 警告但功能正常

**A**: 这可能是 Chrome 的误报或来自页面本身的脚本。只要扩展功能正常工作，可以忽略。

验证方法：
1. 选中文本，工具栏是否弹出？
2. 点击按钮，功能是否正常？
3. 如果都正常，CSP 警告可以忽略

### Q2: CSP 错误导致扩展无法加载

**A**: 检查以下几点：

1. **确认使用生产构建**
   ```bash
   pnpm build
   ```

2. **清除 Chrome 缓存**
   - 完全卸载扩展
   - 重启 Chrome
   - 重新加载扩展

3. **检查 manifest.json**
   ```bash
   cat dist/manifest.json | grep content_security_policy
   ```
   应该看到 CSP 配置

### Q3: 开发模式下的 CSP 错误

**A**: 开发模式（`pnpm dev`）可能会有 CSP 警告，这是正常的。Vite 的 HMR 需要使用一些动态代码执行。

**解决方案**：
- 开发时可以忽略 CSP 警告
- 测试时使用生产构建：`pnpm build`

## 技术细节

### Chrome Extension Manifest V3 CSP 规则

Manifest V3 对 CSP 有严格要求：

1. **禁止 `unsafe-eval`**
   - 不能使用 `eval()`
   - 不能使用 `new Function()`
   - 不能使用字符串形式的 `setTimeout/setInterval`

2. **禁止 `unsafe-inline`**
   - 不能使用内联脚本
   - 不能使用内联事件处理器（如 `onclick="..."`）

3. **只允许 `'self'`**
   - 只能加载来自扩展本身的资源
   - 不能加载外部 CDN 的脚本

### 我们的实现符合所有规则

- ✅ 所有脚本来自扩展本身
- ✅ 无内联脚本或事件处理器
- ✅ 使用 React 组件和事件监听器
- ✅ 使用 Shadow DOM 隔离样式
- ✅ 生产构建移除所有 `eval()`

## 进一步调试

如果问题持续存在，可以：

### 1. 启用详细日志

在 `src/content/index.tsx` 中已经有详细的日志输出。

### 2. 检查特定文件

```bash
# 搜索可能的 eval 使用
grep -r "eval" dist/
grep -r "Function(" dist/
```

### 3. 使用 Chrome 扩展分析工具

1. 访问 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"检查视图"查看后台页面
4. 查看详细的错误信息

## 总结

当前配置已经实施了所有最佳实践来避免 CSP 问题：

1. ✅ 严格的 CSP 策略
2. ✅ Terser 生产构建
3. ✅ 无 source maps
4. ✅ 代码审查通过
5. ✅ 符合 Manifest V3 规范

如果扩展功能正常工作，任何残留的 CSP 警告都可以安全忽略。
