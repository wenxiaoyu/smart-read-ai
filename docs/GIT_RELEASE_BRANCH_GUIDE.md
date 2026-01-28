# Git 发布分支管理指南

## 📦 v0.1.1 发布分支已创建

### 分支信息

- **发布分支**：`release/v0.1.1`
- **Git 标签**：`v0.1.1`
- **基于提交**：`d96f703`
- **创建日期**：2026-01-28

### 远程仓库

- **GitHub 仓库**：https://github.com/wenxiaoyu/smart-read-ai
- **发布分支 URL**：https://github.com/wenxiaoyu/smart-read-ai/tree/release/v0.1.1
- **标签 URL**：https://github.com/wenxiaoyu/smart-read-ai/releases/tag/v0.1.1

---

## 🌳 分支结构

```
main (主分支)
├── v0.1.1 (标签)
└── release/v0.1.1 (发布分支)
```

### 分支说明

1. **main 分支**：
   - 主开发分支
   - 包含最新的稳定代码
   - 所有新功能开发都基于此分支

2. **release/v0.1.1 分支**：
   - 发布前的备份分支
   - 用于后续的 bug 修复和小版本更新
   - 不接受新功能，只接受 bug 修复

3. **v0.1.1 标签**：
   - 标记发布版本的快照
   - 不可修改
   - 用于回溯和版本管理

---

## 🔄 后续开发工作流

### 场景 1：开发新功能（v0.2.0）

```bash
# 1. 切换到 main 分支
git checkout main

# 2. 拉取最新代码
git pull origin main

# 3. 创建功能分支
git checkout -b feature/knowledge-base

# 4. 开发功能...
# 5. 提交代码
git add .
git commit -m "feat: implement knowledge base management"

# 6. 推送到远程
git push origin feature/knowledge-base

# 7. 创建 Pull Request 合并到 main
```

### 场景 2：修复 v0.1.1 的 Bug

```bash
# 1. 切换到发布分支
git checkout release/v0.1.1

# 2. 创建 bug 修复分支
git checkout -b hotfix/v0.1.1-fix-toolbar-position

# 3. 修复 bug...
# 4. 提交代码
git add .
git commit -m "fix: correct toolbar positioning issue"

# 5. 合并回发布分支
git checkout release/v0.1.1
git merge hotfix/v0.1.1-fix-toolbar-position

# 6. 创建新的补丁版本标签
git tag -a v0.1.2 -m "Release v0.1.2 - Fix toolbar positioning"

# 7. 推送到远程
git push origin release/v0.1.1
git push origin v0.1.2

# 8. 同时合并到 main 分支
git checkout main
git merge hotfix/v0.1.1-fix-toolbar-position
git push origin main
```

### 场景 3：准备 v0.2.0 发布

```bash
# 1. 确保在 main 分支
git checkout main

# 2. 拉取最新代码
git pull origin main

# 3. 创建发布分支
git checkout -b release/v0.2.0

# 4. 更新版本号（package.json, manifest.json）
# 5. 提交版本更新
git add .
git commit -m "chore: bump version to v0.2.0"

# 6. 创建标签
git tag -a v0.2.0 -m "Release v0.2.0 - Knowledge base and more"

# 7. 推送到远程
git push origin release/v0.2.0
git push origin v0.2.0

# 8. 合并回 main
git checkout main
git merge release/v0.2.0
git push origin main
```

---

## 📋 版本号规范

遵循语义化版本（Semantic Versioning）：`MAJOR.MINOR.PATCH`

- **MAJOR**（主版本号）：不兼容的 API 修改
- **MINOR**（次版本号）：向下兼容的功能性新增
- **PATCH**（修订号）：向下兼容的问题修正

### 示例

- `v0.1.1` → `v0.1.2`：Bug 修复
- `v0.1.2` → `v0.2.0`：新功能（知识库管理）
- `v0.2.0` → `v1.0.0`：重大更新（API 变更）

---

## 🏷️ 标签命名规范

### 发布标签

- 格式：`vMAJOR.MINOR.PATCH`
- 示例：`v0.1.1`, `v0.2.0`, `v1.0.0`

### 预发布标签

- 格式：`vMAJOR.MINOR.PATCH-alpha.N` 或 `-beta.N` 或 `-rc.N`
- 示例：`v0.2.0-alpha.1`, `v0.2.0-beta.2`, `v0.2.0-rc.1`

### 标签消息

- 简洁描述版本主要变更
- 示例：`Release v0.1.1 - Initial public release with simplify and explain features`

---

## 🔍 查看版本历史

### 查看所有标签

```bash
git tag
```

### 查看标签详情

```bash
git show v0.1.1
```

### 查看分支列表

```bash
# 本地分支
git branch

# 远程分支
git branch -r

# 所有分支
git branch -a
```

### 查看提交历史

```bash
# 简洁格式
git log --oneline --graph --all

# 详细格式
git log --graph --all --decorate
```

---

## 🔙 回滚到特定版本

### 回滚到 v0.1.1

```bash
# 方法 1：创建新分支基于标签
git checkout -b rollback-v0.1.1 v0.1.1

# 方法 2：重置到标签（危险操作）
git checkout main
git reset --hard v0.1.1
git push origin main --force  # 需要 force push
```

### 检出特定版本的文件

```bash
# 检出 v0.1.1 版本的某个文件
git checkout v0.1.1 -- src/content/index.tsx
```

---

## 📊 版本对比

### 对比两个版本的差异

```bash
# 对比 v0.1.1 和 main 分支
git diff v0.1.1..main

# 对比两个标签
git diff v0.1.0..v0.1.1

# 查看文件变更列表
git diff --name-only v0.1.1..main
```

### 查看版本之间的提交

```bash
# 查看 v0.1.1 到 main 之间的提交
git log v0.1.1..main --oneline
```

---

## 🚀 发布到 Chrome Web Store

### 基于发布分支创建发布包

```bash
# 1. 切换到发布分支
git checkout release/v0.1.1

# 2. 确保代码是最新的
git pull origin release/v0.1.1

# 3. 清理并重新构建
rm -rf dist
pnpm build

# 4. 创建发布包
cd dist
zip -r ../smart-read-ai-v0.1.1.zip .
cd ..

# 5. 验证发布包
unzip -l smart-read-ai-v0.1.1.zip
```

### 发布包命名规范

- 格式：`smart-read-ai-vMAJOR.MINOR.PATCH.zip`
- 示例：`smart-read-ai-v0.1.1.zip`

---

## 📝 发布说明（Release Notes）

### 在 GitHub 创建 Release

1. 访问：https://github.com/wenxiaoyu/smart-read-ai/releases/new
2. 选择标签：`v0.1.1`
3. 填写标题：`v0.1.1 - Initial Public Release`
4. 填写说明：

```markdown
## 🎉 v0.1.1 - Initial Public Release

### ✨ 新功能

- 文本简化：使用 AI 将复杂文本转换为易懂的表达
- 术语解释：对专业术语进行详细解释
- 支持多个 AI 服务商（OpenAI GPT-4, Claude, Moonshot）
- 毛玻璃效果设计
- 浅色/暗黑模式自动适配
- API 密钥加密存储

### 📦 安装

1. 下载 `smart-read-ai-v0.1.1.zip`
2. 解压文件
3. 在 Chrome 中访问 `chrome://extensions/`
4. 启用"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的文件夹

### 📚 文档

- [用户指南](docs/QUICK_START.md)
- [API 配置](docs/AI_PROVIDERS_GUIDE.md)
- [故障排除](docs/CSP_TROUBLESHOOTING.md)

### 🔮 即将推出

- 知识库管理（v0.2.0）
- 代码解析（v0.3.0）
- 公式解析（v0.3.0）

### 🐛 已知问题

- 某些网站的代码块选择可能不准确
- 长文本处理可能较慢

### 💬 反馈

如有问题或建议，请通过 [GitHub Issues](https://github.com/wenxiaoyu/smart-read-ai/issues) 反馈。
```

5. 上传发布包：`smart-read-ai-v0.1.1.zip`
6. 发布

---

## 🔐 分支保护规则

### 建议的保护规则

**main 分支**：

- ✅ 要求 Pull Request 审查
- ✅ 要求状态检查通过
- ✅ 禁止强制推送
- ✅ 禁止删除

**release/\* 分支**：

- ✅ 要求 Pull Request 审查
- ✅ 禁止强制推送
- ✅ 禁止删除

---

## 📖 参考资源

### Git 工作流

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)

### Chrome 扩展发布

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)

---

## ✅ 检查清单

### 创建发布分支前

- [ ] 所有功能已完成并测试
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 构建成功无错误

### 创建发布分支后

- [ ] 分支已推送到远程
- [ ] 标签已创建并推送
- [ ] GitHub Release 已创建
- [ ] 发布包已上传
- [ ] 团队成员已通知

### 发布到 Chrome Web Store 后

- [ ] 扩展已提交审核
- [ ] 用户文档已发布
- [ ] 社交媒体已宣传
- [ ] 反馈渠道已准备

---

**最后更新**：2026-01-28  
**维护者**：[您的名字]  
**仓库**：https://github.com/wenxiaoyu/smart-read-ai
