# 经验教训总结

本文档记录了项目开发过程中遇到的问题、解决方案，以及为避免重复错误而更新的规范。

## 2025-01-27: Shadow DOM 样式注入和 CSP 合规性

### 遇到的问题

#### 问题 1: 工具栏不显示
- **症状**: 选中文本后，控制台日志显示一切正常（Shadow DOM 创建、React 渲染、状态更新），但工具栏在页面上不可见
- **根本原因**: CSS 样式未注入到 Shadow DOM 中。Shadow DOM 是完全隔离的环境，外部样式无法穿透
- **影响范围**: 所有使用 Shadow DOM 的 UI 组件

#### 问题 2: CSP 警告
- **症状**: Chrome 控制台显示 CSP 错误，提示禁止 `eval()` 调用
- **根本原因**: Chrome Extension Manifest V3 对 CSP 有严格要求，某些依赖可能触发 CSP 检测
- **影响范围**: 扩展加载和运行

### 解决方案

#### 解决方案 1: 显式注入样式到 Shadow DOM

在 `src/content/index.tsx` 中：

```typescript
private injectStyles() {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    /* 所有组件的 CSS 规则 */
    .smartread-toolbar-container { ... }
    .smartread-result-container { ... }
    @keyframes smartread-fadeInUp { ... }
    @media (prefers-color-scheme: dark) { ... }
  `
  this.shadowRoot.appendChild(styleSheet)
}

constructor() {
  // 1. 创建 Shadow DOM
  const { shadowRoot } = createShadowContainer('smartread-ai-root')
  this.shadowRoot = shadowRoot
  
  // 2. 注入样式（关键步骤）
  this.injectStyles()
  
  // 3. 创建 React 根节点
  const appContainer = document.createElement('div')
  this.shadowRoot.appendChild(appContainer)
  this.root = createRoot(appContainer)
  
  // 4. 初始化
  this.init()
}
```

#### 解决方案 2: 配置 CSP 和 Terser

在 `src/manifest.json` 中：

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

在 `vite.config.ts` 中：

```typescript
export default defineConfig({
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
})
```

安装依赖：

```bash
pnpm add -D terser
```

### 更新的规范

为了避免重复这些错误，我们更新了以下规范文件：

#### 1. 创建了 `.kiro/steering/chrome-extension-best-practices.md`

这是一个 AI 助手指导文件，包含：

- **Shadow DOM 样式注入规范**（11 条强制规则）
- **Content Security Policy 规范**（4 条强制规则）
- **构建和测试规范**（3 条规则）
- **React + Shadow DOM 集成规范**（2 条规则）
- **文档更新规范**（2 条规则）
- **检查清单模板**（3 个清单）
- **常见错误和解决方案**（4 个案例）

**关键规则**：

- 规则 1: 使用 Shadow DOM 时必须显式注入样式
- 规则 2: Manifest 必须包含 CSP 策略
- 规则 3: Vite 构建必须配置 Terser
- 规则 4: 代码必须符合 CSP 要求
- 规则 8: 初始化顺序必须正确（Shadow DOM → 样式 → React → 初始化）
- 规则 10: 解决问题后必须创建故障排除文档
- 规则 11: 更新项目规范避免重复错误

#### 2. 更新了 `openspec/AGENTS.md`

在 "Best Practices" 部分添加了：

```markdown
### Technology-Specific Best Practices

When working with specific technologies, always check for and follow technology-specific best practices:

- **Chrome Extensions**: See `.kiro/steering/chrome-extension-best-practices.md` for Shadow DOM, CSP, and build requirements
- **React**: Follow React best practices for hooks, state management, and component lifecycle
- **TypeScript**: Maintain strict type safety, avoid `any`, use proper interfaces
- **Other technologies**: Check `.kiro/steering/` directory for relevant guidelines

**After solving a non-obvious problem**:
1. Create troubleshooting documentation
2. Update relevant best practices files
3. Add to project constraints if applicable
4. Ensure future implementations avoid the same issue
```

#### 3. 更新了 `openspec/project.md`

在 "Important Constraints" 部分添加了：

```markdown
### Shadow DOM 样式隔离约束
- **强制规则**: 使用 Shadow DOM 时必须显式注入样式
- **注入时机**: 样式必须在 React 根节点创建之前注入
- **注入方式**: 创建 `<style>` 元素并追加到 Shadow Root
- **完整性**: 必须包含所有组件的 CSS（工具栏、卡片、动画、媒体查询）
- **验证**: 在浏览器中检查 Shadow DOM 是否包含 `<style>` 标签
- **详细规范**: 参见 `.kiro/steering/chrome-extension-best-practices.md`

### Content Security Policy (CSP) 约束
- **Manifest 要求**: 必须在 `manifest.json` 中声明 CSP 策略
- **禁止使用**: `eval()`, `new Function()`, 字符串形式的 `setTimeout/setInterval`
- **构建要求**: 必须使用 Terser 压缩，配置 `minify: 'terser'`
- **依赖要求**: 必须安装 `terser` 开发依赖
- **验证**: 构建后检查 `dist/manifest.json` 包含 `content_security_policy`
- **详细规范**: 参见 `.kiro/steering/chrome-extension-best-practices.md`
```

#### 4. 创建了故障排除文档

- `docs/CSP_TROUBLESHOOTING.md` - CSP 问题详细说明
- `docs/DEBUG_SESSION_SUMMARY.md` - 完整的技术细节和修复过程
- `docs/QUICK_FIX_REFERENCE.md` - 快速查阅常见问题

### 预防措施

为了确保未来不会犯同样的错误，我们建立了以下流程：

#### 开发前检查清单

```markdown
- [ ] 检查 `.kiro/steering/` 目录是否有相关技术的最佳实践文件
- [ ] 阅读 `openspec/project.md` 中的约束条件
- [ ] 查看 `docs/LESSONS_LEARNED.md` 了解历史问题
```

#### 开发中检查清单

```markdown
- [ ] 使用 Shadow DOM 时，是否实现了 `injectStyles()` 方法？
- [ ] 样式注入是否在 React 之前？
- [ ] 是否包含了所有组件的 CSS？
- [ ] Manifest 是否包含 CSP 策略？
- [ ] Vite 是否配置了 Terser？
- [ ] 代码中是否避免了 `eval()` 和字符串形式的 `setTimeout`？
```

#### 开发后检查清单

```markdown
- [ ] 运行 `pnpm build` 是否成功？
- [ ] 在 Chrome 中加载扩展是否正常？
- [ ] 所有功能是否测试通过？
- [ ] 是否创建了必要的故障排除文档？
- [ ] 是否更新了相关规范文件？
```

### 经验总结

#### 技术层面

1. **Shadow DOM 不是魔法**
   - Shadow DOM 提供完全隔离，但这意味着必须显式处理样式
   - 不要假设 CSS 导入会自动工作
   - 始终验证 Shadow DOM 中是否有 `<style>` 标签

2. **CSP 是硬性要求**
   - Manifest V3 对 CSP 有严格要求
   - 不要使用任何形式的动态代码执行
   - 使用 Terser 确保构建产物符合 CSP

3. **初始化顺序很重要**
   - Shadow DOM → 样式注入 → React 根节点 → 初始化
   - 错误的顺序会导致难以调试的问题

#### 流程层面

1. **遇到问题时**
   - 先理解根本原因，不要急于修复
   - 创建详细的故障排除文档
   - 思考如何避免重复错误

2. **解决问题后**
   - 立即更新相关规范文件
   - 创建检查清单
   - 确保团队（包括 AI 助手）知道新规范

3. **规范管理**
   - 技术特定规范放在 `.kiro/steering/`
   - 项目约束放在 `openspec/project.md`
   - 通用最佳实践放在 `openspec/AGENTS.md`
   - 历史问题记录在 `docs/LESSONS_LEARNED.md`

### 影响评估

#### 正面影响

- ✅ 未来开发 Shadow DOM 功能时，AI 助手会自动遵循规范
- ✅ 新加入的开发者可以快速了解项目约束
- ✅ 减少了重复性错误的发生概率
- ✅ 提高了代码质量和一致性

#### 需要注意

- ⚠️ 规范文件需要定期维护和更新
- ⚠️ 新的技术栈可能需要新的规范文件
- ⚠️ 规范不应该过于僵化，要保持灵活性

### 下一步行动

1. **短期**（本周）
   - [ ] 在团队中分享这次经验
   - [ ] 确保所有开发者了解新规范
   - [ ] 验证现有代码是否符合新规范

2. **中期**（本月）
   - [ ] 定期审查规范文件的有效性
   - [ ] 收集团队反馈，优化规范
   - [ ] 考虑添加自动化检查（ESLint 规则、CI 检查）

3. **长期**（本季度）
   - [ ] 建立规范更新流程
   - [ ] 创建规范遵循度指标
   - [ ] 持续改进开发流程

---

## 模板：记录新的经验教训

当遇到新的问题并解决后，按以下格式添加到本文档：

```markdown
## YYYY-MM-DD: 问题简短描述

### 遇到的问题

#### 问题 X: 具体问题名称
- **症状**: 描述用户看到的现象
- **根本原因**: 技术层面的根本原因
- **影响范围**: 影响哪些功能或模块

### 解决方案

#### 解决方案 X: 具体解决方案
- 代码示例
- 配置更改
- 依赖更新

### 更新的规范

列出更新了哪些规范文件，以及添加了哪些规则

### 预防措施

列出为避免重复错误而建立的检查清单和流程

### 经验总结

技术层面和流程层面的经验总结

### 影响评估

正面影响和需要注意的事项

### 下一步行动

短期、中期、长期的行动计划
```

---

**记住**：每次解决一个非显而易见的问题后，都要问自己：

1. 这个问题是否值得记录？
2. 是否需要更新规范避免重复？
3. 是否需要创建检查清单？
4. 是否需要更新文档？

如果答案是"是"，立即行动！
