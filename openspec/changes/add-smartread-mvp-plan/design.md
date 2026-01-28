# 智阅AI MVP 迭代设计

## Context

智阅AI 是一款专业阅读辅助 Chrome 插件，采用本地+云端混合AI架构。为了快速验证产品价值并降低开发风险，采用 MVP 迭代方式开发。本文档定义了 3 个迭代阶段的技术设计和架构决策。

## Goals / Non-Goals

### Goals
- 定义清晰的 MVP 迭代边界和优先级
- 确保每个迭代都能独立交付可用功能
- 建立可扩展的技术架构，支持后续迭代
- 降低技术风险，逐步攻克复杂功能

### Non-Goals
- 不在 MVP 阶段实现所有需求文档中的功能
- 不追求完美的UI/UX，优先验证核心价值
- 不在 MVP-1 阶段实现商业化功能

## Architecture Overview

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Content UI   │  │    Popup     │  │   Options    │      │
│  │ (划词工具栏)  │  │  (知识检索)   │  │   (设置)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Background     │
                    │  Service Worker │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐    ┌──────▼──────┐    ┌─────▼─────┐
    │  Local AI │    │  Cloud AI   │    │  Storage  │
    │  Engine   │    │   Engine    │    │  Manager  │
    └───────────┘    └─────────────┘    └───────────┘
         │                  │                  │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ Gemini  │      │ GPT-4 API │     │  Chrome   │
    │  Nano   │      │Claude API │     │  Storage  │
    │         │      │ 文心一言   │     │ IndexedDB │
    └─────────┘      └───────────┘     └───────────┘
```

### 模块职责

1. **Content Script (content/)**
   - 监听用户划词事件
   - 渲染划词工具栏（Shadow DOM 隔离）
   - 展示 AI 解析结果（注入式 UI）
   - 与 Background 通信

2. **Background Service Worker (background/)**
   - AI 引擎调度（本地/云端）
   - 消息路由与处理
   - 数据持久化管理
   - Token 计数与预算控制

3. **Popup (popup/)**
   - 知识检索入口
   - 快速设置面板
   - Token 使用统计

4. **Options (options/)**
   - 高级设置（模型配置、API 密钥）
   - 数据管理（导出、清理）
   - 帮助与反馈

## MVP-1: 核心阅读辅助

### 功能范围

#### 必须实现 (P0)
- ✅ 划词工具栏（简化、解释、复制）
- ✅ 本地 AI 长难句简化
- ✅ 本地 AI 术语解释
- ✅ 注入式结果展示（Shadow DOM）
- ✅ 基础设置页面（开关、主题）
- ✅ 本地 AI 降级策略

#### 可选实现 (P1)
- 右键菜单集成
- 术语解释缓存（24小时）

#### 不实现
- 云端 AI
- 知识收藏
- 代码/公式解析

### 技术决策

#### 1. Content Script 注入策略

**决策**: 使用 Shadow DOM 隔离样式，避免与网页冲突

**理由**:
- 专业网站（如技术文档、学术论文）样式复杂，直接注入易冲突
- Shadow DOM 提供完全的样式隔离
- 支持暗黑模式自适应

**实现**:
```typescript
// content/ui/toolbar.ts
class SelectionToolbar {
  private shadowRoot: ShadowRoot;
  
  constructor() {
    const container = document.createElement('div');
    this.shadowRoot = container.attachShadow({ mode: 'closed' });
    // 注入样式和内容
  }
}
```

#### 2. 本地 AI 集成方式

**决策**: 优先使用云端 AI，本地规则引擎作为备选

**理由**:
- 中国大陆无法访问 Gemini Nano（需要特殊网络环境）
- 云端 AI（文心一言、通义千问）在中国可直接访问
- 本地规则引擎作为离线备选，保证基础功能可用

**实现**:
```typescript
// background/ai/ai-engine.ts
class AIEngine {
  private cloudEngine: CloudAIEngine;
  private fallbackEngine: FallbackEngine;
  
  async initialize() {
    // 优先初始化云端引擎
    try {
      await this.cloudEngine.initialize();
    } catch (error) {
      console.warn('Cloud AI not available, using fallback');
    }
  }
  
  async simplify(text: string): Promise<string> {
    // 优先使用云端 AI
    if (this.cloudEngine.isAvailable()) {
      return await this.cloudEngine.simplify(text);
    }
    // 降级到规则引擎
    return this.fallbackEngine.simplify(text);
  }
}
```

**云端 AI 选择**（中国可用）:
- **文心一言 4.0**: 百度出品，中文理解强，API 稳定
- **通义千问**: 阿里出品，技术文档解析好
- **智谱 GLM-4**: 清华出品，学术内容理解强

**MVP-1 推荐**: 使用文心一言 4.0，理由：
1. 中文技术文档解析效果好
2. API 调用稳定，响应快（<3秒）
3. 价格合理（0.012元/千tokens）
4. 提供免费额度（新用户）

#### 3. 降级策略

**决策**: 本地规则引擎作为离线备选

**理由**:
- 用户可能没有配置 API 密钥
- 网络异常时需要基础功能可用
- 保证用户体验连续性

**实现**:
```typescript
// background/ai/fallback-engine.ts
class FallbackEngine {
  simplify(text: string): string {
    // 基于规则的简化：
    // 1. 拆分长句（>50字符）
    // 2. 识别并列关系（and, or, 以及, 或者）
    // 3. 提取主干结构
    // 4. 使用中文分词库（jieba）
    return processWithRules(text);
  }
  
  explain(term: string): string {
    // 基于本地术语库
    // 1. 加载预置的技术术语库（JSON）
    // 2. 匹配术语
    // 3. 返回预定义解释
    return this.termDatabase.get(term) || '未找到该术语的解释';
  }
}
```

**术语库来源**:
- 预置 1000+ 常用技术术语
- 支持用户自定义添加
- 定期更新（通过插件更新）

### 数据模型

#### 用户配置
```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  toolbarEnabled: boolean;
  toolbarDisplayDuration: number; // 1-5秒
  localAIEnabled: boolean;
}
```

#### 缓存数据
```typescript
interface CacheEntry {
  key: string; // 文本hash
  type: 'simplify' | 'explain';
  result: string;
  timestamp: number;
  expiresAt: number; // 24小时后
}
```

### 性能指标

- 划词工具栏弹出延迟: ≤ 0.5秒
- 云端 AI 响应延迟: ≤ 3秒（文心一言）
- 规则引擎响应延迟: ≤ 0.5秒
- 内存占用: ≤ 50MB
- CPU 占用: ≤ 10%

## MVP-2: 云端增强与知识沉淀

### 功能范围

#### 必须实现 (P0)
- ✅ 云端 AI 单模型支持（GPT-4）
- ✅ API 密钥管理（AES 加密）
- ✅ 代码片段解析（Python/JavaScript/Java）
- ✅ 公式解析（LaTeX）
- ✅ 知识节点收藏（本地存储）
- ✅ Token 计数与预算提醒

#### 可选实现 (P1)
- 代码语法高亮
- 公式可视化渲染
- 简单关键词检索

#### 不实现
- 多模型切换
- 知识图谱关联
- 自然语言检索

### 技术决策

#### 1. 云端 API 调用架构

**决策**: 统一 AI Engine 接口，支持多模型扩展

**理由**:
- MVP-3 需要支持多模型
- 提前设计统一接口，降低后续改造成本
- 便于测试和模拟

**实现**:
```typescript
// background/ai/cloud-engine.ts
interface CloudAIProvider {
  name: string;
  simplify(text: string): Promise<string>;
  explain(text: string): Promise<string>;
  analyzeCode(code: string, language: string): Promise<string>;
  analyzeFormula(formula: string): Promise<string>;
}

class GPT4Provider implements CloudAIProvider {
  name = 'gpt-4';
  
  async simplify(text: string): Promise<string> {
    return await this.callAPI({
      model: 'gpt-4',
      messages: [{ role: 'user', content: buildPrompt(text) }]
    });
  }
}
```

#### 2. 知识存储方案

**决策**: IndexedDB 存储知识节点，Chrome Storage 存储配置

**理由**:
- IndexedDB 支持大容量存储（>5MB）
- 支持索引和查询
- Chrome Storage 适合小数据（配置、密钥）

**实现**:
```typescript
// background/storage/knowledge-store.ts
interface KnowledgeNode {
  id: string;
  type: 'term' | 'code' | 'formula' | 'conclusion';
  content: string;
  sourceUrl: string;
  createdAt: number;
  tags: string[]; // AI自动生成
}

class KnowledgeStore {
  private db: IDBDatabase;
  
  async save(node: KnowledgeNode): Promise<void> {
    const tx = this.db.transaction('nodes', 'readwrite');
    await tx.objectStore('nodes').add(node);
  }
  
  async search(keyword: string): Promise<KnowledgeNode[]> {
    // 简单关键词匹配
    const tx = this.db.transaction('nodes', 'readonly');
    const store = tx.objectStore('nodes');
    const index = store.index('content');
    return await index.getAll(IDBKeyRange.only(keyword));
  }
}
```

#### 3. 安全加密

**决策**: AES-256-GCM 加密 API 密钥

**理由**:
- API 密钥是敏感信息，必须加密存储
- AES-256-GCM 是行业标准，安全性高
- Chrome 提供 Web Crypto API

**实现**:
```typescript
// background/security/encryption.ts
class EncryptionService {
  private async getKey(): Promise<CryptoKey> {
    // 使用用户设备指纹生成密钥
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(await this.getDeviceId()),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  async encrypt(data: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(data)
    );
    return btoa(JSON.stringify({ iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) }));
  }
}
```

### 数据模型

#### API 配置
```typescript
interface APIConfig {
  provider: 'gpt-4' | 'claude' | 'wenxin';
  apiKey: string; // 加密存储
  endpoint?: string; // 自定义端点
  enabled: boolean;
}
```

#### Token 统计
```typescript
interface TokenUsage {
  provider: string;
  month: string; // YYYY-MM
  totalTokens: number;
  budget: number;
  history: Array<{
    timestamp: number;
    tokens: number;
    action: string;
  }>;
}
```

### 性能指标

- 云端 AI 响应延迟: ≤ 10秒
- 知识节点保存: ≤ 0.5秒
- 关键词检索: ≤ 1秒
- 内存占用: ≤ 80MB

## MVP-3: 高级功能与商业化

### 功能范围

#### 必须实现 (P0)
- ✅ 多云端模型切换（Claude、文心一言）
- ✅ 多文档对比分析（2-5篇）
- ✅ 知识图谱自动构建
- ✅ 自然语言知识检索
- ✅ 付费功能区分
- ✅ 7天试用机制

#### 可选实现 (P1)
- 知识图谱可视化
- 跨会话上下文记忆
- 行业知识库定制

#### 不实现
- 私有模型接入
- 云端数据同步
- 移动端支持

### 技术决策

#### 1. 知识图谱构建算法

**决策**: 基于 TF-IDF + 余弦相似度的关联算法

**理由**:
- 轻量级，可在浏览器端运行
- 不依赖云端服务，保护隐私
- 准确度满足 MVP 需求

**实现**:
```typescript
// background/knowledge/graph-builder.ts
class KnowledgeGraphBuilder {
  async buildRelations(nodes: KnowledgeNode[]): Promise<Relation[]> {
    const relations: Relation[] = [];
    
    // 1. 计算每个节点的 TF-IDF 向量
    const vectors = nodes.map(node => this.computeTFIDF(node.content));
    
    // 2. 计算节点间的余弦相似度
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = this.cosineSimilarity(vectors[i], vectors[j]);
        if (similarity > 0.3) { // 阈值
          relations.push({
            from: nodes[i].id,
            to: nodes[j].id,
            type: this.inferRelationType(nodes[i], nodes[j]),
            weight: similarity
          });
        }
      }
    }
    
    return relations;
  }
}
```

#### 2. 自然语言检索

**决策**: 本地 AI 解析查询意图 + 向量检索

**理由**:
- 利用本地 AI 理解用户查询
- 向量检索比关键词匹配更准确
- 完全本地运行，响应快

**实现**:
```typescript
// background/knowledge/search-engine.ts
class NaturalLanguageSearch {
  async search(query: string): Promise<KnowledgeNode[]> {
    // 1. 使用本地 AI 提取关键词和意图
    const intent = await this.localAI.extractIntent(query);
    
    // 2. 计算查询向量
    const queryVector = this.computeTFIDF(intent.keywords.join(' '));
    
    // 3. 检索相似节点
    const nodes = await this.knowledgeStore.getAll();
    const scored = nodes.map(node => ({
      node,
      score: this.cosineSimilarity(queryVector, this.computeTFIDF(node.content))
    }));
    
    // 4. 排序并返回 Top 5
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.node);
  }
}
```

#### 3. 付费功能控制

**决策**: 本地特性标志 + 试用期时间戳

**理由**:
- MVP 阶段不需要复杂的后端验证
- 本地控制足够，降低开发成本
- 为后续服务端验证预留接口

**实现**:
```typescript
// background/subscription/feature-gate.ts
interface Subscription {
  tier: 'free' | 'premium';
  trialEndsAt?: number; // 试用结束时间戳
  premiumEndsAt?: number; // 付费结束时间戳
}

class FeatureGate {
  async canUseFeature(feature: string): Promise<boolean> {
    const sub = await this.getSubscription();
    const now = Date.now();
    
    // 试用期内，所有功能可用
    if (sub.trialEndsAt && now < sub.trialEndsAt) {
      return true;
    }
    
    // 付费用户，所有功能可用
    if (sub.tier === 'premium' && sub.premiumEndsAt && now < sub.premiumEndsAt) {
      return true;
    }
    
    // 免费用户，检查功能限制
    return this.isFreeFeature(feature);
  }
}
```

### 数据模型

#### 知识图谱
```typescript
interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  relations: Relation[];
  metadata: {
    totalNodes: number;
    totalRelations: number;
    lastUpdated: number;
  };
}

interface Relation {
  from: string; // 节点ID
  to: string;
  type: 'contains' | 'improves' | 'relates' | 'contradicts';
  weight: number; // 0-1
}
```

#### 订阅信息
```typescript
interface Subscription {
  tier: 'free' | 'premium';
  trialStartedAt?: number;
  trialEndsAt?: number;
  premiumStartedAt?: number;
  premiumEndsAt?: number;
  features: {
    multiModel: boolean;
    multiDocCompare: boolean;
    knowledgeGraph: boolean;
    monthlyTokens: number;
  };
}
```

### 性能指标

- 知识图谱构建: ≤ 5秒（100个节点）
- 自然语言检索: ≤ 2秒
- 多文档对比: ≤ 10秒（3篇文档）
- 内存占用: ≤ 100MB

## Migration Plan

### MVP-1 → MVP-2
1. 添加云端 AI 引擎模块（不影响现有本地 AI）
2. 扩展数据存储（添加 IndexedDB）
3. 更新 UI（添加收藏按钮、Token 统计）
4. 向后兼容：所有 MVP-1 功能保持不变

### MVP-2 → MVP-3
1. 扩展云端 AI 引擎（添加多模型支持）
2. 添加知识图谱模块（独立模块，不影响现有存储）
3. 添加订阅管理模块
4. 更新 UI（添加模型切换、知识图谱可视化）
5. 向后兼容：所有 MVP-2 功能保持不变

## Risks / Trade-offs

### 风险

1. **本地 AI 兼容性**
   - 风险: Chrome 119+ 要求限制用户群
   - 缓解: 提供降级方案，优先测试兼容性
   - 监控: 统计用户 Chrome 版本分布

2. **知识图谱性能**
   - 风险: 节点数量增长导致性能下降
   - 缓解: 限制节点数量（最多1000个），提供清理功能
   - 监控: 记录图谱构建耗时

3. **付费转化率**
   - 风险: 免费功能过于完善，付费意愿低
   - 缓解: 确保付费功能有明显价值（多文档对比、知识图谱）
   - 监控: 统计试用转化率

### 权衡

1. **功能完整性 vs 开发速度**
   - 选择: 优先开发速度，分阶段交付
   - 理由: 快速验证产品价值，降低风险

2. **本地处理 vs 云端处理**
   - 选择: 基础功能本地，高级功能云端
   - 理由: 平衡隐私保护和功能强大

3. **简单实现 vs 完美体验**
   - 选择: MVP 阶段优先简单实现
   - 理由: 快速迭代，根据反馈优化

## Open Questions

1. **Gemini Nano 提示词优化**: 需要实验确定最佳提示词模板
2. **知识图谱关联阈值**: 相似度阈值需要根据实际数据调整
3. **付费定价策略**: 需要市场调研确定最优价格
4. **多文档对比算法**: 需要实验不同的对比策略
