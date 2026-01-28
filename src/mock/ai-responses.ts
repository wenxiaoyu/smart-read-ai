/**
 * Mock AI 响应数据
 * 用于 UI Demo，模拟真实 AI 调用
 */

export interface MockAIResponse {
  original?: string
  result: string
  type: 'simplify' | 'explain' | 'code' | 'formula'
  metadata?: {
    domain?: string
    confidence?: number
    processingTime?: number
    provider?: string
    keyTerms?: string[]
  }
}

// 预置术语解释库
const termDatabase: Record<string, string> = {
  React: 'React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发。它采用组件化的开发方式，使用虚拟 DOM 提升性能。',
  TypeScript:
    'TypeScript 是 JavaScript 的超集，添加了静态类型检查。它由 Microsoft 开发，可以编译为纯 JavaScript 代码。',
  'Shadow DOM':
    'Shadow DOM 是 Web Components 的一部分，用于封装样式和标记。它创建了一个隔离的 DOM 树，避免样式冲突。',
  API: 'API（Application Programming Interface）是应用程序编程接口，定义了软件组件之间的交互方式。',
  REST: 'REST（Representational State Transfer）是一种软件架构风格，用于设计网络应用程序的接口。',
  GraphQL:
    'GraphQL 是一种用于 API 的查询语言，由 Facebook 开发。它允许客户端精确指定需要的数据。',
  Docker: 'Docker 是一个开源的容器化平台，用于开发、部署和运行应用程序。',
  Kubernetes: 'Kubernetes 是一个开源的容器编排平台，用于自动化容器化应用程序的部署、扩展和管理。',
  Git: 'Git 是一个分布式版本控制系统，用于跟踪代码变更和协作开发。',
  Python: 'Python 是一种高级编程语言，以简洁的语法和强大的功能著称，广泛用于 Web 开发、数据科学和人工智能。',
  JavaScript:
    'JavaScript 是一种高级编程语言，主要用于 Web 开发。它可以在浏览器和服务器端（Node.js）运行。',
  CSS: 'CSS（Cascading Style Sheets）是层叠样式表，用于描述 HTML 文档的呈现样式。',
  HTML: 'HTML（HyperText Markup Language）是超文本标记语言，用于创建网页的结构。',
  Node: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，用于构建服务器端应用程序。',
  npm: 'npm（Node Package Manager）是 Node.js 的包管理器，用于安装和管理 JavaScript 包。',
  Webpack: 'Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。',
  Vite: 'Vite 是一个新型前端构建工具，提供极速的开发服务器和优化的生产构建。',
  Redux: 'Redux 是一个 JavaScript 状态管理库，常与 React 配合使用。',
  Vue: 'Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面。',
  Angular: 'Angular 是一个基于 TypeScript 的 Web 应用框架，由 Google 维护。',
  MongoDB: 'MongoDB 是一个基于文档的 NoSQL 数据库，使用 JSON 格式存储数据。',
  SQL: 'SQL（Structured Query Language）是结构化查询语言，用于管理关系型数据库。',
  AWS: 'AWS（Amazon Web Services）是亚马逊提供的云计算平台，提供各种云服务。',
  CI: 'CI（Continuous Integration）是持续集成，一种软件开发实践，频繁地将代码集成到主分支。',
  CD: 'CD（Continuous Deployment/Delivery）是持续部署/交付，自动化软件发布流程。',
  Agile: 'Agile（敏捷开发）是一种软件开发方法论，强调迭代开发和快速响应变化。',
  Scrum: 'Scrum 是一种敏捷开发框架，使用短周期迭代（Sprint）进行项目管理。',
  TDD: 'TDD（Test-Driven Development）是测试驱动开发，先写测试再写代码的开发方式。',
  BDD: 'BDD（Behavior-Driven Development）是行为驱动开发，关注软件的行为规范。',
  DDD: 'DDD（Domain-Driven Design）是领域驱动设计，一种软件设计方法论。',
  Microservices: '微服务是一种架构风格，将应用程序构建为一组小型、独立的服务。',
  Serverless: 'Serverless（无服务器）是一种云计算模型，开发者无需管理服务器基础设施。',
  DevOps: 'DevOps 是开发（Development）和运维（Operations）的结合，强调协作和自动化。',
}

/**
 * Mock AI 简化功能
 */
export const mockSimplify = (text: string): string => {
  const length = text.length
  if (length < 50) {
    return `这段文本比较简短，核心意思是：${text.substring(0, 30)}...`
  }

  return `这段文本的核心意思是：${text.substring(0, 40)}... 主要讲述了技术实现的关键点，包括核心概念、实现方式和应用场景。通过简化后，更容易理解其中的要点。`
}

/**
 * Mock AI 术语解释功能
 */
export const mockExplain = (term: string): string => {
  // 清理术语（去除空格、标点）
  const cleanTerm = term.trim().replace(/[.,!?;:]/g, '')

  // 查找预置解释
  const explanation = termDatabase[cleanTerm]
  if (explanation) {
    return explanation
  }

  // 如果没有预置解释，返回通用解释
  return `"${cleanTerm}" 是一个技术术语，用于描述特定的概念或技术。建议查阅相关文档以获取更详细的信息。`
}

/**
 * Mock AI 代码解析功能
 */
export const mockAnalyzeCode = (_code: string): string => {
  return `
**代码功能分析：**

这段代码实现了以下功能：

1. **核心逻辑**：定义了一个函数/类，实现特定的业务逻辑
2. **输入处理**：接收参数并进行验证和转换
3. **数据操作**：对数据进行处理、计算或转换
4. **结果返回**：返回处理后的结果

**关键点：**
- 使用了现代 JavaScript/TypeScript 特性
- 代码结构清晰，易于维护
- 遵循了最佳实践

**建议：**
- 可以添加错误处理逻辑
- 考虑添加单元测试
- 注意性能优化
  `.trim()
}

/**
 * Mock AI 公式解析功能
 */
export const mockAnalyzeFormula = (_formula: string): string => {
  return `
**公式说明：**

这个数学公式表示：

- **变量含义**：公式中的变量代表特定的数学或物理量
- **运算关系**：描述了变量之间的数学关系
- **应用场景**：常用于计算特定的指标或结果

**示例：**
假设输入值为 x，通过公式计算可得到相应的输出值。

**注意事项：**
- 确保输入值在有效范围内
- 注意单位换算
- 考虑边界情况
  `.trim()
}

/**
 * 模拟 AI 调用延迟
 */
export const mockDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 统一的 Mock AI 调用接口
 */
export const mockAICall = async (
  action: 'simplify' | 'explain' | 'code' | 'formula',
  text: string
): Promise<MockAIResponse> => {
  // 模拟网络延迟
  await mockDelay()

  let result: string

  switch (action) {
    case 'simplify':
      result = mockSimplify(text)
      break
    case 'explain':
      result = mockExplain(text)
      break
    case 'code':
      result = mockAnalyzeCode(text)
      break
    case 'formula':
      result = mockAnalyzeFormula(text)
      break
    default:
      result = '处理完成'
  }

  return {
    original: text,
    result,
    type: action,
  }
}

/**
 * 获取所有预置术语列表
 */
export const getAllTerms = (): string[] => {
  return Object.keys(termDatabase)
}

/**
 * 检查是否为预置术语
 */
export const isKnownTerm = (term: string): boolean => {
  const cleanTerm = term.trim().replace(/[.,!?;:]/g, '')
  return cleanTerm in termDatabase
}
