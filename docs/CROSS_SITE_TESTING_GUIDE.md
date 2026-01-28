# 跨网站兼容性测试指南

## 测试目标

确保智阅 AI 扩展在各种主流网站上都能正常工作，包括：
- 划词工具栏正常显示和定位
- 结果卡片正常显示和定位
- 样式不被网站 CSS 影响
- 不影响网站原有功能

## 测试网站列表

### 技术文档类
1. ✅ GitHub (github.com)
2. ✅ Stack Overflow (stackoverflow.com)
3. ✅ MDN Web Docs (developer.mozilla.org)

### 中文技术社区
4. ✅ 掘金 (juejin.cn)
5. ✅ CSDN (csdn.net)
6. ✅ 知乎 (zhihu.com)

### 内容平台
7. ✅ 微信公众号文章 (mp.weixin.qq.com)

## 测试步骤

### 准备工作

1. **构建扩展**
   ```bash
   pnpm build
   ```

2. **加载扩展**
   - 打开 Chrome 扩展管理页面：`chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

3. **验证加载成功**
   - 在扩展列表中看到"智阅 AI"
   - 图标显示正常
   - 无错误提示

### 测试用例

#### 用例 1：基础功能测试

**步骤**：
1. 访问测试网站
2. 选中一段文本（至少 5 个字符）
3. 观察工具栏是否出现
4. 点击"解释"按钮
5. 观察结果卡片是否出现
6. 等待 AI 响应（Mock 数据）
7. 查看结果内容

**预期结果**：
- ✅ 工具栏在选中文本上方正确显示
- ✅ 工具栏样式完整（毛玻璃效果、图标、文字）
- ✅ 点击按钮后工具栏显示加载状态
- ✅ 结果卡片在选中文本下方正确显示
- ✅ 结果卡片样式完整（毛玻璃效果、内容、按钮）
- ✅ Mock 数据正确显示

#### 用例 2：样式隔离测试

**步骤**：
1. 访问测试网站
2. 打开浏览器开发者工具
3. 检查扩展元素的 Shadow DOM
4. 验证样式隔离

**预期结果**：
- ✅ 扩展元素在 Shadow DOM 中
- ✅ 网站 CSS 不影响扩展样式
- ✅ 扩展 CSS 不影响网站样式
- ✅ 毛玻璃效果正常显示

#### 用例 3：定位测试

**步骤**：
1. 在页面顶部选中文本
2. 在页面中间选中文本
3. 在页面底部选中文本
4. 在页面左侧选中文本
5. 在页面右侧选中文本

**预期结果**：
- ✅ 工具栏始终在选中文本上方
- ✅ 结果卡片始终在选中文本下方
- ✅ 不超出屏幕边界（智能定位）
- ✅ 滚动页面时位置正确

#### 用例 4：交互测试

**步骤**：
1. 选中文本，显示工具栏
2. 点击工具栏外部区域
3. 再次选中文本
4. 点击"解释"按钮
5. 在结果卡片中选中文本
6. 拖拽结果卡片
7. 点击复制按钮
8. 点击收藏按钮
9. 点击关闭按钮

**预期结果**：
- ✅ 点击外部区域工具栏不消失（手动控制）
- ✅ 再次选中文本工具栏重新定位
- ✅ 在结果卡片中选中文本不触发新工具栏
- ✅ 拖拽功能正常
- ✅ 复制功能正常（显示提示）
- ✅ 收藏功能正常（显示提示）
- ✅ 关闭功能正常（卡片消失）

#### 用例 5：暗黑模式测试

**步骤**：
1. 切换系统主题为暗黑模式
2. 刷新测试网站
3. 重复用例 1-4

**预期结果**：
- ✅ 工具栏暗黑模式样式正确
- ✅ 结果卡片暗黑模式样式正确
- ✅ 文字对比度足够
- ✅ 所有功能正常

#### 用例 6：性能测试

**步骤**：
1. 打开浏览器开发者工具
2. 切换到 Performance 标签
3. 开始录制
4. 选中文本，点击"解释"
5. 等待结果显示
6. 停止录制
7. 分析性能数据

**预期结果**：
- ✅ 工具栏显示延迟 < 100ms
- ✅ 结果卡片显示延迟 < 200ms
- ✅ 动画帧率 > 30fps
- ✅ 内存占用 < 50MB

## 测试网站详细说明

### 1. GitHub (github.com)

**测试页面**：
- 仓库 README：https://github.com/microsoft/vscode
- Issue 页面：https://github.com/microsoft/vscode/issues
- Pull Request：https://github.com/microsoft/vscode/pulls
- 代码文件：https://github.com/microsoft/vscode/blob/main/src/vs/base/common/strings.ts

**特点**：
- 深色主题
- 代码高亮
- Markdown 渲染
- 复杂的 CSS 样式

**重点测试**：
- 在代码块中选中文本
- 在 Markdown 内容中选中文本
- 在评论中选中文本

### 2. Stack Overflow (stackoverflow.com)

**测试页面**：
- 问题页面：https://stackoverflow.com/questions/tagged/javascript
- 回答页面：https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array

**特点**：
- 代码块
- 语法高亮
- 投票按钮
- 侧边栏

**重点测试**：
- 在问题标题中选中文本
- 在代码块中选中文本
- 在回答内容中选中文本

### 3. MDN Web Docs (developer.mozilla.org)

**测试页面**：
- JavaScript 文档：https://developer.mozilla.org/en-US/docs/Web/JavaScript
- CSS 文档：https://developer.mozilla.org/en-US/docs/Web/CSS

**特点**：
- 技术文档
- 代码示例
- 侧边导航
- 多语言切换

**重点测试**：
- 在文档正文中选中文本
- 在代码示例中选中文本
- 在表格中选中文本

### 4. 掘金 (juejin.cn)

**测试页面**：
- 首页：https://juejin.cn/
- 文章页面：https://juejin.cn/post/7000000000000000000

**特点**：
- 中文内容
- 代码高亮
- 评论系统
- 侧边栏推荐

**重点测试**：
- 在文章标题中选中文本
- 在文章正文中选中文本
- 在代码块中选中文本
- 在评论中选中文本

### 5. CSDN (csdn.net)

**测试页面**：
- 博客文章：https://blog.csdn.net/

**特点**：
- 中文技术博客
- 广告较多
- 代码块
- 侧边栏

**重点测试**：
- 在文章正文中选中文本
- 在代码块中选中文本
- 避免与广告冲突

### 6. 知乎 (zhihu.com)

**测试页面**：
- 问题页面：https://www.zhihu.com/question/
- 回答页面：https://www.zhihu.com/question/19551535

**特点**：
- 中文问答社区
- 富文本编辑器
- 图片内容
- 评论系统

**重点测试**：
- 在问题标题中选中文本
- 在回答内容中选中文本
- 在评论中选中文本

### 7. 微信公众号文章 (mp.weixin.qq.com)

**测试页面**：
- 任意公众号文章

**特点**：
- 移动端优化
- 富文本内容
- 图片较多
- 特殊的 CSS 样式

**重点测试**：
- 在文章标题中选中文本
- 在文章正文中选中文本
- 在引用块中选中文本

## 常见问题和解决方案

### 问题 1：工具栏被网站元素遮挡

**原因**：网站使用了高 z-index 的元素

**解决方案**：
```css
.smartread-toolbar {
  z-index: 2147483647; /* 最大值 */
}
```

### 问题 2：样式被网站 CSS 影响

**原因**：Shadow DOM 样式隔离失效

**解决方案**：
1. 确认使用了 Shadow DOM
2. 确认样式注入到 Shadow Root
3. 使用 `!important` 提高优先级（谨慎使用）

### 问题 3：工具栏定位不准确

**原因**：网站使用了 transform 或 position 影响定位

**解决方案**：
```typescript
// 使用 getBoundingClientRect() 获取准确位置
const rect = range.getBoundingClientRect()
const top = rect.top + window.scrollY
const left = rect.left + window.scrollX
```

### 问题 4：在某些网站上无法选中文本

**原因**：网站禁用了文本选择

**解决方案**：
```css
/* 在扩展元素中启用文本选择 */
.smartread-result-card {
  user-select: text;
  -webkit-user-select: text;
}
```

### 问题 5：性能问题

**原因**：事件监听器过多或频繁触发

**解决方案**：
```typescript
// 使用防抖
const handleMouseUp = debounce(() => {
  // 处理选中文本
}, 100)
```

## 测试报告模板

### 网站：[网站名称]
**测试日期**：YYYY-MM-DD  
**测试人员**：[姓名]  
**浏览器版本**：Chrome [版本号]

#### 基础功能
- [ ] 工具栏显示正常
- [ ] 结果卡片显示正常
- [ ] Mock 数据正确

#### 样式隔离
- [ ] 扩展样式不受影响
- [ ] 网站样式不受影响

#### 定位
- [ ] 工具栏定位正确
- [ ] 结果卡片定位正确
- [ ] 智能定位生效

#### 交互
- [ ] 点击按钮正常
- [ ] 拖拽功能正常
- [ ] 复制功能正常
- [ ] 收藏功能正常
- [ ] 关闭功能正常

#### 暗黑模式
- [ ] 暗黑模式样式正确
- [ ] 文字对比度足够

#### 性能
- [ ] 响应速度快
- [ ] 动画流畅
- [ ] 内存占用合理

#### 问题记录
1. [问题描述]
   - 严重程度：高/中/低
   - 复现步骤：[步骤]
   - 截图：[链接]

#### 总体评价
- 通过 ✅ / 不通过 ❌
- 备注：[说明]

## 自动化测试（未来计划）

### Playwright 测试脚本

```typescript
import { test, expect } from '@playwright/test'

test('GitHub - 基础功能测试', async ({ page }) => {
  // 访问 GitHub
  await page.goto('https://github.com/microsoft/vscode')
  
  // 选中文本
  await page.locator('h1').selectText()
  
  // 等待工具栏出现
  await page.waitForSelector('.smartread-toolbar')
  
  // 验证工具栏可见
  const toolbar = page.locator('.smartread-toolbar')
  await expect(toolbar).toBeVisible()
  
  // 点击"解释"按钮
  await toolbar.locator('button:has-text("解释")').click()
  
  // 等待结果卡片出现
  await page.waitForSelector('.smartread-result-card')
  
  // 验证结果卡片可见
  const resultCard = page.locator('.smartread-result-card')
  await expect(resultCard).toBeVisible()
})
```

## 总结

跨网站兼容性测试是确保扩展质量的关键步骤。通过系统的测试，我们可以：
1. 发现并修复样式冲突
2. 优化定位算法
3. 提升用户体验
4. 确保稳定性

建议每次重大更新后都进行完整的跨网站测试。
