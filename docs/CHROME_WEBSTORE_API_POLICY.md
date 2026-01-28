# Chrome Web Store 审核政策：外部 API 调用指南

## 概述

Chrome Web Store 对调用外部 API（包括大模型 API）的扩展有明确的政策要求。本文档总结了关键政策和最佳实践，帮助确保"智阅 AI"扩展顺利通过审核。

## 核心政策：Manifest V3 要求

### ✅ 允许的行为

根据 [Chrome Web Store Manifest V3 政策](https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements)，以下行为是**明确允许**的：

1. **与远程服务器通信用于特定目的**：
   - ✅ 同步用户账户数据到远程服务器
   - ✅ 获取远程配置文件（A/B 测试、功能开关）
   - ✅ 获取不用于执行逻辑的远程资源（如图片）
   - ✅ **执行服务器端数据操作（如使用私钥加密）**

2. **调用外部 API**：
   - ✅ **调用 AI 服务 API（OpenAI、Claude、Moonshot 等）**
   - ✅ 发送数据到 API 并接收响应
   - ✅ 使用 API 返回的数据（文本、JSON 等）

### ❌ 禁止的行为

以下行为是**严格禁止**的：

1. **从远程源执行代码逻辑**：
   - ❌ 包含指向扩展包外资源的 `<script>` 标签
   - ❌ 使用 `eval()` 执行从远程源获取的字符串
   - ❌ 构建解释器来运行从远程源获取的复杂命令

2. **远程托管代码**：
   - ❌ 扩展的核心逻辑必须包含在扩展包内
   - ❌ 不能动态加载和执行远程托管的 JavaScript 文件

## 智阅 AI 的合规性分析

### ✅ 我们的实现是合规的

"智阅 AI" 扩展的设计完全符合 Chrome Web Store 政策：

#### 1. 所有逻辑都在扩展包内

```typescript
// ✅ 正确：所有业务逻辑都在本地代码中
class SimplifyService {
  async simplify(text: string): Promise<SimplifyResult> {
    // 本地逻辑：构建提示词
    const prompt = this.buildPrompt(text)

    // 调用外部 API（仅数据传输）
    const response = await this.aiEngine.simplify(prompt)

    // 本地逻辑：解析响应
    return this.parseResponse(response)
  }
}
```

#### 2. API 调用仅用于数据处理

```typescript
// ✅ 正确：API 只处理数据，不执行代码
async simplify(request: SimplifyRequest): Promise<SimplifyResult> {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    })
  })

  // 返回的是数据（JSON），不是可执行代码
  const data = await response.json()
  return data.choices[0].message.content
}
```

#### 3. 不使用 eval() 或动态代码执行

```typescript
// ✅ 正确：解析 JSON 数据，不执行代码
const result = JSON.parse(responseText)

// ❌ 错误：执行远程代码（我们没有这样做）
// eval(responseText)
```

#### 4. API 密钥安全存储

```typescript
// ✅ 正确：使用 Chrome Storage API 加密存储
await chrome.storage.local.set({
  encryptedKey: await this.encrypt(apiKey),
})
```

### 政策对比表

| 行为               | 智阅 AI 实现 | 政策要求 | 合规性  |
| ------------------ | ------------ | -------- | ------- |
| 调用外部 AI API    | ✅ 是        | ✅ 允许  | ✅ 合规 |
| 发送文本数据到 API | ✅ 是        | ✅ 允许  | ✅ 合规 |
| 接收 JSON 响应     | ✅ 是        | ✅ 允许  | ✅ 合规 |
| 本地解析响应数据   | ✅ 是        | ✅ 要求  | ✅ 合规 |
| 所有逻辑在扩展包内 | ✅ 是        | ✅ 要求  | ✅ 合规 |
| 使用 eval()        | ❌ 否        | ❌ 禁止  | ✅ 合规 |
| 远程托管代码       | ❌ 否        | ❌ 禁止  | ✅ 合规 |
| 动态加载脚本       | ❌ 否        | ❌ 禁止  | ✅ 合规 |

## 审核关注点

### 1. 隐私政策要求

**必须提供隐私政策**，说明：

- 收集哪些数据（用户选中的文本）
- 数据如何使用（发送到 AI API 进行处理）
- 数据是否存储（API 密钥加密存储在本地）
- 第三方服务（OpenAI、Claude、Moonshot）

**我们的隐私政策要点**：

```markdown
## 数据收集和使用

- **用户选中的文本**：仅在用户主动点击"简化"或"解释"按钮时发送到 AI 服务商
- **API 密钥**：使用 AES-256-GCM 加密存储在本地，不上传到任何服务器
- **不收集个人信息**：不收集用户姓名、邮箱、浏览历史等个人信息

## 第三方服务

本扩展使用以下第三方 AI 服务：

- OpenAI (https://openai.com/privacy)
- Anthropic Claude (https://www.anthropic.com/privacy)
- Moonshot AI (https://www.moonshot.cn/privacy)

用户需自行注册这些服务并配置 API 密钥。
```

### 2. 权限声明

**必须在 manifest.json 中声明所需权限**：

```json
{
  "permissions": [
    "storage", // 存储 API 密钥和设置
    "activeTab" // 访问当前标签页（用于文本选择）
  ],
  "host_permissions": [
    "https://api.openai.com/*",
    "https://api.anthropic.com/*",
    "https://api.moonshot.cn/*"
  ]
}
```

**权限说明**：

- `storage`：存储用户配置和加密的 API 密钥
- `activeTab`：读取用户选中的文本
- `host_permissions`：调用 AI 服务 API

### 3. 功能透明度

**必须清楚说明扩展功能**：

- 在商店描述中明确说明需要用户自己的 API 密钥
- 说明数据会发送到第三方 AI 服务
- 提供详细的使用说明

**我们的商店描述示例**：

```markdown
## 功能说明

智阅 AI 是一个浏览器扩展，帮助您简化和理解复杂文本。

**核心功能**：

- 文本简化：将复杂文本转换为易懂的表达
- 术语解释：对专业术语进行详细解释

**重要说明**：

- 需要您自己的 AI 服务 API 密钥（OpenAI、Claude 或 Moonshot）
- 选中的文本会发送到您选择的 AI 服务商进行处理
- API 密钥加密存储在本地，不会上传到任何服务器
```

### 4. 代码可读性

**必须提交可读的代码**：

- ✅ 使用 TypeScript 编译为 JavaScript
- ✅ 使用 Vite + Terser 压缩（保留函数名和变量名）
- ✅ 不使用混淆工具
- ✅ 包含 source maps（可选，但有助于审核）

**我们的构建配置**：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: false, // 生产环境禁用
    minify: 'terser', // 使用 Terser 压缩
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console（便于调试）
        drop_debugger: true,
      },
      mangle: {
        keep_fnames: true, // 保留函数名（便于审核）
      },
    },
  },
})
```

## 常见审核问题和解决方案

### 问题 1：审核员担心远程代码执行

**症状**：审核被拒，理由是"可能执行远程代码"

**解决方案**：

1. 在审核说明中明确指出：

   ```
   本扩展仅调用 AI API 进行文本处理，不执行任何远程代码。
   所有业务逻辑都包含在扩展包内。
   API 返回的是 JSON 数据，不是可执行代码。
   ```

2. 提供代码示例，展示 API 调用流程

3. 强调使用标准的 `fetch()` API，不使用 `eval()`

### 问题 2：隐私政策不完整

**症状**：审核被拒，理由是"缺少隐私政策"或"隐私政策不完整"

**解决方案**：

1. 创建独立的隐私政策页面（托管在 GitHub Pages 或自己的网站）
2. 在 manifest.json 中添加隐私政策链接：
   ```json
   {
     "homepage_url": "https://your-domain.com/privacy-policy"
   }
   ```
3. 在商店描述中也包含隐私政策链接

### 问题 3：权限过度

**症状**：审核被拒，理由是"请求的权限超过必要范围"

**解决方案**：

1. 只请求必需的权限
2. 在审核说明中解释每个权限的用途
3. 使用 `activeTab` 而非 `tabs`（更少权限）
4. 使用 `host_permissions` 而非 `<all_urls>`（更精确）

### 问题 4：功能不明确

**症状**：审核被拒，理由是"无法确定扩展的完整功能"

**解决方案**：

1. 提供详细的测试账号和步骤
2. 录制演示视频展示完整功能
3. 在审核说明中提供 API 密钥（测试用）
4. 说明如何配置和使用扩展

## 审核提交清单

在提交到 Chrome Web Store 前，确保：

### 代码和构建

- [ ] 所有业务逻辑都在扩展包内
- [ ] 不使用 `eval()` 或 `new Function()`
- [ ] 不动态加载远程脚本
- [ ] 使用 Terser 压缩，保留函数名
- [ ] 构建成功，无错误
- [ ] 在本地测试所有功能

### 权限和安全

- [ ] 只请求必需的权限
- [ ] 使用 `activeTab` 而非 `tabs`
- [ ] 使用精确的 `host_permissions`
- [ ] API 密钥加密存储
- [ ] 符合 CSP 要求

### 文档和说明

- [ ] 创建隐私政策页面
- [ ] 在 manifest.json 中添加隐私政策链接
- [ ] 商店描述清楚说明功能
- [ ] 说明需要用户自己的 API 密钥
- [ ] 说明数据会发送到第三方服务
- [ ] 提供详细的使用说明

### 审核材料

- [ ] 准备测试 API 密钥（**只需一个服务商即可**）
- [ ] 录制演示视频（可选但推荐）
- [ ] 编写详细的审核说明
- [ ] 准备回答审核员的问题

**关于测试 API 密钥**：

- ✅ **推荐**：只提供一个服务商的测试密钥（如 OpenAI 或 Moonshot）
- ✅ 在审核说明中说明其他服务商的实现方式相同
- ✅ 可以使用有额度限制的测试密钥（如 $5 额度）
- ❌ **不需要**：提供所有服务商的密钥

### 审核说明模板

```markdown
## 审核说明

### 扩展功能

智阅 AI 是一个文本简化和解释工具，帮助用户理解复杂内容。

### 技术实现

- 所有业务逻辑都在扩展包内（src/ 目录）
- 使用标准 fetch() API 调用第三方 AI 服务
- API 返回 JSON 数据，不执行任何远程代码
- 不使用 eval() 或动态代码执行

### 第三方服务

- OpenAI API (https://api.openai.com)
- Anthropic Claude API (https://api.anthropic.com)
- Moonshot AI API (https://api.moonshot.cn)

### 测试步骤

1. 安装扩展
2. 点击扩展图标，进入设置页面
3. 配置 API 密钥（测试密钥：sk-test-xxx）
4. 访问任意网页，选中文本
5. 点击工具栏的"简化"或"解释"按钮
6. 查看 AI 生成的结果

### 隐私政策

https://your-domain.com/privacy-policy

### 联系方式

如有问题，请联系：your-email@example.com
```

## 相关资源

### 官方文档

- [Chrome Web Store 开发者政策](https://developer.chrome.com/docs/webstore/program_policies)
- [Manifest V3 额外要求](https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements)
- [隐私政策要求](https://developer.chrome.com/docs/webstore/program_policies/privacy)
- [权限使用指南](https://developer.chrome.com/docs/webstore/program_policies/permissions)

### 最佳实践

- [扩展安全最佳实践](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security)
- [用户数据保护](https://developer.chrome.com/docs/webstore/user_data)
- [代码可读性要求](https://developer.chrome.com/docs/webstore/program-policies/code-readability)

## 总结

**调用外部 AI API 是完全允许的**，只要：

1. ✅ 所有业务逻辑都在扩展包内
2. ✅ API 调用仅用于数据处理，不执行远程代码
3. ✅ 提供完整的隐私政策
4. ✅ 权限声明合理且必要
5. ✅ 功能说明清晰透明
6. ✅ 代码可读，不过度混淆

"智阅 AI" 扩展的设计完全符合这些要求，应该能够顺利通过 Chrome Web Store 审核。

**关键点**：

- 我们不执行远程代码，只处理数据
- 用户使用自己的 API 密钥
- 所有逻辑都在本地代码中
- 透明说明数据流向

如果审核被拒，根据拒绝理由对照本文档进行调整，并在重新提交时提供详细的说明。
