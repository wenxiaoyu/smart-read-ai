# Change: 添加 AI 驱动的文本简化功能

## Why

用户在阅读技术文档、学术论文等复杂内容时，经常遇到长难句和专业术语，理解困难。现有的 MVP 计划中虽然包含了简化功能的任务，但缺乏详细的技术设计和实现方案。我们需要一个完整的、AI 驱动的文本简化功能，能够智能识别文本领域并提供准确的简化结果。

## What Changes

- **添加文本预处理服务**：清理和标准化用户选中的文本，检测语言类型
- **添加云端 AI 引擎**：支持 OpenAI GPT-4、Anthropic Claude、百度文心一言等云端 AI
- **添加统一的简化服务**：调用云端 AI 进行文本简化，处理错误和超时
- **添加 API 密钥管理**：安全存储和管理云端 AI 的 API 密钥（AES-256-GCM 加密）
- **集成到现有 UI**：在 SelectionToolbar 和 ResultCard 中集成简化功能
- **添加 Options 页面配置**：允许用户配置云端 AI 提供商和 API 密钥

## Impact

### 受影响的能力（Capabilities）

由于当前项目没有使用 OpenSpec 的 specs 结构，此 change 将创建以下新能力：

- **text-simplification**：文本简化核心能力
- **api-key-security**：API 密钥安全管理能力

### 受影响的代码

**新增文件：**
- `src/services/types.ts` - 数据模型和接口定义
- `src/services/text-preprocessor.ts` - 文本预处理器
- `src/services/ai/cloud-ai-engine.ts` - 云端 AI 引擎
- `src/services/simplify-service.ts` - 统一简化服务
- `src/services/crypto-service.ts` - 加密服务
- `src/services/api-key-manager.ts` - API 密钥管理器

**修改文件：**
- `src/content/components/SelectionToolbar.tsx` - 添加简化按钮事件处理
- `src/content/components/ResultCard.tsx` - 添加简化结果展示
- `src/options/Options.tsx` - 添加 API 密钥配置界面

### 技术栈变化

- 无新增依赖（使用浏览器原生 API 和现有依赖）
- 使用 Web Crypto API 进行加密

### 风险和缓解

**风险 1：用户必须配置 API 密钥**
- 缓解：提供清晰的配置指南，支持多个 AI 提供商选择

**风险 2：Prompt 工程的不确定性**
- 缓解：使用结构化 Prompt，添加解析容错逻辑，持续优化

**风险 3：云端 API 成本**
- 缓解：提供 Token 统计和预算控制（未来），让用户了解使用情况

**风险 4：API 密钥安全**
- 缓解：使用 AES-256-GCM 加密，密钥派生自设备指纹

**风险 5：网络依赖**
- 缓解：提供清晰的错误提示，建议用户检查网络连接和 API 密钥

### 性能影响

- 云端 AI：响应时间 ≤ 10 秒
- 文本预处理：< 10ms
- 内存占用：预计增加 < 3MB

### 用户体验影响

- **正面**：用户可以快速理解复杂文本，提升阅读效率
- **正面**：支持多个 AI 提供商，用户可以选择
- **中性**：需要用户提供 API 密钥才能使用
- **负面**：网络错误或 API 密钥无效时功能不可用

## Breaking Changes

无破坏性变更。此功能是全新添加，不影响现有功能。

## Migration Plan

不需要迁移。新功能可以直接使用。

## Success Metrics

- 90% 的用户能够成功配置 API 密钥
- 云端 AI 调用成功率 > 95%
- 平均响应时间 < 5 秒
- 错误率 < 5%
- 用户满意度 > 4.0/5.0（未来收集）

## Future Enhancements

- 缓存机制（相同文本的简化结果）
- Token 统计和预算控制
- 批量简化
- 自定义 Prompt 模板
- 用户反馈和模型微调
- 支持更多 AI 提供商
