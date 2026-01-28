# UI Demo 快速启动指南

## 5 分钟快速体验

### 1. 安装依赖（1 分钟）

```bash
pnpm install
```

### 2. 启动开发服务器（1 分钟）

```bash
pnpm dev
```

### 3. 加载到 Chrome（2 分钟）

1. 打开 Chrome，访问 `chrome://extensions/`
2. 启用右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 文件夹
5. 看到"Smart Read AI"图标即成功

### 4. 开始测试（1 分钟）

1. 访问 https://github.com/facebook/react
2. 选中 README 中的任意文字（至少 5 个字符）
3. 看到划词工具栏弹出
4. 点击"简化"或"解释"按钮
5. 观察 AI 结果展示（Mock 数据）

## 推荐测试流程

### 流程 1: 基础交互（5 分钟）

```
1. GitHub README 选中文字
   ↓
2. 点击"简化"按钮
   ↓
3. 观察加载动画（1.5秒）
   ↓
4. 查看 Mock 结果
   ↓
5. 点击"复制"按钮
   ↓
6. 关闭结果卡片
```

### 流程 2: 跨网站测试（10 分钟）

```
GitHub → 掘金 → 知乎
在每个网站执行相同操作，验证一致性
```

### 流程 3: Popup 和 Options（5 分钟）

```
1. 点击插件图标 → 查看 Popup
2. 右键图标 → 选项 → 查看 Options
3. 切换主题 → 观察效果
```

## 常见问题

### Q: 工具栏没有弹出？
A: 确保选中至少 5 个字符，且不在输入框内选中。

### Q: 结果一直是加载中？
A: 等待 1.5 秒，这是 Mock 延迟。如果超过 3 秒，刷新页面重试。

### Q: 样式看起来不对？
A: 检查是否启用了开发者模式，尝试刷新页面。

### Q: 如何查看 Mock 数据？
A: 打开 Chrome DevTools → Console，会看到 Mock 数据日志。

## 下一步

体验完 Demo 后：

1. 填写反馈表单（见 UI_DEMO_GUIDE.md）
2. 报告发现的问题
3. 提出改进建议

## 开发模式

### 热重载开发

```bash
# 启动开发服务器
pnpm dev

# 修改代码后，Chrome 会自动重新加载插件
```

### 调试技巧

```bash
# 查看 Content Script 日志
右键网页 → 检查 → Console

# 查看 Background Worker 日志
chrome://extensions/ → 详细信息 → 检查视图：Service Worker

# 查看 Popup 日志
右键 Popup → 检查
```

## 性能监控

### 查看内存占用

```
Chrome 任务管理器（Shift + Esc）
→ 找到 "Smart Read AI"
→ 查看内存占用
```

### 查看动画性能

```
Chrome DevTools → Performance
→ 录制划词操作
→ 查看帧率（应保持 60 FPS）
```

## 反馈渠道

- GitHub Issues: [URL]
- 邮件: [Email]
- 微信群: [QR Code]

---

**开始体验吧！** 🎉
