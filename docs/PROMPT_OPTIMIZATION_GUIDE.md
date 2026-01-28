# Prompt 优化指南

## 当前问题分析

### 现有 Prompt 的问题

1. **指令不够明确**：
   - "简化为更易理解的表达" 太模糊
   - 没有明确的简化标准和示例
   - 缺少对不同场景的具体指导

2. **输出格式不稳定**：
   - 依赖正则表达式解析结构化文本
   - AI 可能不严格遵守格式
   - 解析失败率较高

3. **缺少上下文**：
   - 没有告诉 AI 用户的阅读水平
   - 没有说明简化的目标受众
   - 缺少领域特定的简化策略

4. **质量控制不足**：
   - 没有要求 AI 自我检查
   - 缺少简化质量的评估标准
   - 没有处理边界情况的指导

## 优化策略

### 策略 1：使用 Few-Shot Learning

提供高质量的示例，让 AI 学习期望的输出风格：

```
示例 1：
原文：The implementation leverages a sophisticated caching mechanism to optimize performance.
简化：这个实现使用了缓存技术来提升速度。

示例 2：
原文：ValidationError extends Error
简化：ValidationError 是一种错误类型，它继承自 Error 类。
```

### 策略 2：分层简化

根据文本复杂度提供不同级别的简化：

- **Level 1（轻度简化）**：保留大部分专业术语，只简化句式
- **Level 2（中度简化）**：替换部分术语，拆分长句
- **Level 3（深度简化）**：用通俗语言重写，添加解释

### 策略 3：领域特定 Prompt

针对不同领域使用专门的 prompt：

- **代码/技术文档**：保留 API 名称、语法，解释概念
- **学术论文**：保留专业术语，简化论证逻辑
- **数学公式**：保留公式，用文字解释含义
- **通用文本**：全面简化，降低阅读难度

### 策略 4：Chain-of-Thought

让 AI 展示思考过程：

```
1. 识别关键概念：[列出]
2. 识别复杂表达：[列出]
3. 简化策略：[说明]
4. 简化结果：[输出]
```

### 策略 5：使用 JSON 输出

强制 AI 返回结构化 JSON，避免解析错误：

```json
{
  "domain": "technical",
  "confidence": 0.9,
  "simplified": "简化后的文本",
  "keyTerms": ["术语1", "术语2"],
  "simplificationLevel": "medium",
  "reasoning": "简化思路"
}
```

## 优化后的 Prompt 设计

### 核心原则

1. **明确性**：清晰的指令，具体的要求
2. **示例驱动**：提供高质量示例
3. **结构化输出**：使用 JSON 格式
4. **质量控制**：要求自我检查
5. **上下文感知**：考虑用户背景

### Prompt 模板

```typescript
const optimizedPrompt = `你是一个专业的文本简化助手。你的任务是将复杂文本简化为易于理解的表达，同时保留关键信息。

## 目标受众
- 阅读水平：中等（高中到大学）
- 目标：快速理解核心内容
- 场景：网页阅读、学习研究

## 简化原则
1. 保留所有专业术语、API 名称、代码语法、公式
2. 将长句拆分为短句（每句不超过 20 个词）
3. 用常见词汇替换生僻词汇（但不改变专业术语）
4. 添加必要的解释（用括号或破折号）
5. 保持原意完整，不遗漏关键信息

## 示例

### 示例 1：技术文档
原文：The implementation leverages a sophisticated caching mechanism to optimize performance by reducing redundant computations.
简化：这个实现使用了缓存技术来提升性能。它通过减少重复计算来加快速度。

### 示例 2：代码说明
原文：ValidationError extends Error
简化：ValidationError 是一种错误类型。它继承自 Error 类，用于表示验证失败的情况。

### 示例 3：学术文本
原文：The methodology employed in this study utilizes a mixed-methods approach to triangulate findings.
简化：这项研究使用了混合方法。它结合定性和定量数据来验证结果。

## 你的任务
分析以下文本并完成简化。请严格按照 JSON 格式返回结果。

原文：
${text}

## 输出格式（必须是有效的 JSON）
{
  "domain": "领域类型（technical/academic/code/math/general）",
  "confidence": 0.0-1.0之间的数字,
  "simplified": "简化后的文本",
  "keyTerms": ["保留的关键术语"],
  "simplificationLevel": "简化程度（light/medium/deep）",
  "reasoning": "简化思路（可选）"
}

请确保：
1. 返回的是有效的 JSON 格式
2. simplified 字段包含完整的简化文本
3. 保留所有专业术语在 keyTerms 中
4. confidence 反映你对简化质量的信心
`
```

## 实施计划

### Phase 1：基础优化（立即实施）

1. **更新 buildPrompt 方法**：
   - 添加明确的简化原则
   - 提供 3-5 个高质量示例
   - 改进输出格式说明

2. **改进解析逻辑**：
   - 优先尝试 JSON 解析
   - 保留正则表达式作为备用
   - 添加更多错误处理

### Phase 2：高级优化（后续迭代）

1. **实现分层简化**：
   - 添加简化级别选项（轻度/中度/深度）
   - 根据文本复杂度自动选择级别

2. **领域特定优化**：
   - 为不同领域创建专门的 prompt
   - 根据领域自动选择最佳 prompt

3. **质量评估**：
   - 添加简化质量评分
   - 收集用户反馈
   - 持续优化 prompt

### Phase 3：智能优化（长期目标）

1. **上下文学习**：
   - 记录用户偏好
   - 根据历史调整 prompt

2. **A/B 测试**：
   - 测试不同 prompt 变体
   - 选择最佳版本

3. **多轮对话**：
   - 支持用户要求重新简化
   - 根据反馈调整输出

## 测试用例

### 测试 1：技术文档
```
原文：The implementation leverages a sophisticated caching mechanism to optimize performance by reducing redundant computations and minimizing I/O operations.

期望输出：
- 简化：这个实现使用了缓存技术来提升性能。它通过两种方式加快速度：减少重复计算和降低 I/O 操作。
- 关键术语：caching, I/O operations
- 领域：technical
```

### 测试 2：代码片段
```
原文：class ValidationError extends Error { constructor(message) { super(message); this.name = "ValidationError"; } }

期望输出：
- 简化：这是一个 ValidationError 类，它继承自 Error。当创建实例时，它会设置错误消息和名称。
- 关键术语：ValidationError, Error, constructor
- 领域：code
```

### 测试 3：学术文本
```
原文：The methodology employed in this study utilizes a mixed-methods approach to triangulate findings and enhance the validity of conclusions.

期望输出：
- 简化：这项研究使用了混合方法。它结合多种数据来源来验证结果，从而提高结论的可靠性。
- 关键术语：mixed-methods, triangulate, validity
- 领域：academic
```

## 评估指标

### 质量指标

1. **准确性**：简化后是否保留了原意
2. **可读性**：是否更容易理解
3. **完整性**：是否遗漏关键信息
4. **术语保留**：专业术语是否正确保留

### 技术指标

1. **解析成功率**：JSON 解析成功的比例
2. **响应时间**：API 调用的平均时间
3. **Token 使用**：平均 token 消耗
4. **错误率**：API 调用失败的比例

## 最佳实践

### DO ✅

1. 提供具体、可操作的指令
2. 使用高质量的示例
3. 要求结构化输出（JSON）
4. 明确说明保留和简化的内容
5. 添加质量检查步骤

### DON'T ❌

1. 使用模糊的指令（如"简化"）
2. 依赖 AI 自行判断标准
3. 使用复杂的输出格式
4. 忽略边界情况
5. 缺少错误处理

## 参考资源

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Prompt Design](https://docs.anthropic.com/claude/docs/prompt-design)
- [Few-Shot Learning](https://arxiv.org/abs/2005.14165)
- [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)

## 总结

优化 prompt 是一个持续迭代的过程。关键是：

1. **明确目标**：清楚地告诉 AI 要做什么
2. **提供示例**：展示期望的输出
3. **结构化输出**：使用 JSON 避免解析错误
4. **持续测试**：收集反馈，不断改进

通过系统化的优化，我们可以显著提升简化质量和用户体验。
