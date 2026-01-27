# 快速开始指南

## 🚀 5 分钟上手

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

这将在 `dist` 目录生成开发版本的插件。

### 3. 在 Chrome 中加载插件

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 文件夹

### 4. 测试插件功能

- **Popup**: 点击浏览器工具栏的插件图标
- **Options**: 右键插件图标 → 选项
- **Content Script**: 访问任意网页，打开控制台查看日志
- **Background**: 在 `chrome://extensions/` 页面点击"Service Worker"查看日志

## 📝 开发流程

### 修改代码

编辑 `src/` 目录下的文件：

- `popup/` - 弹出窗口 UI
- `options/` - 设置页面
- `background/` - 后台服务
- `content/` - 内容脚本

### 热重载

Vite 会自动监听文件变化并重新构建。修改代码后：

1. 文件会自动重新编译
2. 在 `chrome://extensions/` 点击刷新按钮
3. 或者使用快捷键重新加载插件

## 🔧 常用命令

```bash
# 开发
pnpm dev          # 启动开发服务器

# 构建
pnpm build        # 生产构建

# 代码质量
pnpm lint         # 运行 ESLint
pnpm format       # 格式化代码
pnpm type-check   # TypeScript 类型检查
```

## 📦 构建发布版本

```bash
pnpm build
```

构建产物在 `dist/` 目录，可以直接打包上传到 Chrome Web Store。

## 🎯 下一步

- 阅读 [README.md](../README.md) 了解完整功能
- 查看 [Chrome Web Store 发布指南](./CHROME_WEB_STORE_SETUP.md)
- 探索 [Chrome Extension API 文档](https://developer.chrome.com/docs/extensions/)

## 💡 提示

### 调试技巧

1. **Popup 调试**: 右键 popup → 检查
2. **Background 调试**: chrome://extensions/ → Service Worker
3. **Content Script 调试**: 在网页上按 F12，查看控制台

### 常见问题

**Q: 修改代码后没有生效？**
A: 在 chrome://extensions/ 点击刷新按钮重新加载插件

**Q: Service Worker 报错？**
A: 检查 background/index.ts，确保没有使用 DOM API

**Q: Content Script 无法访问页面变量？**
A: Content Script 运行在隔离环境，需要通过 window.postMessage 通信

## 🎨 自定义插件

### 修改图标

替换 `src/icons/` 目录下的图标文件（建议使用 PNG 格式）

### 修改名称和描述

编辑 `src/manifest.json`:

```json
{
  "name": "你的插件名称",
  "description": "你的插件描述"
}
```

### 添加权限

在 `src/manifest.json` 的 `permissions` 数组中添加：

```json
{
  "permissions": [
    "storage",
    "tabs",
    "cookies" // 新增权限
  ]
}
```

查看 [Chrome 权限列表](https://developer.chrome.com/docs/extensions/reference/permissions-list/)

## 🤝 获取帮助

- 查看项目 [Issues](https://github.com/your-repo/issues)
- 阅读 [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/)
- 参考 [示例代码](https://github.com/GoogleChrome/chrome-extensions-samples)
