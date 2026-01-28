# Chrome Web Store 发布完整指南

## 📋 目录

1. [发布前准备](#发布前准备)
2. [必需物料清单](#必需物料清单)
3. [商店描述文案](#商店描述文案)
4. [隐私政策](#隐私政策)
5. [审核说明](#审核说明)
6. [截图和宣传图](#截图和宣传图)
7. [发布步骤](#发布步骤)
8. [常见问题](#常见问题)

---

## 发布前准备

### ✅ 检查清单

在开始发布流程前，确保完成以下检查：

- [ ] 代码构建成功（`pnpm build`）
- [ ] 本地测试所有功能正常
- [ ] manifest.json 版本号正确（v0.1.1）
- [ ] 所有图标文件存在（16x16, 48x48, 128x128）
- [ ] 准备好测试 API 密钥（OpenAI 或 Moonshot）
- [ ] 创建隐私政策页面
- [ ] 准备商店截图（至少 1 张，最多 5 张）
- [ ] 准备宣传图（可选）

### 📦 打包扩展

```bash
# 1. 构建生产版本
pnpm build

# 2. 创建 ZIP 包
cd dist
zip -r ../smart-read-ai-v0.1.1.zip .
cd ..

# 3. 验证 ZIP 包内容
unzip -l smart-read-ai-v0.1.1.zip
```

**ZIP 包应包含**：

- manifest.json
- icons/ 目录
- src/ 目录（编译后的 JS/CSS）
- 其他资源文件

---

## 必需物料清单

### 1. 扩展包

- **文件名**：`smart-read-ai-v0.1.1.zip`
- **大小限制**：< 100 MB
- **格式**：ZIP 压缩包

### 2. 图标文件

已包含在扩展包中：

- `icons/icon-16.png` (16x16)
- `icons/icon-48.png` (48x48)
- `icons/icon-128.png` (128x128)

### 3. 商店资源

需要单独上传：

- 商店图标：128x128 PNG（从扩展包中提取）
- 截图：1280x800 或 640x400 PNG/JPG（至少 1 张）
- 宣传图：440x280 PNG/JPG（可选）

### 4. 文案内容

- 扩展名称（中英文）
- 简短描述（132 字符以内）
- 详细描述（支持 Markdown）
- 隐私政策 URL
- 支持 URL（可选）

### 5. 审核材料

- 审核说明（详细的测试步骤）
- 测试 API 密钥
- 演示视频链接（可选）

---

## 商店描述文案

### 📝 扩展名称

**中文**：智阅AI - 文本简化与解释助手

**英文**：Smart Read AI - Text Simplifier & Explainer

**字符限制**：45 字符以内

---

### 📝 简短描述（Tagline）

**中文**：

```
让复杂文本变简单，用 AI 帮你理解专业术语和难懂内容
```

**英文**：

```
Simplify complex text and explain technical terms with AI assistance
```

**字符限制**：132 字符以内

---

### 📝 详细描述

**中文版本**：

```markdown
# 智阅AI - 让阅读更轻松

智阅AI 是一个强大的浏览器扩展，帮助您轻松理解网页上的复杂文本和专业术语。

## ✨ 核心功能

### 💡 文本简化

将复杂、冗长的文本转换为简洁易懂的表达，保留核心信息，提升阅读效率。

### 📖 术语解释

对专业术语、技术概念进行详细解释，从基础到应用，帮助您快速掌握新知识。

### 📋 快速复制

一键复制选中文本或 AI 生成的结果，方便保存和分享。

## 🎯 适用场景

- **学术研究**：理解论文中的专业术语和复杂概念
- **技术学习**：简化技术文档，快速掌握新技术
- **新闻阅读**：理解复杂的新闻报道和分析文章
- **工作学习**：处理各类专业文档和报告

## 🚀 使用方法

1. **配置 API 密钥**：点击扩展图标，进入设置页面，添加您的 AI 服务 API 密钥
2. **选中文本**：在任意网页上选中您想要简化或解释的文本
3. **使用功能**：点击工具栏中的"简化"或"解释"按钮
4. **查看结果**：AI 生成的结果会显示在精美的卡片中

## 🤖 支持的 AI 服务

- **OpenAI GPT-4**：强大的语言理解和生成能力
- **Anthropic Claude**：擅长长文本处理和深度分析
- **Moonshot (Kimi)**：国内优秀的大语言模型

## 🔒 隐私与安全

- ✅ API 密钥使用 AES-256-GCM 加密存储在本地
- ✅ 不收集任何个人信息或浏览历史
- ✅ 只在您主动点击按钮时才发送文本到 AI 服务
- ✅ 所有数据处理都在您选择的 AI 服务商进行

## ⚙️ 重要说明

**需要您自己的 API 密钥**：本扩展需要您自行注册 AI 服务商（OpenAI、Claude 或 Moonshot）并获取 API 密钥。我们不提供 API 密钥，也不会收集或存储您的密钥。

**数据处理**：选中的文本会发送到您选择的 AI 服务商进行处理。请查看各服务商的隐私政策：

- OpenAI: https://openai.com/privacy
- Anthropic: https://www.anthropic.com/privacy
- Moonshot: https://www.moonshot.cn/privacy

## 📞 支持与反馈

如有问题或建议，欢迎通过以下方式联系我们：

- GitHub: [项目地址]
- Email: [联系邮箱]

## 📄 开源协议

本项目采用 MIT 协议开源，欢迎贡献代码和提出建议。

---

**让复杂内容变简单，从智阅 AI 开始！**
```

**英文版本**：

```markdown
# SmartRead AI - Make Reading Easier

SmartRead AI is a powerful browser extension that helps you easily understand complex text and technical terms on web pages.

## ✨ Core Features

### 💡 Text Simplification

Convert complex, lengthy text into concise and understandable expressions while retaining core information to improve reading efficiency.

### 📖 Term Explanation

Provide detailed explanations of technical terms and concepts, from basics to applications, helping you quickly grasp new knowledge.

### 📋 Quick Copy

Copy selected text or AI-generated results with one click for easy saving and sharing.

## 🎯 Use Cases

- **Academic Research**: Understand technical terms and complex concepts in papers
- **Technical Learning**: Simplify technical documentation and quickly master new technologies
- **News Reading**: Understand complex news reports and analytical articles
- **Work & Study**: Process various professional documents and reports

## 🚀 How to Use

1. **Configure API Key**: Click the extension icon, go to settings, and add your AI service API key
2. **Select Text**: Select the text you want to simplify or explain on any webpage
3. **Use Features**: Click the "Simplify" or "Explain" button in the toolbar
4. **View Results**: AI-generated results will be displayed in a beautiful card

## 🤖 Supported AI Services

- **OpenAI GPT-4**: Powerful language understanding and generation capabilities
- **Anthropic Claude**: Excellent at long text processing and deep analysis
- **Moonshot (Kimi)**: Outstanding Chinese large language model

## 🔒 Privacy & Security

- ✅ API keys are encrypted with AES-256-GCM and stored locally
- ✅ No personal information or browsing history is collected
- ✅ Text is only sent to AI services when you actively click the button
- ✅ All data processing is done by your chosen AI service provider

## ⚙️ Important Notes

**Requires Your Own API Key**: This extension requires you to register with an AI service provider (OpenAI, Claude, or Moonshot) and obtain an API key. We do not provide API keys, nor do we collect or store your keys.

**Data Processing**: Selected text will be sent to your chosen AI service provider for processing. Please review each provider's privacy policy:

- OpenAI: https://openai.com/privacy
- Anthropic: https://www.anthropic.com/privacy
- Moonshot: https://www.moonshot.cn/privacy

## 📞 Support & Feedback

If you have any questions or suggestions, please contact us:

- GitHub: [Project URL]
- Email: [Contact Email]

## 📄 Open Source License

This project is open source under the MIT License. Contributions and suggestions are welcome.

---

**Make complex content simple, start with SmartRead AI!**
```

---

## 隐私政策

### 📄 隐私政策内容

**需要创建独立页面**（可托管在 GitHub Pages 或自己的网站）

**文件名**：`privacy-policy.html` 或 `privacy-policy.md`

**内容模板**：

```markdown
# 智阅 AI 隐私政策

**生效日期**：2026-01-28  
**最后更新**：2026-01-28

## 概述

智阅 AI（"本扩展"）致力于保护用户隐私。本隐私政策说明我们如何收集、使用和保护您的信息。

## 信息收集

### 我们收集的信息

1. **API 密钥**
   - 您在设置页面输入的 AI 服务 API 密钥
   - 存储方式：使用 AES-256-GCM 加密后存储在浏览器本地存储中
   - 用途：用于调用您选择的 AI 服务

2. **用户选中的文本**
   - 您在网页上选中并主动点击"简化"或"解释"按钮的文本
   - 处理方式：发送到您选择的 AI 服务商进行处理
   - 存储：不存储在本地或任何服务器

3. **扩展设置**
   - 您的偏好设置（如默认 AI 服务商）
   - 存储方式：存储在浏览器本地存储中
   - 用途：提供个性化体验

### 我们不收集的信息

- ❌ 个人身份信息（姓名、邮箱、电话等）
- ❌ 浏览历史记录
- ❌ 网页内容（除非您主动选中并点击按钮）
- ❌ 设备信息
- ❌ 位置信息

## 信息使用

### 数据流向
```

用户选中文本 → 点击按钮 → 发送到 AI 服务商 → 返回结果 → 显示给用户

```

### 第三方服务

本扩展使用以下第三方 AI 服务（根据您的选择）：

1. **OpenAI**
   - 服务：GPT-4 等模型
   - 隐私政策：https://openai.com/privacy
   - 数据处理：根据 OpenAI 隐私政策

2. **Anthropic Claude**
   - 服务：Claude 3.5 Sonnet 等模型
   - 隐私政策：https://www.anthropic.com/privacy
   - 数据处理：根据 Anthropic 隐私政策

3. **Moonshot AI**
   - 服务：Kimi 等模型
   - 隐私政策：https://www.moonshot.cn/privacy
   - 数据处理：根据 Moonshot 隐私政策

**重要说明**：
- 您需要自行注册这些服务并同意其隐私政策
- 我们不控制这些服务如何处理您的数据
- 请查看各服务商的隐私政策了解详情

## 数据安全

### 安全措施

1. **API 密钥加密**
   - 使用 AES-256-GCM 加密算法
   - 密钥存储在浏览器本地，不上传到任何服务器

2. **HTTPS 通信**
   - 所有与 AI 服务的通信都使用 HTTPS 加密

3. **最小权限原则**
   - 只请求必需的浏览器权限
   - 不访问不必要的网页内容

### 数据存储

- **本地存储**：API 密钥和设置存储在浏览器本地
- **不使用服务器**：我们不运营任何服务器，不存储任何用户数据
- **数据控制**：您可以随时删除扩展来清除所有本地数据

## 用户权利

### 您的权利

1. **访问权**：查看存储的 API 密钥和设置
2. **删除权**：随时删除 API 密钥和设置
3. **控制权**：选择使用哪个 AI 服务商
4. **退出权**：随时卸载扩展

### 如何行使权利

- **查看数据**：打开扩展设置页面
- **删除数据**：在设置页面删除 API 密钥，或卸载扩展
- **导出数据**：设置页面提供数据导出功能（未来版本）

## 儿童隐私

本扩展不针对 13 岁以下儿童。我们不会故意收集儿童的个人信息。

## 政策更新

我们可能会不时更新本隐私政策。更新后的政策将在扩展更新时生效。重大变更会在扩展中通知用户。

## 联系我们

如有关于隐私政策的问题，请联系：

- **Email**：[您的邮箱]
- **GitHub**：[项目地址]

## 合规声明

本扩展遵守以下法规：
- Chrome Web Store 开发者政策
- GDPR（欧盟通用数据保护条例）
- CCPA（加州消费者隐私法案）

---

**最后更新日期**：2026-01-28
```

### 📌 隐私政策托管

**选项 1：GitHub Pages（推荐）**

1. 在项目根目录创建 `docs/privacy-policy.md`
2. 在 GitHub 仓库设置中启用 GitHub Pages
3. 选择 `docs` 目录作为源
4. 访问 URL：`https://[username].github.io/[repo]/privacy-policy.html`

**选项 2：自己的网站**

将隐私政策上传到您的网站，确保 URL 稳定且可访问。

**选项 3：GitHub Gist**

创建一个公开的 Gist，使用 `https://gist.github.com/[username]/[gist-id]`

---

## 审核说明

### 📋 审核说明模板

**在 Chrome Web Store 开发者控制台的"审核说明"字段中填写**：

```markdown
# 智阅 AI - 审核说明

## 扩展概述

智阅 AI 是一个文本简化和术语解释工具，帮助用户理解网页上的复杂内容。

## 核心功能

1. **文本简化**：将复杂文本转换为易懂的表达
2. **术语解释**：对专业术语进行详细解释
3. **快速复制**：一键复制文本或结果

## 技术实现说明

### 代码合规性

- ✅ 所有业务逻辑都包含在扩展包内（src/ 目录）
- ✅ 使用标准 fetch() API 调用第三方 AI 服务
- ✅ API 返回 JSON 数据，不执行任何远程代码
- ✅ 不使用 eval() 或动态代码执行
- ✅ 符合 Manifest V3 所有要求

### 第三方服务

本扩展调用以下 AI 服务 API（用户需自己的 API 密钥）：

1. **OpenAI API**
   - 端点：https://api.openai.com/v1/chat/completions
   - 用途：文本简化和解释
   - 数据流：发送文本 → 接收 JSON 响应

2. **Anthropic Claude API**
   - 端点：https://api.anthropic.com/v1/messages
   - 用途：文本简化和解释
   - 数据流：发送文本 → 接收 JSON 响应

3. **Moonshot AI API**
   - 端点：https://api.moonshot.cn/v1/chat/completions
   - 用途：文本简化和解释
   - 数据流：发送文本 → 接收 JSON 响应

**重要说明**：

- 所有 API 调用仅用于数据处理，不执行远程代码
- 用户使用自己的 API 密钥，我们不提供或存储密钥
- API 密钥使用 AES-256-GCM 加密存储在本地

## 测试步骤

### 准备工作

**测试 API 密钥**（OpenAI）：
```

sk-proj-[测试密钥]

```

**额度限制**：$5（仅供审核测试使用）

**注意**：此密钥将在审核完成后撤销。

### 详细测试步骤

#### 步骤 1：安装扩展

1. 解压 ZIP 包到本地目录
2. 打开 Chrome 浏览器
3. 访问 `chrome://extensions/`
4. 开启"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的目录

#### 步骤 2：配置 API 密钥

1. 点击浏览器工具栏中的扩展图标
2. 在弹出窗口中点击"设置"按钮
3. 进入"AI 配置"标签页
4. 在"OpenAI GPT-4"输入框中粘贴测试密钥
5. 选择"OpenAI GPT-4"为默认服务商（点击"默认"单选按钮）
6. 点击底部"保存设置"按钮
7. 看到"设置已保存"提示

#### 步骤 3：测试文本简化功能

1. 访问任意网页（推荐：https://en.wikipedia.org/wiki/Artificial_intelligence）
2. 选中一段复杂文本（约 100-200 字）
3. 等待工具栏出现在选中文本上方
4. 点击工具栏中的"简化"按钮（💡 图标）
5. 观察：
   - 工具栏显示加载状态
   - 结果卡片出现并显示加载动画
   - 3-5 秒后显示简化后的文本
   - 结果卡片包含：简化文本、元数据（领域、置信度等）
6. 点击"复制"按钮，验证文本已复制到剪贴板

#### 步骤 4：测试术语解释功能

1. 在同一网页上选中一个专业术语（如"Machine Learning"）
2. 点击工具栏中的"解释"按钮（📖 图标）
3. 观察：
   - 显示加载状态
   - 3-5 秒后显示详细解释
   - 解释包含：基础概念、应用场景、关键术语高亮
4. 验证关键术语在文本中被高亮显示（淡黄色背景）

#### 步骤 5：测试其他功能

1. **关闭结果卡片**：点击卡片右上角的 ✕ 按钮
2. **多次使用**：重复步骤 3-4，验证功能稳定性
3. **不同网站**：在其他网站测试（如技术博客、新闻网站）

### 预期结果

- ✅ 扩展安装成功，无错误提示
- ✅ API 密钥配置成功
- ✅ 文本简化功能正常，返回简化后的文本
- ✅ 术语解释功能正常，返回详细解释
- ✅ 结果卡片显示正常，样式美观
- ✅ 复制功能正常
- ✅ 无控制台错误

### 常见问题

**Q: 工具栏不显示？**
A: 确保选中了足够长的文本（至少 10 个字符）

**Q: API 调用失败？**
A: 检查 API 密钥是否正确配置，或联系开发者

**Q: 结果显示慢？**
A: AI 处理需要 3-5 秒，这是正常的

## 其他服务商说明

### Claude 和 Moonshot

- 实现方式与 OpenAI 完全相同
- 仅 API 端点和请求格式略有不同
- 核心逻辑（提示词构建、响应解析）完全一致
- 如需测试，可提供额外的测试密钥

### 代码位置

- **API 调用**：`src/services/ai/cloud-ai-engine.ts`
- **简化服务**：`src/services/simplify-service.ts`
- **解释服务**：`src/services/explain-service.ts`
- **内容脚本**：`src/content/index.tsx`

## 隐私政策

**URL**：[您的隐私政策 URL]

详细说明了数据收集、使用和保护措施。

## 联系方式

如有任何问题，请联系：

- **Email**：[您的邮箱]
- **GitHub**：[项目地址]

我们会在 24 小时内回复审核相关问题。

---

**感谢审核！**
```

### 📌 审核说明要点

1. **清晰说明技术实现**：强调不执行远程代码
2. **提供详细测试步骤**：让审核员能轻松测试
3. **包含测试密钥**：方便审核员直接测试
4. **说明其他服务商**：避免审核员要求测试所有服务
5. **提供联系方式**：便于审核员提问

---

## 截图和宣传图

### 📸 截图要求

**必需**：至少 1 张，最多 5 张

**尺寸要求**：

- 1280x800 像素（推荐）
- 或 640x400 像素
- PNG 或 JPG 格式

**内容建议**：

#### 截图 1：主要功能展示

- **场景**：在网页上选中文本，显示工具栏
- **要点**：
  - 清晰的文本选择
  - 工具栏位置明显
  - 简化和解释按钮清晰可见
- **标注**：可添加箭头和文字说明

#### 截图 2：简化结果展示

- **场景**：显示简化后的结果卡片
- **要点**：
  - 原文和简化文本对比
  - 结果卡片样式美观
  - 元数据信息清晰
- **标注**：突出关键功能

#### 截图 3：解释结果展示

- **场景**：显示术语解释结果
- **要点**：
  - 详细的解释内容
  - 关键词高亮效果
  - 分层解释结构
- **标注**：说明解释的深度

#### 截图 4：设置页面

- **场景**：AI 配置页面
- **要点**：
  - 多个 AI 服务商选项
  - API 密钥输入框
  - 安全提示信息
- **标注**：强调隐私保护

#### 截图 5：使用说明（Popup）

- **场景**：扩展 Popup 页面
- **要点**：
  - 3 步使用引导
  - 核心功能介绍
  - 支持的 AI 服务
- **标注**：突出易用性

### 📸 截图制作步骤

```bash
# 1. 准备测试环境
# - 安装扩展
# - 配置 API 密钥
# - 准备测试网页

# 2. 截取屏幕
# - Windows: Win + Shift + S
# - Mac: Cmd + Shift + 4
# - 或使用截图工具

# 3. 编辑截图
# - 裁剪到合适尺寸
# - 添加标注和箭头
# - 调整亮度和对比度

# 4. 导出
# - 格式：PNG（推荐）或 JPG
# - 尺寸：1280x800 或 640x400
# - 文件名：screenshot-1.png, screenshot-2.png, ...
```

### 🎨 宣传图（可选）

**尺寸**：440x280 像素

**内容建议**：

- 扩展 Logo
- 扩展名称
- 核心功能图标
- 简短标语

**设计工具**：

- Figma（推荐）
- Canva
- Photoshop
- GIMP（免费）

### 📦 图片文件组织

```
webstore-assets/
├── icon-128.png          # 商店图标（从 dist/icons/ 复制）
├── screenshots/
│   ├── screenshot-1.png  # 主要功能展示
│   ├── screenshot-2.png  # 简化结果
│   ├── screenshot-3.png  # 解释结果
│   ├── screenshot-4.png  # 设置页面
│   └── screenshot-5.png  # 使用说明
└── promo/
    └── promo-440x280.png # 宣传图（可选）
```

---

## 发布步骤

### 🚀 完整发布流程

#### 第一步：注册开发者账号

1. 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)
2. 使用 Google 账号登录
3. 支付一次性注册费用（$5 USD）
4. 完成开发者信息填写

#### 第二步：准备发布物料

**检查清单**：

```bash
# 1. 构建扩展包
pnpm build
cd dist && zip -r ../smart-read-ai-v0.1.1.zip . && cd ..

# 2. 准备图片资源
mkdir -p webstore-assets/screenshots
mkdir -p webstore-assets/promo
cp dist/icons/icon-128.png webstore-assets/

# 3. 创建隐私政策页面
# 上传到 GitHub Pages 或自己的网站

# 4. 准备测试 API 密钥
# 创建一个有限额度的 OpenAI 测试密钥

# 5. 准备文案
# 复制本文档中的商店描述和审核说明
```

#### 第三步：创建新项目

1. 在开发者控制台点击"新增项"
2. 上传 `smart-read-ai-v0.1.1.zip`
3. 等待上传完成（通常 1-2 分钟）

#### 第四步：填写商店信息

##### 1. 商品详情

**扩展名称**：

```
智阅 AI - 文本简化与解释助手
```

**简短描述**：

```
让复杂文本变简单，用 AI 帮你理解专业术语和难懂内容
```

**详细描述**：

- 复制本文档"商店描述文案"部分的详细描述
- 支持 Markdown 格式
- 确保格式正确，链接有效

**类别**：

- 主类别：生产力工具（Productivity）
- 次类别：开发者工具（Developer Tools）或教育（Education）

**语言**：

- 中文（简体）
- 英文（可选，提供英文版描述）

##### 2. 图形资源

**商店图标**：

- 上传 `webstore-assets/icon-128.png`
- 尺寸：128x128 像素

**截图**：

- 按顺序上传 5 张截图
- 第一张最重要，会在搜索结果中显示

**宣传图**（可选）：

- 上传 `webstore-assets/promo/promo-440x280.png`
- 尺寸：440x280 像素

##### 3. 隐私实践

**隐私政策 URL**：

```
https://[your-domain]/privacy-policy.html
```

**数据使用披露**：

勾选以下项目：

- ☑️ 个人通信（用户选中的文本）
- ☑️ 网站内容（用于文本选择）

**数据处理说明**：

```
本扩展收集用户选中的文本并发送到用户选择的第三方 AI 服务（OpenAI、Claude 或 Moonshot）进行处理。API 密钥加密存储在本地，不上传到任何服务器。
```

**认证使用**：

- 选择"否"（不使用 OAuth 等认证）

##### 4. 分发

**可见性**：

- 选择"公开"（Public）
- 或"不公开"（Unlisted）- 仅通过链接访问

**地区**：

- 选择"所有地区"
- 或指定特定国家/地区

**定价**：

- 选择"免费"

##### 5. 审核说明

**测试账号**（可选）：

```
不需要测试账号
```

**审核说明**：

- 复制本文档"审核说明"部分的完整内容
- 包含测试 API 密钥
- 包含详细测试步骤

**演示视频**（可选）：

- 如有 YouTube 视频，填写链接
- 建议录制 2-3 分钟的功能演示

#### 第五步：提交审核

1. 检查所有信息是否填写完整
2. 预览商店页面
3. 点击"提交审核"按钮
4. 确认提交

#### 第六步：等待审核

**审核时间**：

- 通常 1-3 个工作日
- 复杂扩展可能需要 5-7 天
- 节假日可能延长

**审核状态**：

- **待审核**（Pending Review）：已提交，等待审核
- **审核中**（In Review）：审核员正在审核
- **需要更多信息**（Needs More Info）：审核员有疑问
- **已拒绝**（Rejected）：未通过审核，需要修改
- **已发布**（Published）：审核通过，已上架

**邮件通知**：

- Google 会发送邮件通知审核状态
- 注意查收注册邮箱

#### 第七步：处理审核反馈

**如果被拒绝**：

1. 查看拒绝原因（邮件或控制台）
2. 根据反馈修改代码或说明
3. 重新构建和打包
4. 上传新版本
5. 在"审核说明"中说明修改内容
6. 重新提交

**常见拒绝原因**：

- 隐私政策不完整或无法访问
- 功能说明不清晰
- 权限使用不合理
- 代码可读性问题
- 违反内容政策

**申诉流程**：

- 如认为拒绝不合理，可以申诉
- 在控制台点击"申诉"按钮
- 提供详细说明和证据

#### 第八步：发布成功

**发布后操作**：

1. **验证商店页面**
   - 访问扩展的商店页面
   - 检查所有信息显示正确
   - 测试安装流程

2. **撤销测试密钥**
   - 删除或禁用提供给审核的测试 API 密钥
   - 确保不会产生额外费用

3. **监控反馈**
   - 定期查看用户评论
   - 及时回复用户问题
   - 收集改进建议

4. **推广扩展**
   - 在社交媒体分享
   - 在相关社区发布
   - 更新项目 README

5. **准备更新**
   - 根据用户反馈改进功能
   - 修复发现的 bug
   - 规划下一个版本

---

## 常见问题

### ❓ 发布前问题

**Q1: 需要支付费用吗？**

A: 需要一次性支付 $5 USD 的开发者注册费用。之后发布扩展不再收费。

**Q2: 审核需要多长时间？**

A: 通常 1-3 个工作日，复杂扩展可能需要 5-7 天。节假日可能延长。

**Q3: 必须提供所有 AI 服务商的测试密钥吗？**

A: 不需要。只需提供一个服务商（如 OpenAI）的测试密钥即可。在审核说明中说明其他服务商的实现方式相同。

**Q4: 隐私政策必须是独立页面吗？**

A: 是的。必须提供一个可访问的 URL，不能直接在商店描述中写隐私政策。

**Q5: 可以使用中文提交吗？**

A: 可以。商店描述、审核说明都可以使用中文。但建议同时提供英文版本，便于国际用户使用。

---

### ❓ 审核问题

**Q6: 审核被拒绝怎么办？**

A:

1. 仔细阅读拒绝原因
2. 根据反馈修改代码或说明
3. 在审核说明中详细说明修改内容
4. 重新提交审核

**Q7: 如何加快审核速度？**

A:

- 提供详细的审核说明和测试步骤
- 包含测试 API 密钥
- 确保隐私政策可访问
- 代码清晰易读
- 功能说明完整

**Q8: 审核员看不懂中文怎么办？**

A: 建议提供英文版的审核说明。如果只有中文版，审核员可能会要求补充英文说明。

**Q9: 可以在审核期间修改扩展吗？**

A: 不建议。如需修改，应先撤回当前审核，修改后重新提交。

---

### ❓ 技术问题

**Q10: 调用外部 API 会被拒绝吗？**

A: 不会。只要：

- 所有业务逻辑在扩展包内
- API 仅用于数据处理，不执行远程代码
- 提供完整的隐私政策
- 权限声明合理

详见：`docs/CHROME_WEBSTORE_API_POLICY.md`

**Q11: 需要提供源代码吗？**

A: 不需要。但代码必须可读（不能过度混淆）。使用 Terser 压缩是允许的。

**Q12: Manifest V3 有什么特殊要求？**

A:

- 不能执行远程代码
- 不能使用 eval()
- 必须符合 CSP 要求
- 代码必须可读

详见：`docs/chrome-extension-best-practices.md`

**Q13: 如何处理 CSP 警告？**

A: 如果功能正常，CSP 警告可以忽略（可能来自 React 内部依赖）。如果功能异常，检查代码中的动态执行。

---

### ❓ 发布后问题

**Q14: 如何更新扩展？**

A:

1. 修改代码，更新 manifest.json 中的版本号
2. 重新构建和打包
3. 在开发者控制台上传新版本
4. 填写更新说明
5. 提交审核

**Q15: 用户如何获得更新？**

A: Chrome 会自动更新扩展，通常在 24-48 小时内推送给所有用户。

**Q16: 可以删除已发布的扩展吗？**

A: 可以。在开发者控制台选择"取消发布"。但已安装的用户仍可继续使用。

**Q17: 如何回复用户评论？**

A: 在开发者控制台的"评论"标签中可以查看和回复用户评论。

**Q18: 如何查看扩展统计数据？**

A: 在开发者控制台的"统计信息"标签中可以查看安装量、评分、用户反馈等数据。

---

### ❓ 政策问题

**Q19: 可以在扩展中展示广告吗？**

A: 可以，但必须：

- 在隐私政策中说明
- 广告不能干扰核心功能
- 不能展示欺骗性广告
- 遵守广告政策

**Q20: 可以收集用户数据吗？**

A: 可以，但必须：

- 在隐私政策中详细说明
- 获得用户同意
- 遵守 GDPR、CCPA 等法规
- 只收集必要的数据

**Q21: 可以使用第三方库吗？**

A: 可以。但必须：

- 包含在扩展包内（不能远程加载）
- 不违反第三方库的许可协议
- 不包含恶意代码

---

## 📞 获取帮助

### 官方资源

- [Chrome Web Store 开发者文档](https://developer.chrome.com/docs/webstore/)
- [开发者政策](https://developer.chrome.com/docs/webstore/program_policies)
- [开发者支持](https://support.google.com/chrome_webstore/contact/developer_support)

### 社区资源

- [Chrome Extensions Google Group](https://groups.google.com/a/chromium.org/g/chromium-extensions)
- [Stack Overflow - Chrome Extension](https://stackoverflow.com/questions/tagged/google-chrome-extension)
- [Reddit - r/chrome_extensions](https://www.reddit.com/r/chrome_extensions/)

### 项目资源

- **GitHub Issues**: [项目地址]/issues
- **Email**: [联系邮箱]
- **文档**: 查看 `docs/` 目录下的其他文档

---

## ✅ 最终检查清单

在点击"提交审核"前，最后检查一遍：

### 代码和构建

- [ ] 代码构建成功（`pnpm build`）
- [ ] 本地测试所有功能正常
- [ ] manifest.json 版本号正确
- [ ] ZIP 包大小合理（< 100 MB）
- [ ] 不包含不必要的文件

### 商店信息

- [ ] 扩展名称清晰准确
- [ ] 简短描述吸引人（< 132 字符）
- [ ] 详细描述完整（包含功能、使用方法、注意事项）
- [ ] 类别选择正确
- [ ] 语言设置正确

### 图形资源

- [ ] 商店图标清晰（128x128）
- [ ] 至少 1 张截图（推荐 5 张）
- [ ] 截图尺寸正确（1280x800 或 640x400）
- [ ] 截图内容清晰，展示核心功能
- [ ] 宣传图（可选）

### 隐私和安全

- [ ] 隐私政策页面可访问
- [ ] 隐私政策内容完整
- [ ] 数据使用披露准确
- [ ] 权限声明合理
- [ ] API 密钥加密存储

### 审核材料

- [ ] 审核说明详细完整
- [ ] 包含测试 API 密钥
- [ ] 测试步骤清晰易懂
- [ ] 说明技术实现方式
- [ ] 提供联系方式

### 合规性

- [ ] 符合 Manifest V3 要求
- [ ] 不执行远程代码
- [ ] 不使用 eval()
- [ ] 符合 CSP 要求
- [ ] 代码可读（不过度混淆）

---

## 🎉 祝贺

如果您已经完成了所有准备工作，现在可以自信地提交审核了！

**记住**：

- 第一次提交可能会被拒绝，这很正常
- 根据反馈耐心修改
- 保持与审核员的良好沟通
- 持续改进扩展功能

**祝您发布顺利！** 🚀

---

**文档版本**：v1.0  
**最后更新**：2026-01-28  
**维护者**：智阅 AI 团队
