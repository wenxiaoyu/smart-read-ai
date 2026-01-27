# Project Context

## Purpose

Demumu Chrome 插件 - 一个现代化的 Chrome 浏览器扩展项目，使用 TypeScript + React 构建，具备完整的 CI/CD 自动化发布流程。

## Tech Stack

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **包管理器**: pnpm
- **Chrome API**: Manifest V3
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

这是一个 Chrome 浏览器扩展项目，需要理解：

- Chrome Extension Manifest V3 规范
- Service Worker 生命周期管理
- Content Script 注入和隔离机制
- Chrome Storage API 使用
- Chrome Web Store 发布流程

## Important Constraints

- **必须使用 Manifest V3**（Manifest V2 已弃用）
- **Service Worker 限制**: 不能使用 DOM API，生命周期短暂
- **Content Script 限制**: 在隔离环境中运行，需要通过消息与 background 通信
- **Chrome Web Store 限制**:
  - 包大小 < 100MB
  - 需要开发者账号（$5 一次性费用）
  - 审核时间通常 1-3 天

## External Dependencies

- **Chrome Web Store API**: 用于自动发布插件
- **GitHub Actions**: 免费 CI/CD 服务
- **Google Cloud Console**: 获取 OAuth 凭证
- **npm Registry**: 依赖包管理
