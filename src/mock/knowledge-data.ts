/**
 * Mock 知识节点数据
 * 用于 UI Demo，模拟知识库
 */

export interface KnowledgeNode {
  id: string
  type: 'term' | 'code' | 'formula' | 'conclusion'
  content: string
  explanation?: string
  sourceUrl: string
  createdAt: number
  tags: string[]
}

export interface TokenUsage {
  provider: 'wenxin' | 'qwen' | 'glm4'
  month: string // YYYY-MM
  totalTokens: number
  budget: number
  cost: number
  percentage: number
  history: Array<{
    timestamp: number
    tokens: number
    action: string
  }>
}

/**
 * Mock 知识节点数据
 */
export const mockKnowledgeNodes: KnowledgeNode[] = [
  {
    id: '1',
    type: 'term',
    content: 'React Hooks',
    explanation:
      'React Hooks 是 React 16.8 引入的新特性，允许在函数组件中使用 state 和其他 React 特性。',
    sourceUrl: 'https://react.dev/reference/react',
    createdAt: Date.now() - 86400000, // 1天前
    tags: ['React', 'JavaScript', '前端'],
  },
  {
    id: '2',
    type: 'code',
    content: 'const [state, setState] = useState(0);',
    explanation: 'useState 是最常用的 Hook，用于在函数组件中添加状态管理。',
    sourceUrl: 'https://react.dev/reference/react/useState',
    createdAt: Date.now() - 172800000, // 2天前
    tags: ['React', 'Hooks', 'State'],
  },
  {
    id: '3',
    type: 'term',
    content: 'Shadow DOM',
    explanation: 'Shadow DOM 是 Web Components 的一部分，用于封装样式和标记，避免样式冲突。',
    sourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM',
    createdAt: Date.now() - 259200000, // 3天前
    tags: ['Web Components', 'CSS', '前端'],
  },
  {
    id: '4',
    type: 'formula',
    content: 'E = mc²',
    explanation: '爱因斯坦的质能方程，表示能量等于质量乘以光速的平方。',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mass%E2%80%93energy_equivalence',
    createdAt: Date.now() - 345600000, // 4天前
    tags: ['物理', '相对论'],
  },
  {
    id: '5',
    type: 'conclusion',
    content: 'TypeScript 提供了更好的类型安全和开发体验',
    explanation:
      '通过静态类型检查，TypeScript 可以在编译时发现潜在错误，提高代码质量和可维护性。',
    sourceUrl: 'https://www.typescriptlang.org/',
    createdAt: Date.now() - 432000000, // 5天前
    tags: ['TypeScript', 'JavaScript', '最佳实践'],
  },
]

/**
 * Mock Token 使用统计
 */
export const mockTokenUsage: TokenUsage = {
  provider: 'wenxin',
  month: '2026-01',
  totalTokens: 12340,
  budget: 100000,
  cost: 0.15, // 人民币
  percentage: 12.34,
  history: [
    {
      timestamp: Date.now() - 3600000, // 1小时前
      tokens: 500,
      action: 'simplify',
    },
    {
      timestamp: Date.now() - 7200000, // 2小时前
      tokens: 300,
      action: 'explain',
    },
    {
      timestamp: Date.now() - 10800000, // 3小时前
      tokens: 450,
      action: 'code',
    },
    {
      timestamp: Date.now() - 14400000, // 4小时前
      tokens: 200,
      action: 'simplify',
    },
    {
      timestamp: Date.now() - 18000000, // 5小时前
      tokens: 600,
      action: 'explain',
    },
  ],
}

/**
 * 搜索知识节点（Mock）
 */
export const mockSearchKnowledge = async (query: string): Promise<KnowledgeNode[]> => {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 简单的关键词匹配
  const lowerQuery = query.toLowerCase()
  return mockKnowledgeNodes.filter(
    (node) =>
      node.content.toLowerCase().includes(lowerQuery) ||
      node.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      (node.explanation && node.explanation.toLowerCase().includes(lowerQuery))
  )
}

/**
 * 添加知识节点（Mock）
 */
export const mockAddKnowledgeNode = async (node: Omit<KnowledgeNode, 'id'>): Promise<string> => {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  // 生成 ID
  const id = `mock-${Date.now()}`

  // 在真实实现中，这里会保存到 IndexedDB
  console.log('Mock: 添加知识节点', { id, ...node })

  return id
}

/**
 * 删除知识节点（Mock）
 */
export const mockDeleteKnowledgeNode = async (id: string): Promise<void> => {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  console.log('Mock: 删除知识节点', id)
}

/**
 * 获取所有知识节点（Mock）
 */
export const mockGetAllKnowledgeNodes = async (): Promise<KnowledgeNode[]> => {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockKnowledgeNodes
}

/**
 * 更新 Token 使用统计（Mock）
 */
export const mockUpdateTokenUsage = async (tokens: number, action: string): Promise<void> => {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 100))

  console.log('Mock: 更新 Token 使用', { tokens, action })

  // 在真实实现中，这里会更新到存储
  mockTokenUsage.totalTokens += tokens
  mockTokenUsage.percentage = (mockTokenUsage.totalTokens / mockTokenUsage.budget) * 100
  mockTokenUsage.cost = mockTokenUsage.totalTokens * 0.000012 // 假设单价

  mockTokenUsage.history.unshift({
    timestamp: Date.now(),
    tokens,
    action,
  })

  // 只保留最近 20 条记录
  if (mockTokenUsage.history.length > 20) {
    mockTokenUsage.history = mockTokenUsage.history.slice(0, 20)
  }
}
