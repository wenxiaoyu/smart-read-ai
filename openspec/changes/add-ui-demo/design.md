# 智阅AI UI Demo 技术设计

## Context

本 Demo 的目标是构建一个高保真的 UI 原型，验证核心交互体验。采用"UI 完整、逻辑留白"的策略，所有 AI 解析、数据存储等业务逻辑使用 Mock 实现。

## Goals / Non-Goals

### Goals
- 构建与真实产品无差异的 UI 体验
- 验证 Shadow DOM 样式隔离方案
- 验证跨网站兼容性
- 建立可复用的 UI 组件库

### Non-Goals
- 不实现真实的 AI 调用
- 不实现真实的数据持久化
- 不实现完整的错误处理
- 不追求代码的生产级质量（Demo 代码）

## Architecture

### 组件架构

```
┌─────────────────────────────────────────────────────────┐
│                    Content Script                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Selection Toolbar (划词工具栏)          │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │  │
│  │  │ 简化 │  │ 解释 │  │ 复制 │  │ 更多 │         │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Result Card (结果展示卡片)                │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 🤖 AI 解析结果                              │  │  │
│  │  │ ─────────────────────────────────────────  │  │  │
│  │  │ [Mock 数据内容]                            │  │  │
│  │  │                                            │  │  │
│  │  │ [复制] [收藏] [关闭]                       │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      Popup Window                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  🔍 知识检索                                      │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 搜索你的知识库...                          │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  📊 Token 使用统计                                │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 本月已用: 1,234 / 10,000                   │  │  │
│  │  │ ████████░░░░░░░░░░ 12.3%                   │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  ⚙️ 快速设置                                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Options Page                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  智阅AI 设置                                      │  │
│  │  ─────────────────────────────────────────────   │  │
│  │                                                   │  │
│  │  🤖 AI 模型配置                                   │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 默认模型: [文心一言 4.0 ▼]                 │  │  │
│  │  │ API 密钥: [••••••••••••••••]               │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  │  🎨 界面设置                                      │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │ 主题: ○ 浅色  ● 暗黑  ○ 自动              │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## UI 组件设计

### 1. 划词工具栏 (SelectionToolbar)

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  💡 简化  │  📖 解释  │  📋 复制  │  ⋯  │
└─────────────────────────────────────────┘
     ↑ 小三角指向选中文本
```

#### 技术实现
```typescript
// src/content/components/SelectionToolbar.tsx
interface SelectionToolbarProps {
  position: { x: number; y: number };
  selectedText: string;
  onAction: (action: 'simplify' | 'explain' | 'copy') => void;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  position,
  selectedText,
  onAction
}) => {
  return (
    <div 
      className="toolbar-container"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999999
      }}
    >
      <div className="toolbar-content">
        <button onClick={() => onAction('simplify')}>
          <span className="icon">💡</span>
          <span>简化</span>
        </button>
        <button onClick={() => onAction('explain')}>
          <span className="icon">📖</span>
          <span>解释</span>
        </button>
        <button onClick={() => onAction('copy')}>
          <span className="icon">📋</span>
          <span>复制</span>
        </button>
      </div>
    </div>
  );
};
```

#### 样式设计
```css
/* src/content/components/SelectionToolbar.css */
.toolbar-container {
  animation: fadeInUp 0.2s ease-out;
}

.toolbar-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 2px;
}

.toolbar-content button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.toolbar-content button:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .toolbar-content button {
    background: rgba(30, 30, 30, 0.9);
    color: white;
  }
  
  .toolbar-content button:hover {
    background: rgba(40, 40, 40, 1);
  }
}
```

#### 交互逻辑（Mock）
```typescript
// src/content/hooks/useSelectionToolbar.ts
export const useSelectionToolbar = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length >= 5) {
        const range = selection!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 50 // 工具栏在选中文本上方
        });
        setSelectedText(text);
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleAction = async (action: string) => {
    // Mock: 模拟 AI 处理
    console.log(`Action: ${action}, Text: ${selectedText}`);
    
    // 显示加载状态
    showLoadingCard();
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 显示 Mock 结果
    showResultCard(getMockResult(action, selectedText));
  };

  return { visible, position, selectedText, handleAction };
};
```

### 2. 结果展示卡片 (ResultCard)

#### 视觉设计
```
┌─────────────────────────────────────────────────┐
│ 🤖 AI 解析结果                    [−] [×]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  原文：                                         │
│  "This is a complex technical sentence..."     │
│                                                 │
│  简化：                                         │
│  这是一个复杂的技术句子，主要讲述了...          │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💡 提示：点击可复制内容                 │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [📋 复制]  [⭐ 收藏]  [🔗 来源]              │
└─────────────────────────────────────────────────┘
```

#### 技术实现
```typescript
// src/content/components/ResultCard.tsx
interface ResultCardProps {
  type: 'simplify' | 'explain' | 'code' | 'formula';
  originalText: string;
  result: string;
  loading?: boolean;
  onClose: () => void;
  onCopy: () => void;
  onSave: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  type,
  originalText,
  result,
  loading,
  onClose,
  onCopy,
  onSave
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="result-icon">
          {type === 'simplify' && '💡'}
          {type === 'explain' && '📖'}
          {type === 'code' && '💻'}
          {type === 'formula' && '📐'}
        </span>
        <span className="result-title">
          {type === 'simplify' && 'AI 简化结果'}
          {type === 'explain' && 'AI 术语解释'}
          {type === 'code' && 'AI 代码解析'}
          {type === 'formula' && 'AI 公式解析'}
        </span>
        <div className="result-actions">
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? '−' : '+'}
          </button>
          <button onClick={onClose}>×</button>
        </div>
      </div>

      {expanded && (
        <div className="result-body">
          {loading ? (
            <div className="result-loading">
              <div className="spinner"></div>
              <p>AI 正在分析中...</p>
            </div>
          ) : (
            <>
              <div className="result-section">
                <div className="section-label">原文</div>
                <div className="section-content original">
                  {originalText}
                </div>
              </div>

              <div className="result-section">
                <div className="section-label">
                  {type === 'simplify' && '简化'}
                  {type === 'explain' && '解释'}
                  {type === 'code' && '解析'}
                  {type === 'formula' && '说明'}
                </div>
                <div className="section-content result">
                  {result}
                </div>
              </div>

              <div className="result-footer">
                <button onClick={onCopy}>
                  <span>📋</span> 复制
                </button>
                <button onClick={onSave}>
                  <span>⭐</span> 收藏
                </button>
                <button>
                  <span>🔗</span> 来源
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
```

#### 样式设计
```css
/* src/content/components/ResultCard.css */
.result-card {
  position: fixed;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideInUp 0.3s ease-out;
  z-index: 999998;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.result-icon {
  font-size: 20px;
}

.result-title {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
}

.result-actions button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.2s;
}

.result-actions button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.result-body {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.result-section {
  margin-bottom: 16px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.section-content {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.section-content.original {
  background: #f3f4f6;
  color: #4b5563;
  font-style: italic;
}

.section-content.result {
  background: #eff6ff;
  color: #1e40af;
}

.result-loading {
  text-align: center;
  padding: 32px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-footer {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.result-footer button {
  flex: 1;
  padding: 8px 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.result-footer button:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .result-card {
    background: #1f2937;
    color: #f3f4f6;
  }
  
  .result-header {
    border-bottom-color: #374151;
  }
  
  .section-content.original {
    background: #374151;
    color: #d1d5db;
  }
  
  .section-content.result {
    background: #1e3a8a;
    color: #93c5fd;
  }
  
  .result-footer button {
    background: #374151;
    color: #f3f4f6;
  }
  
  .result-footer button:hover {
    background: #4b5563;
  }
}
```

### 3. Shadow DOM 集成

```typescript
// src/content/index.tsx
class SmartReadAI {
  private shadowRoot: ShadowRoot;
  private container: HTMLDivElement;

  constructor() {
    // 创建容器
    this.container = document.createElement('div');
    this.container.id = 'smartread-ai-root';
    document.body.appendChild(this.container);

    // 创建 Shadow DOM
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });

    // 注入样式
    this.injectStyles();

    // 渲染 React 组件
    this.render();
  }

  private injectStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      /* CSS Reset for Shadow DOM */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* 导入所有组件样式 */
      ${toolbarStyles}
      ${resultCardStyles}
    `;
    this.shadowRoot.appendChild(styleSheet);
  }

  private render() {
    const root = createRoot(this.shadowRoot);
    root.render(<App />);
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SmartReadAI();
  });
} else {
  new SmartReadAI();
}
```

## Mock 数据设计

### Mock AI 响应

```typescript
// src/mock/ai-responses.ts
export const mockAIResponses = {
  simplify: (text: string): string => {
    // 模拟简化结果
    return `这段文本的核心意思是：${text.substring(0, 20)}... 主要讲述了技术实现的关键点。`;
  },

  explain: (term: string): string => {
    // 模拟术语解释
    const explanations: Record<string, string> = {
      'React': 'React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发。',
      'TypeScript': 'TypeScript 是 JavaScript 的超集，添加了静态类型检查。',
      'Shadow DOM': 'Shadow DOM 是 Web Components 的一部分，用于封装样式和标记。',
      // ... 更多预置术语
    };
    
    return explanations[term] || `${term} 是一个技术术语，用于描述特定的概念或技术。`;
  },

  analyzeCode: (code: string): string => {
    return `
这段代码的功能：
1. 定义了一个函数/类
2. 实现了特定的业务逻辑
3. 使用了现代 JavaScript/TypeScript 特性

核心逻辑：
- 输入处理
- 数据转换
- 结果返回
    `.trim();
  },

  analyzeFormula: (formula: string): string => {
    return `
这个公式表示：
- 变量 x 代表输入值
- 运算符表示数学关系
- 结果用于计算特定指标
    `.trim();
  }
};

// 模拟延迟
export const mockDelay = (ms: number = 1500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 模拟 API 调用
export const mockAICall = async (
  action: string,
  text: string
): Promise<string> => {
  await mockDelay();
  
  switch (action) {
    case 'simplify':
      return mockAIResponses.simplify(text);
    case 'explain':
      return mockAIResponses.explain(text);
    case 'code':
      return mockAIResponses.analyzeCode(text);
    case 'formula':
      return mockAIResponses.analyzeFormula(text);
    default:
      return '处理完成';
  }
};
```

### Mock 知识节点

```typescript
// src/mock/knowledge-data.ts
export const mockKnowledgeNodes = [
  {
    id: '1',
    type: 'term',
    content: 'React Hooks',
    explanation: 'React Hooks 是 React 16.8 引入的新特性...',
    sourceUrl: 'https://react.dev/reference/react',
    createdAt: Date.now() - 86400000,
    tags: ['React', 'JavaScript', '前端']
  },
  {
    id: '2',
    type: 'code',
    content: 'const [state, setState] = useState(0);',
    explanation: 'useState 是最常用的 Hook...',
    sourceUrl: 'https://react.dev/reference/react/useState',
    createdAt: Date.now() - 172800000,
    tags: ['React', 'Hooks', 'State']
  },
  // ... 更多 Mock 数据
];

export const mockTokenUsage = {
  provider: 'wenxin',
  month: '2026-01',
  totalTokens: 12340,
  budget: 100000,
  cost: 0.15,
  history: [
    { timestamp: Date.now() - 3600000, tokens: 500, action: 'simplify' },
    { timestamp: Date.now() - 7200000, tokens: 300, action: 'explain' },
    // ... 更多历史记录
  ]
};
```

## 开发计划

### Phase 1: 基础架构（1-2天）
- [ ] 搭建 React + TypeScript 开发环境
- [ ] 配置 Shadow DOM 集成
- [ ] 创建基础组件结构
- [ ] 设置 Mock 数据层

### Phase 2: 核心 UI 组件（2-3天）
- [ ] 实现划词工具栏
- [ ] 实现结果展示卡片
- [ ] 实现加载状态和动画
- [ ] 实现暗黑模式

### Phase 3: Popup 和 Options（1-2天）
- [ ] 实现 Popup 弹窗
- [ ] 实现 Options 设置页
- [ ] 实现 Token 统计展示
- [ ] 实现知识节点列表

### Phase 4: 测试和优化（1-2天）
- [ ] 跨网站兼容性测试
- [ ] 性能优化
- [ ] 动画流畅度优化
- [ ] 响应式适配

## 测试网站列表

Demo 需要在以下网站测试兼容性：

### 技术文档类
- [ ] GitHub (github.com)
- [ ] Stack Overflow (stackoverflow.com)
- [ ] MDN (developer.mozilla.org)
- [ ] 掘金 (juejin.cn)
- [ ] CSDN (csdn.net)

### 学术论文类
- [ ] arXiv (arxiv.org)
- [ ] Google Scholar (scholar.google.com)
- [ ] 知网 (cnki.net)

### 通用网站
- [ ] 百度 (baidu.com)
- [ ] 知乎 (zhihu.com)
- [ ] 微信公众号文章

## 性能指标

- 划词工具栏弹出延迟: < 100ms
- 结果卡片渲染: < 50ms
- 动画帧率: 60 FPS
- 内存占用: < 30MB
- 样式隔离: 100%（无冲突）

## 交付物

1. **可运行的 Demo 插件**
   - 可在 Chrome 中加载
   - 所有 UI 交互完整
   - Mock 数据流畅

2. **Demo 使用指南**
   - 安装步骤
   - 功能演示
   - 测试场景

3. **技术文档**
   - 组件 API 文档
   - 样式规范
   - Mock 数据格式

4. **演示视频**
   - 核心功能演示
   - 交互流程展示
   - 跨网站兼容性展示
