# 智阅AI（SmartRead AI）

一款聚焦技术/学术专业阅读场景的 Chrome 浏览器插件，定位为"上下文感知的智能阅读助手"。

## 产品定位

智阅AI 依托本地+云端混合 AI 架构，为技术从业者、学术研究者等核心用户提供：
- 📚 **专业内容解析** - 长难句简化、术语解释、代码/公式解析
- 🔗 **跨文档知识关联** - 多文档对比分析、知识图谱构建
- 💾 **个性化知识沉淀** - 自动知识积累、自然语言检索
- 🔒 **数据隐私保护** - 敏感数据本地处理、加密存储

## 核心功能

### 🎯 沉浸式交互
- **划词即时工具栏**: 选中文本后自动弹出工具栏（简化、解释、提取、收藏、复制）
- **注入式结果展示**: AI 解析结果直接注入网页，无需跳转
- **右键菜单集成**: 快速访问核心功能

### 🤖 混合 AI 架构
- **本地 AI**: Chrome 内置 Gemini Nano 模型，隐私保护，无网络依赖
- **云端 AI**: 支持 GPT-4、Claude 3、文心一言 4.0 多模型切换
- **智能降级**: 本地 AI 不可用时自动切换为规则引擎

### 📖 专业阅读辅助
- **技术文档**: API 文档、开源项目说明、技术博客解析
- **学术论文**: 文献梳理、公式解析、实验数据提取
- **代码解析**: 多语言支持、语法高亮、逻辑拆解
- **术语解释**: 自动缓存、关联概念、领域适配

### 🧠 知识图谱
- **自动构建**: 收藏内容自动构建知识节点与关联关系
- **上下文记忆**: 跨页面记忆阅读历史，智能关联
- **自然语言检索**: 用自然语言查询已积累的知识
- **可视化展示**: 知识图谱可视化（付费功能）

### 💰 成本控制
- **Token 计数**: 实时统计云端 AI Token 消耗
- **预算管理**: 设置每月预算，超额自动提醒
- **免费额度**: 每月 1 万 Token 免费额度

## 项目结构

```
src/
├── background/     # Background service worker (AI 引擎、消息处理)
├── content/        # Content scripts (划词工具栏、注入式 UI)
├── popup/          # Extension popup UI (知识检索、设置)
├── options/        # Options/settings page (模型配置、数据管理)
├── icons/          # Extension icons
└── manifest.json   # Extension manifest (V3)
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **包管理器**: pnpm
- **Chrome API**: Manifest V3
- **本地 AI**: Chrome 内置 Gemini Nano 模型
- **云端 AI**: GPT-4、Claude 3、文心一言 4.0
- **本地存储**: Chrome Storage API + IndexedDB
- **代码质量**: ESLint + Prettier + Husky
- **CI/CD**: GitHub Actions

## 开发路线图

智阅AI 采用 MVP 迭代开发策略，分 3 个阶段交付：

### 📅 MVP-1: 核心阅读辅助（Week 1-3）
- ✅ 划词工具栏与注入式 UI
- ✅ 本地 AI 解析（长难句简化、术语解释）
- ✅ Shadow DOM 样式隔离
- ✅ 基础设置与降级策略

### 📅 MVP-2: 云端增强与知识沉淀（Week 4-6）
- ⏳ 云端 AI 集成（GPT-4）
- ⏳ 代码/公式解析
- ⏳ 知识收藏与本地存储
- ⏳ Token 计数与预算管理

### 📅 MVP-3: 高级功能与商业化（Week 7-9）
- ⏳ 多模型支持（Claude、文心一言）
- ⏳ 多文档对比分析
- ⏳ 知识图谱与自然语言检索
- ⏳ 付费功能与试用机制

详细计划请查看：[MVP 迭代路线图](docs/MVP_ROADMAP.md)

## 开发指南

### 前置要求

- Node.js 18+
- pnpm (推荐) 或 npm
- Chrome 119+ (用于本地 AI 功能)

### 当前状态

🎉 **UI Demo Phase 1 完成！** - 核心交互组件已实现

**已完成**：
- ✅ 划词工具栏（选中文本自动弹出）
- ✅ AI 结果展示卡片（加载、展示、操作）
- ✅ Shadow DOM 样式隔离
- ✅ Mock AI 响应系统（100+ 预置术语）
- ✅ 复制、收藏功能
- ✅ 暗黑模式自动适配
- ✅ 流畅的动画效果

**Demo 特点**：
- ✅ UI 体验与真实产品无差异
- ✅ 完整的动画和过渡效果
- ✅ Shadow DOM 样式隔离
- ✅ 跨网站兼容性验证
- ⏸️ AI 解析使用 Mock 数据（1.5秒延迟模拟）
- ⏸️ 数据存储使用内存模拟

**快速开始**：
```bash
# 构建插件
pnpm build

# 加载到 Chrome
# 1. 访问 chrome://extensions/
# 2. 启用"开发者模式"
# 3. 点击"加载已解压的扩展程序"
# 4. 选择 dist 文件夹
```

详见：
- [Demo 测试指南](docs/DEMO_TEST_GUIDE.md)
- [完成总结](docs/DEMO_COMPLETION_SUMMARY.md)
- [UI Demo 使用指南](docs/UI_DEMO_GUIDE.md)

### 安装

1. 克隆仓库:

```bash
git clone <your-repo-url>
cd smart-read-ai
```

2. 安装依赖:

```bash
pnpm install
```

3. 启动开发服务器:

```bash
pnpm dev
```

4. 在 Chrome 中加载插件:
   - 打开 Chrome 并访问 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 文件夹

### 可用脚本

- `pnpm dev` - 启动开发服务器（热重载）
- `pnpm build` - 构建生产版本
- `pnpm lint` - 运行 ESLint
- `pnpm format` - 使用 Prettier 格式化代码
- `pnpm type-check` - 运行 TypeScript 类型检查

## 生产构建

```bash
pnpm build
```

这将在 `dist` 文件夹中创建优化后的构建。然后你可以：

1. 压缩 `dist` 文件夹
2. 上传到 Chrome Web Store

## 架构设计

### 混合 AI 架构

```
本地 AI (Gemini Nano)          云端 AI (GPT-4/Claude/文心一言)
       ↓                                    ↓
   基础解析功能                         高级分析功能
 (术语解释、简化)                   (多文档对比、深度分析)
       ↓                                    ↓
           统一 AI 引擎接口 (Background Worker)
                      ↓
              Content Script (注入式 UI)
                      ↓
                  用户界面
```

### 消息传递

插件使用 Chrome 消息传递 API 进行通信：

```
Popup ←→ Background Worker ←→ Content Script
  ↓              ↓                    ↓
设置管理      AI 引擎处理         划词交互
知识检索      Token 计数          结果展示
```

### 数据存储

- **Chrome Storage Local**: 用户配置、API 密钥（AES 加密）、缓存数据
- **IndexedDB**: 知识图谱数据、Token 消耗记录
- **内存**: 当前会话上下文（临时）

## CI/CD

本项目使用 GitHub Actions 进行自动化 CI/CD：

- **CI 流水线**: 在每次 push 和 PR 时运行
  - 安装依赖
  - 运行 linting 和类型检查
  - 构建插件

- **发布流水线**: 由版本标签触发（例如 `v1.0.0`）
  - 构建生产版本
  - 创建 zip 包
  - 上传到 Chrome Web Store（需要配置）
  - 创建 GitHub Release

### 配置 Chrome Web Store 自动发布

要启用自动发布到 Chrome Web Store，你需要：

1. **获取 Chrome Web Store API 凭证**:
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目
   - 启用 Chrome Web Store API
   - 创建 OAuth 2.0 凭证
   - 获取 `CLIENT_ID` 和 `CLIENT_SECRET`

2. **获取 Refresh Token**:
   - 使用 [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - 配置你的凭证
   - 授权 Chrome Web Store API
   - 交换授权码获取 refresh token

3. **获取 Extension ID**:
   - 首次手动上传插件到 Chrome Web Store
   - 在开发者控制台中找到你的插件 ID

4. **添加 GitHub Secrets**:
   进入仓库 Settings → Secrets 并添加：
   - `CHROME_CLIENT_ID`
   - `CHROME_CLIENT_SECRET`
   - `CHROME_REFRESH_TOKEN`
   - `CHROME_EXTENSION_ID`

5. **创建 Release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## 目标用户

### 核心用户群体
1. **技术从业者**: 程序员、架构师、运维工程师、技术产品经理
2. **学术研究者**: 研究生、高校教师、科研人员
3. **专业内容创作者**: 技术博主、行业分析师

### 用户痛点
- 专业文档阅读门槛高
- 信息提取耗时
- 多文档对比繁琐
- 知识积累碎片化
- 敏感数据处理有隐私顾虑

## 商业模式

### 免费增值模式
- **免费功能**: 本地 AI 核心功能、基础交互、基础知识管理、云端 AI 1 万 Token/月
- **付费功能** (29 元/月 或 268 元/年):
  - 多模型自由切换
  - 每月 10 万 Token 额度
  - 多文档对比分析
  - 知识图谱可视化
  - 行业知识库定制
  - 优先技术支持
- **试用**: 新用户免费试用高级版 7 天

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 相关资源

- [产品需求文档](docs/智阅AI（SmartRead%20AI）产品需求说明书.md)
- [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Gemini Nano 集成指南](https://ai.google.dev/gemini/docs/nano/web)
- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)
