# AI 服务商支持指南

## 概览

智阅 AI 支持国内外主流大模型服务商，以及本地部署的私有模型。用户可以根据自己的需求和偏好选择合适的 AI 服务。

## 支持的服务商

### 国内服务商

#### 1. 文心一言（百度 AI）
- **服务商代码**: `wenxin`
- **图标**: 🔵
- **支持模型**:
  - ERNIE-Bot-turbo（快速版）
  - ERNIE-Bot（标准版）
  - ERNIE-Bot-4（旗舰版）
- **获取 API Key**: [百度智能云](https://cloud.baidu.com/)
- **特点**: 中文理解能力强，响应速度快

#### 2. 通义千问（阿里云 AI）
- **服务商代码**: `qwen`
- **图标**: 🟣
- **支持模型**:
  - qwen-turbo（快速版）
  - qwen-plus（增强版）
  - qwen-max（旗舰版）
  - qwen-max-longcontext（长文本版）
- **获取 API Key**: [阿里云百炼](https://bailian.console.aliyun.com/)
- **特点**: 长文本处理能力强，支持多模态

#### 3. 智谱 GLM-4（智谱 AI）
- **服务商代码**: `glm4`
- **图标**: 🟢
- **支持模型**:
  - glm-4（标准版）
  - glm-4-air（轻量版）
  - glm-4-flash（快速版）
  - glm-4-plus（增强版）
- **获取 API Key**: [智谱 AI 开放平台](https://open.bigmodel.cn/)
- **特点**: 推理能力强，支持多轮对话

#### 4. DeepSeek（深度求索）
- **服务商代码**: `deepseek`
- **图标**: 🔷
- **支持模型**:
  - deepseek-chat（对话模型）
  - deepseek-reasoner（推理模型）
- **获取 API Key**: [DeepSeek 开放平台](https://platform.deepseek.com/)
- **特点**: 推理能力强，性价比高

#### 5. Moonshot（月之暗面）
- **服务商代码**: `moonshot`
- **图标**: 🌙
- **支持模型**:
  - moonshot-v1-8k（8K 上下文）
  - moonshot-v1-32k（32K 上下文）
  - moonshot-v1-128k（128K 上下文）
- **获取 API Key**: [Moonshot AI](https://platform.moonshot.cn/)
- **特点**: 超长上下文，适合处理长文档

#### 6. MiniMax（稀宇科技）
- **服务商代码**: `minimax`
- **图标**: 🟠
- **支持模型**:
  - abab6.5-chat（标准版）
  - abab6.5s-chat（快速版）
  - abab5.5-chat（经济版）
- **获取 API Key**: [MiniMax 开放平台](https://api.minimax.chat/)
- **特点**: 多模态能力强，支持语音和图像

### 国际服务商

#### 7. OpenAI
- **服务商代码**: `openai`
- **图标**: ⚫
- **支持模型**:
  - gpt-4o（最新旗舰版）
  - gpt-4o-mini（轻量版）
  - gpt-4-turbo（增强版）
  - gpt-3.5-turbo（经济版）
- **获取 API Key**: [OpenAI Platform](https://platform.openai.com/)
- **特点**: 业界标杆，能力全面
- **注意**: 需要国际网络访问

#### 8. Claude（Anthropic）
- **服务商代码**: `claude`
- **图标**: 🟤
- **支持模型**:
  - claude-3-5-sonnet-20241022（最新版）
  - claude-3-5-haiku-20241022（快速版）
  - claude-3-opus-20240229（旗舰版）
- **获取 API Key**: [Anthropic Console](https://console.anthropic.com/)
- **特点**: 安全性高，长文本处理能力强
- **注意**: 需要国际网络访问

#### 9. Gemini（Google AI）
- **服务商代码**: `gemini`
- **图标**: 🔴
- **支持模型**:
  - gemini-2.0-flash-exp（实验版）
  - gemini-1.5-pro（专业版）
  - gemini-1.5-flash（快速版）
- **获取 API Key**: [Google AI Studio](https://aistudio.google.com/)
- **特点**: 多模态能力强，与 Google 生态集成
- **注意**: 需要国际网络访问

### 本地部署

#### 10. 本地部署（私有模型）
- **服务商代码**: `local`
- **图标**: 🖥️
- **支持模型**: 自定义模型
- **配置要求**:
  - API 端点地址（如：`http://localhost:8000/v1`）
  - API 密钥（可选，取决于本地服务配置）
- **兼容格式**: OpenAI API 兼容格式
- **适用场景**:
  - 使用 Ollama 本地部署
  - 使用 LM Studio 本地部署
  - 使用 vLLM 本地部署
  - 使用 FastChat 本地部署
  - 企业内网私有部署

## 配置步骤

### 1. 选择服务商

1. 打开 Options 设置页
2. 在"AI 配置"标签页中选择服务商
3. 点击对应的服务商卡片

### 2. 配置 API 密钥

1. 在"API 密钥"区域输入您的 API Key
2. 点击眼睛图标可以显示/隐藏密钥
3. API 密钥将安全存储在本地

### 3. 选择模型

1. 在"模型选择"下拉框中选择模型
2. 模型列表会根据选择的服务商自动更新

### 4. 本地部署额外配置

如果选择"本地部署"，还需要：

1. 输入 API 端点地址
   - 格式：`http://localhost:端口号/v1`
   - 示例：`http://localhost:8000/v1`
2. 确保本地服务已启动
3. 确保 API 格式兼容 OpenAI

### 5. 保存设置

点击底部的"保存设置"按钮保存配置。

## 本地部署指南

### 使用 Ollama

```bash
# 1. 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. 下载模型
ollama pull qwen2.5:7b

# 3. 启动服务（默认端口 11434）
ollama serve

# 4. 在扩展中配置
# API 端点: http://localhost:11434/v1
# 模型名称: qwen2.5:7b
```

### 使用 LM Studio

```bash
# 1. 下载并安装 LM Studio
# https://lmstudio.ai/

# 2. 在 LM Studio 中下载模型

# 3. 启动本地服务器（默认端口 1234）
# 在 LM Studio 中点击"Local Server"标签
# 点击"Start Server"

# 4. 在扩展中配置
# API 端点: http://localhost:1234/v1
# 模型名称: 在 LM Studio 中查看
```

### 使用 vLLM

```bash
# 1. 安装 vLLM
pip install vllm

# 2. 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --port 8000

# 3. 在扩展中配置
# API 端点: http://localhost:8000/v1
# 模型名称: Qwen/Qwen2.5-7B-Instruct
```

## 模型选择建议

### 按场景选择

#### 技术文档阅读
- **推荐**: DeepSeek、Claude、GPT-4
- **理由**: 推理能力强，技术理解准确

#### 学术论文阅读
- **推荐**: Claude、Moonshot、Qwen-max-longcontext
- **理由**: 长文本处理能力强

#### 快速查询
- **推荐**: GLM-4-flash、GPT-4o-mini、DeepSeek-chat
- **理由**: 响应速度快，成本低

#### 多语言翻译
- **推荐**: GPT-4、Claude、Qwen
- **理由**: 多语言能力强

### 按成本选择

#### 高性价比
- DeepSeek（推理能力强，价格低）
- GLM-4-air（轻量快速）
- GPT-3.5-turbo（经济实惠）

#### 平衡型
- Qwen-plus（能力与价格平衡）
- Moonshot-v1-8k（适中的上下文）
- Claude-3-5-haiku（快速且经济）

#### 旗舰型
- GPT-4o（最强能力）
- Claude-3-opus（安全性高）
- Qwen-max（长文本处理）

### 按网络环境选择

#### 国内网络
- 文心一言
- 通义千问
- 智谱 GLM-4
- DeepSeek
- Moonshot
- MiniMax

#### 国际网络
- OpenAI
- Claude
- Gemini

#### 内网环境
- 本地部署（Ollama、LM Studio 等）

## 常见问题

### Q: 如何获取 API Key？

A: 访问对应服务商的官网，注册账号后在控制台创建 API Key。

### Q: API Key 是否安全？

A: API Key 存储在本地浏览器的 Chrome Storage 中，不会上传到任何服务器。

### Q: 本地部署需要什么配置？

A: 取决于模型大小：
- 7B 模型：至少 8GB 内存
- 13B 模型：至少 16GB 内存
- 70B 模型：至少 64GB 内存或使用量化版本

### Q: 如何切换服务商？

A: 在 Options 页面选择新的服务商，输入对应的 API Key，保存设置即可。

### Q: 支持同时使用多个服务商吗？

A: 当前版本一次只能使用一个服务商，未来版本会支持多服务商切换。

### Q: 本地部署的模型质量如何？

A: 7B-13B 的开源模型（如 Qwen2.5、Llama3）已经能够满足大部分阅读辅助需求。

## 技术细节

### API 格式兼容性

所有服务商都需要提供以下接口：

```typescript
interface ChatCompletionRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  max_tokens?: number
  temperature?: number
  stream?: boolean
}
```

### 本地部署要求

本地部署的服务必须：
1. 支持 OpenAI API 格式
2. 提供 `/v1/chat/completions` 端点
3. 返回标准的 JSON 响应

### 数据存储

```typescript
interface Settings {
  aiProvider: string      // 服务商代码
  apiKey: string         // API 密钥
  model: string          // 模型名称
  apiEndpoint?: string   // API 端点（本地部署）
  // ... 其他设置
}
```

## 更新日志

### v0.1.1 (2026-01-28)
- ✅ 新增 DeepSeek 支持
- ✅ 新增 Moonshot 支持
- ✅ 新增 MiniMax 支持
- ✅ 新增 OpenAI 支持
- ✅ 新增 Claude 支持
- ✅ 新增 Gemini 支持
- ✅ 新增本地部署支持
- ✅ 更新模型列表
- ✅ 优化服务商卡片布局

## 反馈与建议

如需添加新的服务商支持，请提交 Issue 或 Pull Request。
