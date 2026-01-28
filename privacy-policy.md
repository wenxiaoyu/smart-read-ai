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

- **GitHub**：https://github.com/wenxiaoyu/smart-read-ai/blob/main/privacy-policy.md
- **Email**：[157085863@qq.com]

## 合规声明

本扩展遵守以下法规：

- Chrome Web Store 开发者政策
- GDPR（欧盟通用数据保护条例）
- CCPA（加州消费者隐私法案）

## 详细权限说明

### storage 权限

- **用途**：存储 API 密钥和用户设置
- **数据类型**：加密的 API 密钥、默认服务商选择
- **存储位置**：浏览器本地存储（chrome.storage.local）

### activeTab 权限

- **用途**：读取用户选中的文本
- **触发条件**：仅在用户主动点击"简化"或"解释"按钮时
- **访问范围**：仅当前活动标签页的选中文本

### host_permissions

- **用途**：调用 AI 服务 API
- **域名**：
  - https://api.openai.com/*
  - https://api.anthropic.com/*
  - https://api.moonshot.cn/*
- **数据传输**：仅发送用户选中的文本，接收 AI 处理结果

## 数据保留

- **API 密钥**：永久存储在本地，直到用户删除或卸载扩展
- **用户设置**：永久存储在本地，直到用户删除或卸载扩展
- **选中文本**：不存储，仅在处理时临时使用
- **AI 响应**：不存储，仅显示给用户

## 数据共享

我们不会与任何第三方共享您的数据，除了：

- 您选择的 AI 服务商（用于处理文本）
- 法律要求的情况（如法院命令）

## 安全事件响应

如果发生数据泄露或安全事件：

1. 我们会立即调查并采取补救措施
2. 在 72 小时内通知受影响的用户
3. 在扩展更新中修复安全漏洞
4. 在 GitHub 上公开披露事件详情

## 用户责任

作为用户，您应该：

- 妥善保管您的 API 密钥
- 不要在公共场所使用扩展处理敏感信息
- 定期检查 API 密钥的使用情况
- 及时更新扩展到最新版本

## 第三方链接

本扩展可能包含指向第三方网站的链接。我们不对这些网站的隐私实践负责。请查看这些网站的隐私政策。

## 国际数据传输

如果您使用国际 AI 服务（如 OpenAI），您的数据可能会被传输到其他国家。请查看各服务商的数据传输政策。

## Cookie 和跟踪技术

本扩展不使用 Cookie 或任何跟踪技术。我们不跟踪您的浏览行为。

## 营销通信

我们不会向您发送任何营销邮件或通知。所有通知都与扩展功能相关。

## 数据可移植性

您可以随时导出您的设置数据（未来版本将提供此功能）。导出的数据为 JSON 格式，可用于备份或迁移。

## 自动化决策

本扩展不使用自动化决策或分析技术。所有 AI 处理都由您选择的第三方服务商完成。

## 争议解决

如对本隐私政策有任何争议，请先通过上述联系方式与我们沟通。如无法解决，可寻求法律途径。

---

**最后更新日期**：2026-01-28

**版本**：1.0

**语言**：简体中文

---

# SmartRead AI Privacy Policy

**Effective Date**: January 28, 2026  
**Last Updated**: January 28, 2026

## Overview

SmartRead AI ("the Extension") is committed to protecting user privacy. This privacy policy explains how we collect, use, and protect your information.

## Information Collection

### Information We Collect

1. **API Keys**
   - AI service API keys you enter in the settings page
   - Storage: Encrypted with AES-256-GCM and stored in browser local storage
   - Purpose: To call your chosen AI service

2. **Selected Text**
   - Text you select on web pages and actively click "Simplify" or "Explain" button
   - Processing: Sent to your chosen AI service provider for processing
   - Storage: Not stored locally or on any server

3. **Extension Settings**
   - Your preference settings (such as default AI service provider)
   - Storage: Stored in browser local storage
   - Purpose: To provide personalized experience

### Information We Do Not Collect

- ❌ Personal identification information (name, email, phone, etc.)
- ❌ Browsing history
- ❌ Web page content (unless you actively select and click button)
- ❌ Device information
- ❌ Location information

## Information Use

### Data Flow

```
User selects text → Clicks button → Sent to AI provider → Returns result → Displayed to user
```

### Third-Party Services

This extension uses the following third-party AI services (based on your choice):

1. **OpenAI**
   - Service: GPT-4 and other models
   - Privacy Policy: https://openai.com/privacy
   - Data Processing: According to OpenAI privacy policy

2. **Anthropic Claude**
   - Service: Claude 3.5 Sonnet and other models
   - Privacy Policy: https://www.anthropic.com/privacy
   - Data Processing: According to Anthropic privacy policy

3. **Moonshot AI**
   - Service: Kimi and other models
   - Privacy Policy: https://www.moonshot.cn/privacy
   - Data Processing: According to Moonshot privacy policy

**Important Notes**:

- You need to register with these services and agree to their privacy policies
- We do not control how these services process your data
- Please review each provider's privacy policy for details

## Data Security

### Security Measures

1. **API Key Encryption**
   - Uses AES-256-GCM encryption algorithm
   - Keys stored locally in browser, not uploaded to any server

2. **HTTPS Communication**
   - All communication with AI services uses HTTPS encryption

3. **Principle of Least Privilege**
   - Only requests necessary browser permissions
   - Does not access unnecessary web page content

### Data Storage

- **Local Storage**: API keys and settings stored in browser locally
- **No Server**: We do not operate any servers, do not store any user data
- **Data Control**: You can delete the extension at any time to clear all local data

## User Rights

### Your Rights

1. **Right to Access**: View stored API keys and settings
2. **Right to Delete**: Delete API keys and settings at any time
3. **Right to Control**: Choose which AI service provider to use
4. **Right to Withdraw**: Uninstall the extension at any time

### How to Exercise Rights

- **View Data**: Open extension settings page
- **Delete Data**: Delete API keys in settings page, or uninstall extension
- **Export Data**: Settings page will provide data export function (future version)

## Children's Privacy

This extension is not directed at children under 13. We do not knowingly collect personal information from children.

## Policy Updates

We may update this privacy policy from time to time. Updated policies will take effect when the extension is updated. Major changes will be notified to users in the extension.

## Contact Us

If you have questions about this privacy policy, please contact:

- **GitHub**: https://github.com/[your-username]/[your-repo]
- **Email**: [your-email@example.com]

## Compliance Statement

This extension complies with:

- Chrome Web Store Developer Policies
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)

---

**Last Updated**: January 28, 2026

**Version**: 1.0

**Language**: English
