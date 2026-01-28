# 简化功能技术设计

## Context

智阅 AI 是一个 Chrome 扩展，旨在帮助用户理解复杂的技术文档、学术论文等内容。文本简化是核心功能之一，需要能够智能识别文本领域并提供准确的简化结果。

**背景：**
- 用户经常遇到长难句和专业术语
- 不同领域的文本需要不同的简化策略
- 需要平衡准确性和响应速度

**约束：**
- 必须兼容 Chrome Extension Manifest V3
- 必须遵守 CSP（Content Security Policy）
- 需要用户提供云端 AI 的 API 密钥
- 依赖网络连接

**利益相关者：**
- 用户：需要准确的简化结果，愿意配置 API 密钥
- 开发者：需要可维护、可扩展的架构

## Goals / Non-Goals

### Goals

- 提供准确的文本简化功能（准确率 95%+）
- 支持多个云端 AI 提供商（GPT-4、Claude、文心一言）
- 保护用户隐私（API 密钥加密存储）
- 提供清晰的错误提示

### Non-Goals

- 不支持离线模式（完全依赖云端 AI）
- 不支持图片中的文本识别（OCR）- 留待未来
- 不支持批量简化 - 留待未来
- 不支持自定义 Prompt - 留待未来

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Content Script                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SelectionToolbar (用户点击"简化"按钮)                  │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                           │
│                   ▼                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           SimplifyService (统一调度)                    │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  1. TextPreprocessor (预处理)                    │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  2. 调用云端 AI 引擎                             │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  3. 返回结果或错误                               │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                           │
│                   ▼                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ResultCard (展示简化结果或错误)                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AI Engine (引擎层)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         CloudAIEngine (GPT-4/Claude/文心一言)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**SimplifyService**
- 调用云端 AI 引擎
- 处理错误和超时
- 管理 API 密钥配置

**TextPreprocessor**
- 清理文本（去除多余空白）
- 检测语言（中文/英文/混合）
- 标准化格式

**CloudAIEngine**
- 调用云端 AI API（GPT-4、Claude、文心一言）
- 统一不同提供商的接口
- 处理网络错误和超时

## Decisions

### Decision 1: 用 AI 替代正则表达式进行领域识别

**What:** 使用 AI 一次性完成领域识别和文本简化，而不是先用正则表达式识别领域，再调用 AI 简化。

**Why:**
- 正则表达式规则脆弱，准确率低（60-70%）
- AI 能够理解语义，准确率高（90-95%）
- 减少 API 调用次数（一次完成两个任务）
- 降低维护成本（不需要维护大量规则）

**Alternatives considered:**
- 使用正则表达式 + 关键词匹配：准确率低，维护成本高
- 使用机器学习模型进行领域分类：需要训练数据和模型部署，复杂度高

**Trade-offs:**
- 优点：准确率高，维护成本低，开发速度快
- 缺点：依赖 AI 的输出格式，需要解析容错

### Decision 2: 只使用云端 AI，不提供降级方案

**What:** 只使用云端 AI（GPT-4、Claude、文心一言），失败时直接显示错误。

**Why:**
- 云端 AI 准确率最高（95%+）
- 架构简单，易于维护
- 用户期望高质量的简化结果
- 降级方案（规则引擎）准确率低，用户体验差

**Alternatives considered:**
- 提供规则引擎降级：准确率低（60%），用户体验差
- 使用本地 AI（Gemini Nano）：地区受限，浏览器兼容性问题

**Trade-offs:**
- 优点：准确率高，架构简单
- 缺点：需要用户配置 API 密钥，网络依赖

### Decision 3: 结构化 Prompt 设计

**What:** 要求 AI 返回结构化的文本输出，而不是 JSON。

**Why:**
- AI 对自然语言格式的理解更好
- 避免 JSON 解析错误（引号、转义等）
- 更容易添加解析容错逻辑

**Format:**
```
领域：[领域名称]
置信度：[0-1之间的数字]
简化：[简化后的文本]
关键术语：[术语1, 术语2, ...]
```

**Alternatives considered:**
- 返回 JSON：解析更严格，但容易出错
- 返回纯文本：无法提取元数据

**Trade-offs:**
- 优点：容错性好，易于解析
- 缺点：需要正则表达式解析

### Decision 4: API 密钥加密存储

**What:** 使用 AES-256-GCM 加密 API 密钥，密钥派生自设备指纹。

**Why:**
- 保护用户的 API 密钥不被窃取
- 符合安全最佳实践
- Chrome Storage 不加密存储

**Alternatives considered:**
- 明文存储：不安全
- 使用用户密码加密：需要用户输入密码，体验差
- 使用 Chrome Identity API：复杂度高，需要 OAuth

**Trade-offs:**
- 优点：安全性高，用户体验好
- 缺点：设备指纹可能变化（重装系统等）

### Decision 5: 不实现缓存（MVP 阶段）

**What:** MVP 阶段不实现简化结果的缓存。

**Why:**
- 简化实现，快速验证核心功能
- 缓存命中率可能不高（用户很少简化相同文本）
- 可以在未来根据实际使用情况决定是否添加

**Alternatives considered:**
- 实现缓存：增加复杂度，收益不确定

**Trade-offs:**
- 优点：实现简单，快速上线
- 缺点：重复简化相同文本时响应较慢

## Data Models

### PreprocessedText

```typescript
interface PreprocessedText {
  original: string;      // 原始文本
  cleaned: string;       // 清理后的文本
  length: number;        // 字符数
  language: 'zh' | 'en' | 'mixed';  // 语言
}
```

### SimplifyRequest

```typescript
interface SimplifyRequest {
  text: string;          // 要简化的文本
  language: 'zh' | 'en' | 'mixed';  // 语言
  maxLength?: number;    // 可选：期望的最大长度
}
```

### SimplifyResult

```typescript
interface SimplifyResult {
  simplified: string;      // 简化后的文本
  domain: string;          // AI 识别的领域
  confidence: number;      // 置信度 0-1
  keyTerms?: string[];     // 关键术语（可选）
  processingTime: number;  // 处理时间（毫秒）
  provider: 'gpt4' | 'claude' | 'wenxin';  // 使用的提供商
}
```

### AIEngine Interface

```typescript
interface AIEngine {
  simplify(request: SimplifyRequest): Promise<SimplifyResult>;
  isAvailable(): Promise<boolean>;
}
```

## Component Implementations

### 1. TextPreprocessor（文本预处理器）

**职责：**
- 清理文本（去除多余空白）
- 检测语言（中文/英文/混合）
- 标准化格式

**实现要点：**
- 使用正则表达式进行基础清理
- 基于字符范围检测语言（中文：\u4e00-\u9fa5，英文：a-zA-Z）
- 处理时间必须 < 10ms

**文件位置：** `src/services/text-preprocessor.ts`

### 2. CloudAIEngine（云端 AI 引擎）

**职责：**
- 调用云端 AI API（GPT-4、Claude、文心一言）
- 统一不同提供商的接口
- 处理网络错误和超时

**实现要点：**
- 支持多个提供商（通过策略模式）
- 使用结构化 Prompt 格式
- 处理不同 API 的请求/响应格式
- 实现超时控制（10 秒）
- 实现重试机制（最多 2 次）
- 响应时间目标：≤ 10 秒

**API 集成：**

1. **OpenAI GPT-4**
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - 认证: `Authorization: Bearer {apiKey}`
   - 模型: `gpt-4`

2. **Anthropic Claude**
   - Endpoint: `https://api.anthropic.com/v1/messages`
   - 认证: `x-api-key: {apiKey}`
   - 模型: `claude-3-sonnet-20240229`

3. **百度文心一言**
   - Endpoint: 待定
   - 认证: 待定
   - 模型: 待定

**文件位置：** `src/services/ai/cloud-ai-engine.ts`

### 3. SimplifyService（简化服务）

**职责：**
- 调用云端 AI 引擎
- 处理错误和超时
- 管理 API 密钥配置

**实现要点：**
- 调用云端 AI 进行简化
- 处理所有错误情况
- 记录使用的提供商类型

**错误处理：**
- API 密钥无效：显示错误，提示用户检查设置
- 网络错误：显示错误，建议检查网络连接
- 超时：显示错误，建议重试
- 其他错误：显示通用错误信息

**文件位置：** `src/services/simplify-service.ts`

## Prompt Design

### 中文 Prompt

```
你是一个专业的文本简化助手。请分析以下文本并完成两个任务：

1. 识别文本所属领域（技术文档/学术论文/代码/数学公式/通用文本）
2. 将文本简化为更易理解的表达，同时保留关键信息

要求：
- 保留所有专业术语、API名称、公式、代码语法
- 将长句拆分为短句
- 用简单词汇替换复杂词汇（但不改变专业术语）
- 保持原意不变

请按以下格式返回（严格遵守格式）：
领域：[领域名称]
置信度：[0-1之间的数字]
简化：[简化后的文本]
关键术语：[术语1, 术语2, ...]

原文：
{text}
```

### 英文 Prompt

```
You are a professional text simplification assistant. Please analyze the following text and complete two tasks:

1. Identify the domain (technical documentation/academic paper/code/mathematical formula/general text)
2. Simplify the text into easier-to-understand expressions while preserving key information

Requirements:
- Preserve all technical terms, API names, formulas, code syntax
- Break long sentences into shorter ones
- Replace complex words with simpler ones (but don't change technical terms)
- Maintain the original meaning

Please return in the following format (strictly follow the format):
Domain: [domain name]
Confidence: [number between 0-1]
Simplified: [simplified text]
Key Terms: [term1, term2, ...]

Original text:
{text}
```

## Error Handling

### Error Types

```typescript
enum SimplifyErrorType {
  NO_API_KEY = 'no_api_key',
  INVALID_API_KEY = 'invalid_api_key',
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  UNKNOWN_ERROR = 'unknown_error'
}
```

### Error Handling Strategy

| 错误类型 | 用户提示 | 建议操作 |
|---------|---------|---------|
| NO_API_KEY | "请先配置 API 密钥" | 引导用户到 Options 页面 |
| INVALID_API_KEY | "API 密钥无效，请检查设置" | 引导用户到 Options 页面 |
| NETWORK_ERROR | "网络连接失败，请检查网络" | 建议重试 |
| TIMEOUT | "请求超时，请重试" | 建议重试 |
| RATE_LIMIT | "API 调用次数已达上限" | 建议稍后重试 |
| UNKNOWN_ERROR | "处理失败，请重试" | 建议重试或联系支持 |

## Performance Targets

- 云端 AI 响应时间：≤ 10 秒
- 文本预处理时间：< 10ms
- 内存占用增加：< 3MB

## Security

### API Key Encryption

- 算法：AES-256-GCM
- 密钥派生：基于设备指纹（navigator.userAgent + navigator.hardwareConcurrency + screen.width + screen.height）
- 存储：Chrome Storage (sync)
- 使用：仅在需要时解密，不在日志中记录

### CSP Compliance

- 不使用 `eval()` 或 `new Function()`
- 所有网络请求使用 `fetch` API
- 遵守 Manifest V3 规范

## Testing Strategy

### Unit Tests

- TextPreprocessor：语言检测、文本清理
- SimplifyService：错误处理

### Integration Tests

- 云端 AI 集成测试（需要 API 密钥）
- UI 集成测试（用户交互流程）

### End-to-End Tests

- 在真实网站上测试（GitHub、Stack Overflow、MDN 等）
- 测试不同类型的文本（技术文档、学术论文、代码等）
- 测试错误场景（无 API 密钥、网络错误、超时等）

## Risks / Trade-offs

### Risk 1: 用户必须配置 API 密钥

**Risk:** 部分用户可能不愿意或不知道如何配置 API 密钥

**Mitigation:** 提供清晰的配置指南，支持多个 AI 提供商选择

**Trade-off:** 增加用户使用门槛，但确保高质量结果

### Risk 2: Prompt 工程的不确定性

**Risk:** AI 输出格式可能不稳定

**Mitigation:** 使用结构化 Prompt，添加解析容错逻辑，持续优化

**Trade-off:** 需要额外的解析逻辑，但提高准确率

### Risk 3: 云端 API 成本

**Risk:** 用户可能担心 API 调用成本

**Mitigation:** 提供 Token 统计和预算控制（未来），让用户了解使用情况

**Trade-off:** 需要额外的 Token 统计功能，但提高用户信任

### Risk 4: 网络依赖

**Risk:** 网络不稳定时功能不可用

**Mitigation:** 提供清晰的错误提示，建议用户检查网络连接

**Trade-off:** 功能可用性依赖网络，但确保高质量结果

## Migration Plan

不需要迁移。新功能可以直接使用。

## Open Questions

1. **是否需要支持批量简化？**
   - 当前决定：不支持，留待未来
   - 原因：增加复杂度，MVP 阶段不需要

2. **是否需要缓存简化结果？**
   - 当前决定：不实现，留待未来
   - 原因：缓存命中率可能不高，收益不确定

3. **是否需要支持自定义 Prompt？**
   - 当前决定：不支持，留待未来
   - 原因：增加复杂度，大多数用户不需要

4. **是否需要支持更多 AI 提供商？**
   - 当前决定：支持 GPT-4、Claude、文心一言
   - 未来可以根据用户需求添加更多

## Implementation Phases

### Phase 1: 核心功能（1-2 天）

- 文本预处理器
- 云端 AI 引擎
- 简化服务
- UI 集成
- 端到端测试

### Phase 2: 安全和配置（1 天）

- API 密钥管理
- 加密服务
- Options 页面配置
- API 密钥验证

### Phase 3: 优化和发布（0.5 天）

- Prompt 优化
- 错误处理完善
- 文档更新
- 最终测试

## References

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
