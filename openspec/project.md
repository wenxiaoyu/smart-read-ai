# Project Context

## Purpose

智阅AI（SmartRead AI）- 一款聚焦技术/学术专业阅读场景的 Chrome 浏览器插件，定位为"上下文感知的智能阅读助手"。产品依托本地+云端混合 AI 架构，为技术从业者、学术研究者等核心用户提供专业内容解析、跨文档知识关联、个性化知识沉淀等全流程阅读辅助服务。

## Tech Stack

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **包管理器**: pnpm
- **Chrome API**: Manifest V3
- **本地 AI**: Chrome 内置 Gemini Nano 模型
- **云端 AI**: GPT-4、Claude 3、文心一言 4.0（多模型支持）
- **本地存储**: Chrome Storage API + IndexedDB（知识图谱）
- **代码质量**: ESLint + Prettier + Husky
- **CI/CD**: GitHub Actions
- **发布**: Chrome Web Store API

## Project Conventions

### Code Style

- 使用 TypeScript 严格模式
- 使用 Prettier 进行代码格式化（2 空格缩进）
- 使用 ESLint 进行代码检查
- 组件使用 PascalCase 命名
- 文件名使用 kebab-case
- 提交前自动运行 lint-staged

### Architecture Patterns

- **组件化**: 使用 React 函数组件 + Hooks
- **消息传递**: Background ↔ Content Script ↔ Popup 使用 Chrome Message API
- **状态管理**: 使用 Chrome Storage API 持久化数据
- **模块化**: 按功能划分目录（background, content, popup, options）
- **混合 AI 架构**: 本地 AI（Gemini Nano）+ 云端 AI（GPT-4/Claude/文心一言）
- **知识图谱**: 基于 IndexedDB 的本地知识图谱存储与检索
- **沉浸式交互**: Shadow DOM 隔离的注入式 UI，避免样式冲突
- **安全设计**: AES 加密敏感数据（API 密钥、知识图谱），HTTPS 加密云端通信

### Testing Strategy

- 初始版本专注于手动测试
- 后续可添加 Vitest + Testing Library
- 在真实 Chrome 环境中测试插件功能

### Git Workflow

- **主分支**: main
- **功能分支**: feature/xxx
- **发布流程**:
  - 推送代码触发 CI 检查
  - 创建版本标签（v1.0.0）触发自动发布
  - 自动上传到 Chrome Web Store
  - 自动创建 GitHub Release

## Domain Context

这是一个专业阅读辅助的 Chrome 浏览器扩展项目，需要理解：

### Chrome Extension 相关
- Chrome Extension Manifest V3 规范
- Service Worker 生命周期管理
- Content Script 注入和隔离机制（Shadow DOM）
- Chrome Storage API 使用
- Chrome Web Store 发布流程

### AI 集成相关
- Chrome 内置 Gemini Nano 模型集成（Chrome 119+）
- 云端 AI 模型 API 调用（GPT-4、Claude、文心一言）
- Token 计数与成本控制
- 本地 AI 降级策略

### 专业阅读场景
- 技术文档解析（API 文档、开源项目说明、技术博客）
- 学术论文阅读（文献梳理、公式解析、实验数据提取）
- 代码片段解析（多语言支持、语法高亮）
- 专业术语解释与知识关联

### 知识管理
- 知识图谱构建与存储（IndexedDB）
- 跨页面上下文记忆
- 自然语言知识检索
- 知识节点关联与可视化

## Important Constraints

### Chrome Extension 限制
- **必须使用 Manifest V3**（Manifest V2 已弃用）
- **Service Worker 限制**: 不能使用 DOM API，生命周期短暂
- **Content Script 限制**: 在隔离环境中运行，需要通过消息与 background 通信
- **Chrome Web Store 限制**:
  - 包大小 < 100MB
  - 需要开发者账号（$5 一次性费用）
  - 审核时间通常 1-3 天

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

### AI 功能限制
- **本地 AI**: 依赖 Chrome 119+ 版本，需要 Gemini Nano 模型可用
- **云端 AI**: 需要用户自行提供 API 密钥，不内置密钥
- **Token 限制**: 免费版每月 1 万 Token，付费版每月 10 万 Token
- **降级策略**: 本地 AI 不可用时，自动切换为本地规则引擎
- **中国区适配**: 由于无法使用 Gemini Nano，优先使用云端 AI（文心一言/通义千问/智谱 GLM-4）

### 性能约束
- **启动速度**: 插件后台服务启动时间 ≤ 3 秒
- **响应延迟**: 本地 AI ≤ 1 秒，云端 AI ≤ 10 秒
- **资源占用**: 内存 ≤ 100MB，CPU ≤ 20%
- **缓存策略**: 术语解释缓存 24 小时

### 安全与隐私
- **最小权限原则**: 仅申请必要权限（storage、contextMenus、scripting、host_permissions）
- **数据加密**: API 密钥、知识图谱数据采用 AES 加密
- **隐私保护**: 敏感数据本地处理，不上传云端（除非用户明确授权）
- **安全防护**: 防范 XSS、CSRF 攻击

## External Dependencies

- **Chrome Web Store API**: 用于自动发布插件
- **GitHub Actions**: 免费 CI/CD 服务
- **Google Cloud Console**: 获取 OAuth 凭证
- **npm Registry**: 依赖包管理
- **AI 模型 API**:
  - OpenAI GPT-4 API
  - Anthropic Claude 3 API
  - 百度文心一言 4.0 API
- **Chrome Gemini Nano**: Chrome 内置本地 AI 模型（Chrome 119+）

## Core Features

### V1.0 MVP 迭代计划

智阅AI 采用 3 个阶段的 MVP 迭代开发，每个阶段 2-3 周：

#### MVP-1: 核心阅读辅助（Week 1-3）
- 划词工具栏（简化、解释、复制）
- 本地 AI 基础解析（Gemini Nano）
- 注入式结果展示（Shadow DOM）
- 基础设置页面
- 本地 AI 降级策略

#### MVP-2: 云端增强与知识沉淀（Week 4-6）
- 云端 AI 单模型支持（GPT-4）
- 代码/公式解析
- 知识节点收藏与存储
- Token 计数与预算管理
- API 密钥加密存储

#### MVP-3: 高级功能与商业化（Week 7-9）
- 多云端模型切换（Claude、文心一言）
- 多文档对比分析
- 知识图谱自动构建
- 自然语言知识检索
- 付费功能区分与试用机制

详见：[MVP 迭代路线图](../docs/MVP_ROADMAP.md)

### V1.0 核心功能模块

1. **沉浸式交互模块**
   - 划词即时工具栏（简化、解释、提取、收藏、复制）
   - 注入式 AI 结果展示（Shadow DOM 隔离）
   - 右键菜单集成

2. **本地 AI 处理模块**
   - 长难句简化（技术/学术领域适配）
   - 专业术语解释（自动缓存）
   - 代码/公式解析（语法高亮、可视化）
   - 本地 AI 兼容性降级

3. **云端 AI 增强模块**
   - 多模型适配与切换（GPT-4、Claude、文心一言）
   - 多文档对比分析（2-5 篇文档）
   - Token 成本控制与提醒

4. **知识图谱与检索模块**
   - 自动知识图谱构建（IndexedDB 存储）
   - 跨页面上下文记忆
   - 自然语言知识检索

5. **插件设置与管理模块**
   - 基础设置（界面、功能开关、领域适配）
   - 数据管理（导出、清理、隐私设置）
   - 帮助与反馈

## Target Users

### 核心用户群体
1. **技术从业者**: 程序员、架构师、运维工程师、技术产品经理
2. **学术研究者**: 研究生、高校教师、科研人员
3. **专业内容创作者**: 技术博主、行业分析师

### 用户特征
- 年龄分布: 18-45 岁
- 核心痛点: 专业文档阅读门槛高、信息提取耗时、知识积累碎片化
- 使用习惯: 高频使用 Chrome，依赖浏览器插件提升效率
- 付费意愿: 对专业工具接受度高，付费意愿强

## Business Model

### 免费增值模式
- **免费功能**: 本地 AI 核心功能、基础交互、基础知识管理、云端 AI 1 万 Token/月
- **付费功能**: 多模型切换、10 万 Token/月、多文档对比、知识图谱可视化、行业知识库定制
- **定价**: 月订阅 29 元/月，年订阅 268 元/年
- **试用**: 新用户免费试用高级版 7 天
