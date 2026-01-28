# Moonshot (Kimi) 集成指南

## 概述

智阅 AI 现已支持 Moonshot (Kimi) AI 模型用于文本简化功能。

## 实现日期

2026年1月28日

## 已完成的工作

### 1. 类型定义更新
- ✅ 在 `CloudProvider` 类型中添加 `'moonshot'`
- ✅ 支持的提供商：`'gpt4' | 'claude' | 'wenxin' | 'moonshot'`

### 2. CloudAIEngine 更新
- ✅ 实现 `callMoonshot()` 方法
- ✅ API 端点：`https://api.moonshot.cn/v1/chat/completions`
- ✅ 默认模型：`moonshot-v1-8k`
- ✅ 支持的模型：
  - `moonshot-v1-8k` - 8K 上下文
  - `moonshot-v1-32k` - 32K 上下文
  - `moonshot-v1-128k` - 128K 上下文
- ✅ 错误处理：
  - 401 → API 密钥无效
  - 429 → API 调用次数限制
  - 网络错误处理
  - 超时处理（10秒）

### 3. Options 页面更新
- ✅ 添加 Moonshot API 密钥配置项
- ✅ 支持设置为默认提供商
- ✅ 密钥掩码显示（只显示最后4位）
- ✅ 显示/隐藏密钥切换
- ✅ 添加 Moonshot 官网链接：https://platform.moonshot.cn/console/api-keys

### 4. API 密钥管理器更新
- ✅ 实现 `validateMoonshot()` 方法
- ✅ 支持 Moonshot API 密钥验证（预留功能）

### 5. SimplifyService 更新
- ✅ 在 `providerUsage` 统计中添加 `moonshot` 支持

## 使用指南

### 步骤 1：获取 Moonshot API 密钥

1. 访问 [Moonshot AI 开放平台](https://platform.moonshot.cn/console/api-keys)
2. 注册/登录账号
3. 创建新的 API 密钥
4. 复制 API 密钥（格式：`sk-...`）

### 步骤 2：配置 API 密钥

1. 打开扩展的 Options 页面
2. 切换到"简化功能"标签页
3. 找到"Moonshot (Kimi)"配置项
4. 粘贴你的 API 密钥
5. （可选）选择"默认"单选按钮，将 Moonshot 设为默认提供商
6. 点击"保存设置"

### 步骤 3：测试简化功能

1. 访问任意网页（如技术文档、新闻文章）
2. 选中一段文本
3. 点击工具栏中的"简化"按钮
4. 等待 AI 处理（应在10秒内完成）
5. 查看简化结果

## API 规格

### 请求格式

```typescript
{
  method: 'POST',
  url: 'https://api.moonshot.cn/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: {
    model: 'moonshot-v1-8k',
    messages: [
      {
        role: 'system',
        content: 'You are a professional text simplification assistant.'
      },
      {
        role: 'user',
        content: '用户的 Prompt'
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  }
}
```

### 响应格式

```typescript
{
  choices: [
    {
      message: {
        content: 'AI 生成的简化文本'
      }
    }
  ]
}
```

### 错误码

- `401` - API 密钥无效或未授权
- `429` - API 调用次数已达上限
- `500` - 服务器内部错误

## 性能特点

### Moonshot 优势

1. **长上下文支持**：最高支持 128K tokens
2. **中文优化**：对中文文本处理效果优秀
3. **响应速度**：通常在 2-5 秒内返回结果
4. **价格优势**：相比国际模型更具性价比

### 适用场景

- ✅ 中文技术文档简化
- ✅ 学术论文摘要
- ✅ 长文本处理（利用长上下文优势）
- ✅ 专业术语解释

## 故障排除

### 问题 1：提示"未配置 API 密钥"

**原因**：
- API 密钥未保存
- 保存失败
- 浏览器存储被清除

**解决方案**：
1. 重新打开 Options 页面
2. 检查 Moonshot API 密钥是否显示（应显示为 `••••xxxx`）
3. 如果为空，重新输入并保存
4. 刷新测试网页后重试

### 问题 2：提示"API 密钥无效"

**原因**：
- API 密钥输入错误
- API 密钥已过期或被撤销
- API 密钥权限不足

**解决方案**：
1. 访问 [Moonshot 控制台](https://platform.moonshot.cn/console/api-keys)
2. 验证 API 密钥是否有效
3. 检查 API 密钥权限设置
4. 如有必要，创建新的 API 密钥
5. 在 Options 页面更新密钥

### 问题 3：提示"API 调用次数已达上限"

**原因**：
- 免费额度用完
- 付费套餐配额用完
- 短时间内请求过多（速率限制）

**解决方案**：
1. 访问 [Moonshot 控制台](https://platform.moonshot.cn/console)
2. 查看使用情况和配额
3. 如需要，升级套餐或充值
4. 等待一段时间后重试（如果是速率限制）

### 问题 4：请求超时

**原因**：
- 网络连接不稳定
- Moonshot API 服务响应慢
- 文本过长导致处理时间超过10秒

**解决方案**：
1. 检查网络连接
2. 选择较短的文本进行简化
3. 稍后重试
4. 考虑切换到其他提供商（GPT-4、Claude）

## 与其他提供商的对比

| 特性 | Moonshot | GPT-4 | Claude |
|------|----------|-------|--------|
| 中文支持 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 英文支持 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 上下文长度 | 128K | 128K | 200K |
| 响应速度 | 快 | 中等 | 快 |
| 价格 | 低 | 高 | 中 |
| 可用性（中国） | ✅ | ⚠️ | ⚠️ |

## 最佳实践

### 1. 选择合适的模型

- **短文本（< 2K tokens）**：使用 `moonshot-v1-8k`（默认）
- **中等文本（2K-8K tokens）**：使用 `moonshot-v1-32k`
- **长文本（> 8K tokens）**：使用 `moonshot-v1-128k`

注：当前实现默认使用 `moonshot-v1-8k`，未来可以添加模型选择功能。

### 2. 优化 Prompt

Moonshot 对中文 Prompt 响应良好，建议：
- 使用清晰、具体的指令
- 提供足够的上下文
- 避免过于复杂的要求

### 3. 错误处理

- 实现了自动重试（最多2次）
- 超时设置为10秒
- 提供用户友好的错误提示

### 4. 成本控制

- 监控 API 使用情况
- 设置合理的 `max_tokens` 限制（当前为1000）
- 避免频繁调用

## 技术实现细节

### 代码位置

- **类型定义**：`src/services/types.ts`
- **AI 引擎**：`src/services/ai/cloud-ai-engine.ts`
- **API 密钥管理**：`src/services/api-key-manager.ts`
- **Options 页面**：`src/options/Options.tsx`
- **简化服务**：`src/services/simplify-service.ts`

### 关键代码片段

```typescript
// CloudAIEngine.callMoonshot()
private async callMoonshot(
  prompt: string,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch(
    'https://api.moonshot.cn/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'You are a professional text simplification assistant.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
      signal,
    }
  );
  
  // 错误处理...
  const data = await response.json();
  return data.choices[0].message.content;
}
```

## 测试清单

- [ ] 构建成功（`npm run build`）
- [ ] 在 Chrome 中加载扩展
- [ ] 打开 Options 页面
- [ ] 看到 Moonshot 配置项
- [ ] 输入 API 密钥
- [ ] 保存成功
- [ ] 密钥显示为掩码（`••••xxxx`）
- [ ] 在网页上选中文本
- [ ] 点击"简化"按钮
- [ ] 看到加载状态
- [ ] 收到简化结果
- [ ] 结果包含元数据（provider: 'moonshot'）
- [ ] 测试错误场景（无效密钥、网络错误）

## 后续优化建议

### 短期（1-2周）

1. **模型选择**：允许用户选择 8K/32K/128K 模型
2. **API 密钥验证**：实现"测试"按钮，验证密钥有效性
3. **使用统计**：显示 API 调用次数和成本

### 中期（1个月）

1. **智能模型选择**：根据文本长度自动选择合适的模型
2. **缓存机制**：对相同文本的简化结果进行缓存
3. **批量处理**：支持一次简化多段文本

### 长期（3个月）

1. **自定义 Prompt**：允许用户自定义简化 Prompt
2. **质量评分**：对简化结果进行质量评分
3. **A/B 测试**：对比不同提供商的简化效果

## 参考资料

- [Moonshot AI 官网](https://www.moonshot.cn/)
- [Moonshot AI 开放平台](https://platform.moonshot.cn/)
- [Moonshot API 文档](https://platform.moonshot.cn/docs)
- [API 密钥管理](https://platform.moonshot.cn/console/api-keys)

---

**实现者**：Kiro AI Assistant  
**审核者**：待审核  
**最后更新**：2026年1月28日
