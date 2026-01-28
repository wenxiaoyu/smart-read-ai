# 快速修复参考卡

## 🔧 问题：工具栏不显示

### 症状
选中文本后，控制台有日志但看不到工具栏

### 解决方案
已修复！CSS 现在会自动注入到 Shadow DOM。

### 验证步骤
```bash
# 1. 重新构建
pnpm build

# 2. 在 Chrome 中重新加载扩展
# chrome://extensions/ → 点击"重新加载"按钮

# 3. 刷新测试网页

# 4. 选中 5+ 字符的文本
# 应该看到渐变紫色的工具栏弹出
```

---

## ⚠️ 问题：CSP 警告

### 症状
```
The Content Security Policy (CSP) prevents the evaluation...
```

### 这是正常的！
- 某些 React 依赖可能触发 CSP 检测
- 只要功能正常工作，可以安全忽略
- 我们已经配置了严格的 CSP 策略和 Terser 压缩

### 验证功能是否正常
1. ✅ 选中文本，工具栏弹出？
2. ✅ 点击按钮，有响应？
3. ✅ AI 解析功能正常？

如果都正常，CSP 警告不影响使用。

详细信息：[CSP 故障排除指南](./CSP_TROUBLESHOOTING.md)

---

## 🚀 快速测试流程

### 1. 构建扩展
```bash
pnpm build
```

### 2. 加载到 Chrome
1. 访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 文件夹
5. **重要**：如果已加载，点击"重新加载"按钮

### 3. 测试功能
1. 访问任意网页（推荐：https://github.com/facebook/react）
2. 选中至少 5 个字符
3. 观察工具栏弹出
4. 点击"简化"或"解释"按钮
5. 查看结果卡片

### 4. 预期效果
- ✅ 渐变紫色工具栏
- ✅ 白色按钮，hover 时放大
- ✅ 流畅的淡入动画
- ✅ 3 秒后自动隐藏
- ✅ AI 结果卡片正常显示

---

## 📊 构建输出检查

### 正常输出应该包含
```
✓ 32 modules transformed.
dist/smart-read-ai.css       5.85 kB │ gzip:  1.56 kB
dist/src/content/index.js  212.65 kB │ gzip: 67.23 kB
✓ built in XXXms
```

### 关键文件
- `dist/manifest.json` - 包含 CSP 策略
- `dist/src/content/index.js` - 内容脚本（包含内联 CSS）
- `dist/smart-read-ai.css` - 样式文件
- `dist/icons/` - 图标文件

---

## 🐛 调试技巧

### 查看控制台日志
1. 右键网页 → 检查 → Console
2. 应该看到：
   ```
   [SmartRead AI] Content script loaded on: ...
   [SmartRead AI] Shadow DOM created
   [SmartRead AI] Styles injected
   [SmartRead AI] React root created
   [SmartRead AI] Initialized successfully
   ```

### 检查 Shadow DOM
1. 右键网页 → 检查 → Elements
2. 搜索 `smartread-ai-root`
3. 展开 `#shadow-root (open)`
4. 应该看到 `<style>` 标签和 React 组件

### 检查样式注入
在控制台运行：
```javascript
document.getElementById('smartread-ai-root').shadowRoot.querySelector('style')
```
应该返回 `<style>` 元素，包含所有 CSS 规则。

---

## 📚 相关文档

- [UI Demo 测试指南](./DEMO_TEST_GUIDE.md) - 完整测试步骤
- [CSP 故障排除指南](./CSP_TROUBLESHOOTING.md) - CSP 问题详解
- [调试会话总结](./DEBUG_SESSION_SUMMARY.md) - 技术细节
- [Demo 完成总结](./DEMO_COMPLETION_SUMMARY.md) - 功能清单

---

## 💡 常见问题

### Q: 工具栏位置不对？
A: 检查 `getSelectionPosition()` 返回的坐标。工具栏应该在选中文本上方 60px。

### Q: 样式不生效？
A: 确认 `injectStyles()` 被调用，检查控制台是否有 "Styles injected" 日志。

### Q: 动画不流畅？
A: 检查 GPU 加速是否启用，确认 CSS 动画使用 `transform` 而非 `top/left`。

### Q: 跨网站样式不一致？
A: Shadow DOM 应该完全隔离样式。如果有问题，检查是否有 `!important` 规则穿透。

---

**需要帮助？** 查看完整文档或提交 Issue。
