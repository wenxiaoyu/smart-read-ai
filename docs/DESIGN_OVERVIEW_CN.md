# 智阅AI 概要设计（中国版）

## 设计调整说明

由于中国大陆无法使用 Chrome 内置的 Gemini Nano 模型，本设计方案采用**云端 AI + 本地规则引擎**的混合架构，确保产品在中国市场可用。

## 核心技术方案

### 1. AI 引擎架构

```
用户划词
    ↓
AI 引擎调度器
    ↓
    ├─ 优先：云端 AI（文心一言/通义千问/智谱GLM-4）
    └─ 降级：本地规则引擎（离线备选）
```

### 2. 云端 AI 选择（中国可用）

| 模型 | 优势 | 适用场景 | 成本 |
|------|------|----------|------|
| **文心一言 4.0** | 中文理解强，API稳定 | 技术文档、中文内容 | 0.012元/千tokens |
| **通义千问** | 技术文档解析好 | 代码解析、API文档 | 0.008元/千tokens |
| **智谱 GLM-4** | 学术内容理解强 | 学术论文、研究报告 | 0.01元/千tokens |

**MVP-1 推荐**：文心一言 4.0
- 新用户有免费额度
- 中文技术文档解析效果最好
- API 响应速度快（<3秒）

### 3. 本地规则引擎（离线备选）

当用户未配置 API 密钥或网络异常时，自动降级到规则引擎：

**功能**：
- 长难句拆分（基于中文分词）
- 术语解释（预置 1000+ 技术术语库）
- 基础文本处理

**实现**：
```typescript
class FallbackEngine {
  // 使用 jieba 中文分词
  private segmenter = new Jieba();
  
  // 预置术语库
  private termDatabase: Map<string, string>;
  
  simplify(text: string): string {
    // 1. 分词
    const words = this.segmenter.cut(text);
    
    // 2. 识别长句（>50字符）
    if (text.length > 50) {
      // 拆分为短句
      return this.splitLongSentence(words);
    }
    
    return text;
  }
  
  explain(term: string): string {
    // 查询本地术语库
    return this.termDatabase.get(term) || '未找到该术语的解释';
  }
}
```

## MVP 迭代计划

### MVP-1: 核心阅读辅助（2-3周）

**目标**：验证云端AI专业内容解析的核心价值

**核心功能**：
- ✅ 划词工具栏（简化、解释、复制）
- ✅ 文心一言 API 集成
- ✅ 本地规则引擎（离线备选）
- ✅ 注入式 UI（Shadow DOM）
- ✅ API 密钥安全存储（AES 加密）
- ✅ 基础设置页面

**技术重点**：
- Chrome Extension 基础架构
- 文心一言 API 调用
- 中文分词（jieba）
- 术语库构建

**成功指标**：
- API 调用成功率 > 95%
- 响应延迟 < 3秒
- 规则引擎离线可用

### MVP-2: 多模型与知识沉淀（2-3周）

**目标**：扩展AI能力，引入知识管理

**核心功能**：
- ✅ 多模型支持（通义千问、智谱GLM-4）
- ✅ 代码解析（Python/JS/Java/Go）
- ✅ 公式解析（LaTeX）
- ✅ 知识收藏（IndexedDB）
- ✅ Token 计数与预算管理

**技术重点**：
- 多模型适配器模式
- 代码语法高亮（highlight.js）
- IndexedDB 存储
- Token 统计算法

**成功指标**：
- 多模型切换正常
- 代码解析准确率 > 75%
- 知识节点保存成功

### MVP-3: 高级功能与商业化（2-3周）

**目标**：完善差异化功能，准备商业化

**核心功能**：
- ✅ 提示词优化（针对各模型）
- ✅ 多文档对比分析
- ✅ 知识图谱构建
- ✅ 自然语言检索
- ✅ 付费功能区分
- ✅ 7天试用机制

**技术重点**：
- 提示词工程
- TF-IDF + 余弦相似度
- 向量检索
- 订阅管理

**成功指标**：
- 知识图谱准确率 > 70%
- 多文档对比可用
- 试用转化率 > 5%

## 数据安全设计

### 1. API 密钥加密

```typescript
class EncryptionService {
  async encrypt(apiKey: string): Promise<string> {
    // 使用 AES-256-GCM 加密
    const key = await this.deriveKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(apiKey)
    );
    return this.encode(iv, encrypted);
  }
}
```

### 2. 数据存储策略

| 数据类型 | 存储位置 | 加密 | 说明 |
|---------|---------|------|------|
| API 密钥 | Chrome Storage | ✅ AES-256 | 本地加密，不上传 |
| 用户配置 | Chrome Storage | ❌ | 非敏感信息 |
| 知识节点 | IndexedDB | ✅ 内容加密 | 本地存储 |
| Token 统计 | IndexedDB | ❌ | 统计数据 |
| 缓存数据 | Chrome Storage | ❌ | 24小时过期 |

### 3. 隐私保护

- ✅ 所有数据本地存储，不上传云端
- ✅ API 调用使用 HTTPS 加密
- ✅ 用户可随时清除所有数据
- ✅ 不收集用户浏览历史
- ✅ 最小权限原则

## 性能优化

### 1. 响应速度优化

```typescript
class AIEngine {
  // 请求队列，避免并发过多
  private requestQueue: RequestQueue;
  
  // 缓存机制
  private cache: LRUCache<string, string>;
  
  async simplify(text: string): Promise<string> {
    // 1. 检查缓存
    const cached = this.cache.get(text);
    if (cached) return cached;
    
    // 2. 加入队列
    const result = await this.requestQueue.add(() => 
      this.cloudAI.simplify(text)
    );
    
    // 3. 缓存结果
    this.cache.set(text, result);
    
    return result;
  }
}
```

### 2. 性能指标

| 指标 | 目标 | 说明 |
|------|------|------|
| 划词工具栏弹出 | ≤ 0.5秒 | 用户体验关键 |
| 云端 AI 响应 | ≤ 3秒 | 文心一言平均响应 |
| 规则引擎响应 | ≤ 0.5秒 | 离线备选 |
| 内存占用 | ≤ 80MB | 避免影响浏览器 |
| CPU 占用 | ≤ 15% | 后台运行 |

## 成本控制

### 1. Token 计数

```typescript
interface TokenUsage {
  provider: 'wenxin' | 'qwen' | 'glm4';
  month: string; // YYYY-MM
  totalTokens: number;
  budget: number; // 用户设置的预算
  cost: number; // 实际花费（元）
}
```

### 2. 预算管理

- 用户设置每月预算（如 50 元）
- 实时统计 Token 消耗
- 达到 80% 时提醒
- 超出预算时禁用云端 AI，自动降级到规则引擎

### 3. 成本估算

假设用户每天使用 50 次，每次平均 500 tokens：

| 模型 | 日消耗 | 月消耗 | 月成本 |
|------|--------|--------|--------|
| 文心一言 | 25,000 tokens | 750,000 tokens | 9 元 |
| 通义千问 | 25,000 tokens | 750,000 tokens | 6 元 |
| 智谱 GLM-4 | 25,000 tokens | 750,000 tokens | 7.5 元 |

**免费版额度**：每月 1 万 tokens（约 20 次使用）
**付费版额度**：每月 10 万 tokens（约 200 次使用）

## 商业模式

### 免费版
- 云端 AI：1 万 tokens/月
- 本地规则引擎：无限制
- 基础知识收藏
- 单模型（文心一言）

### 付费版（29元/月）
- 云端 AI：10 万 tokens/月
- 多模型切换
- 多文档对比
- 知识图谱可视化
- 优先技术支持

### 试用机制
- 新用户免费试用 7 天高级版
- 试用期内所有功能开放
- 试用结束自动切换为免费版

## 风险与缓解

### 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| API 调用失败率高 | 高 | 实现重试机制 + 规则引擎降级 |
| API 密钥泄露 | 高 | AES 加密 + 本地存储 |
| 文心一言限流 | 中 | 请求队列 + 限流控制 |
| 规则引擎准确率低 | 中 | 持续优化术语库 |

### 产品风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 用户不愿提供 API 密钥 | 高 | 提供免费额度 + 安全说明 |
| 付费转化率低 | 中 | 强化付费功能价值 |
| 成本控制不当 | 中 | 严格 Token 预算管理 |

## 下一步行动

### 立即开始
1. ✅ 审批 MVP 计划
2. ✅ 注册文心一言 API 账号
3. ✅ 搭建开发环境
4. ✅ 启动 MVP-1 开发

### Week 1 任务
- [ ] Chrome Extension 基础架构
- [ ] Content Script 划词监听
- [ ] Shadow DOM UI 组件
- [ ] 文心一言 API 集成
- [ ] 本地规则引擎（基础版）

### Week 2 任务
- [ ] API 密钥加密存储
- [ ] 降级策略实现
- [ ] 缓存机制
- [ ] 基础设置页面
- [ ] 测试与优化

### Week 3 任务
- [ ] 完整功能测试
- [ ] 性能优化
- [ ] 用户文档
- [ ] 准备内测

## 总结

通过采用**云端 AI（文心一言等）+ 本地规则引擎**的混合架构，智阅AI 可以在中国市场顺利开发和使用。

**核心优势**：
- ✅ 完全适配中国网络环境
- ✅ 支持国产 AI 模型
- ✅ 离线备选方案保证可用性
- ✅ 数据安全和隐私保护
- ✅ 成本可控

**关键成功因素**：
1. 文心一言 API 调用稳定性
2. 规则引擎准确率
3. 用户对 API 密钥的接受度
4. 付费功能的差异化价值

让我们开始 MVP-1 的开发吧！🚀
