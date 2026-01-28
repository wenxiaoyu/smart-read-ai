import type {
  AIEngine,
  SimplifyRequest,
  SimplifyResult,
  ExplainRequest,
  ExplainResult,
  CloudProvider,
} from '../types';
import { SimplifyError, SimplifyErrorType } from '../types';

/**
 * 云端 AI 引擎
 * 支持 OpenAI GPT-4、Anthropic Claude、百度文心一言
 */
export class CloudAIEngine implements AIEngine {
  private apiKey: string;
  private provider: CloudProvider;
  private readonly timeout = 10000; // 10 秒超时
  private readonly maxRetries = 2; // 最多重试 2 次

  constructor(provider: CloudProvider, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  /**
   * 检查引擎是否可用
   */
  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  /**
   * 简化文本
   */
  async simplify(request: SimplifyRequest): Promise<SimplifyResult> {
    const startTime = performance.now();

    // 检查 API 密钥
    if (!this.apiKey) {
      throw new SimplifyError(
        SimplifyErrorType.NO_API_KEY,
        '请先配置 API 密钥'
      );
    }

    // 构建 Prompt
    const prompt = this.buildPrompt(request);

    // 调用 API（带重试）
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.callAPI(prompt);
        const result = this.parseResponse(response, startTime);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(
          `[CloudAIEngine] Attempt ${attempt + 1} failed:`,
          error
        );

        // 如果是认证错误或无 API 密钥，不重试
        if (
          error instanceof SimplifyError &&
          (error.type === SimplifyErrorType.INVALID_API_KEY ||
            error.type === SimplifyErrorType.NO_API_KEY)
        ) {
          throw error;
        }

        // 最后一次尝试失败，抛出错误
        if (attempt === this.maxRetries) {
          break;
        }

        // 等待一段时间后重试
        await this.delay(1000 * (attempt + 1));
      }
    }

    // 所有重试都失败
    throw lastError || new SimplifyError(SimplifyErrorType.UNKNOWN_ERROR, '处理失败，请重试');
  }

  /**
   * 解释文本
   */
  async explain(request: ExplainRequest): Promise<ExplainResult> {
    const startTime = performance.now();

    // 检查 API 密钥
    if (!this.apiKey) {
      throw new SimplifyError(
        SimplifyErrorType.NO_API_KEY,
        '请先配置 API 密钥'
      );
    }

    // 构建 Prompt
    const prompt = this.buildExplainPrompt(request);

    // 调用 API（带重试）
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.callAPI(prompt);
        const result = this.parseExplainResponse(response, startTime);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(
          `[CloudAIEngine] Explain attempt ${attempt + 1} failed:`,
          error
        );

        // 如果是认证错误或无 API 密钥，不重试
        if (
          error instanceof SimplifyError &&
          (error.type === SimplifyErrorType.INVALID_API_KEY ||
            error.type === SimplifyErrorType.NO_API_KEY)
        ) {
          throw error;
        }

        // 最后一次尝试失败，抛出错误
        if (attempt === this.maxRetries) {
          break;
        }

        // 等待一段时间后重试
        await this.delay(1000 * (attempt + 1));
      }
    }

    // 所有重试都失败
    throw lastError || new SimplifyError(SimplifyErrorType.UNKNOWN_ERROR, '解释失败，请重试');
  }

  /**
   * 构建 Prompt
   */
  private buildPrompt(request: SimplifyRequest): string {
    const { text, language } = request;

    const prompts = {
      zh: `你是"智阅AI"助手，专门帮助用户快速理解复杂内容。

# 你的任务
将下面的文本改写成更容易理解的版本，让普通读者能快速抓住核心意思。

# 改写原则
1. **保持准确**：不改变原文的核心意思和关键信息
2. **简化表达**：
   - 长句→短句（一句话说一个意思）
   - 复杂词→常用词（但专业术语保持原样）
   - 被动句→主动句
   - 抽象概念→具体例子（如果有助于理解）
3. **保留专业内容**：
   - 代码、API名称、函数名：原样保留
   - 专业术语：保留，但可以加简短解释
   - 公式、数字：原样保留
4. **结构清晰**：
   - 如果原文有多个要点，分点说明
   - 如果有因果关系，明确指出

# 示例

原文：The implementation leverages a sophisticated caching mechanism to optimize performance by reducing redundant computations and minimizing I/O operations.

改写：这个实现用了缓存技术来提升性能。具体做法是：1) 避免重复计算；2) 减少 I/O 操作。

---

原文：ValidationError extends Error { constructor(message) { super(message); this.name = "ValidationError"; } }

改写：这是一个 ValidationError 类，继承自 Error。它的作用是表示验证失败的错误。当创建这个错误时，会设置错误消息和名称。

---

原文：The methodology employed in this study utilizes a mixed-methods approach to triangulate findings and enhance the validity of conclusions.

改写：这项研究用了混合方法。就是同时用定性和定量两种方式来收集数据，互相验证，让结论更可靠。

# 现在请改写

原文：
${text}

# 返回格式（必须是有效的 JSON）
\`\`\`json
{
  "simplified": "改写后的文本",
  "domain": "内容类型（技术文档/学术论文/代码/数学/通用）",
  "confidence": 0.9,
  "keyTerms": ["术语1", "术语2", "术语3"],
  "tips": "理解提示（可选，一句话说明这段内容的核心）"
}
\`\`\`

要求：
- simplified 必须是完整的改写文本
- keyTerms 是数组，包含保留的专业术语
- 如果原文很短（<20字），可以适当扩展解释
- 如果原文很长，可以分段说明
- confidence 是你对改写质量的信心（0-1）`,

      en: `You are "SmartRead AI", helping users quickly understand complex content.

# Your Task
Rewrite the following text into an easier-to-understand version, so average readers can quickly grasp the core meaning.

# Rewriting Principles
1. **Stay Accurate**: Don't change the core meaning and key information
2. **Simplify Expression**:
   - Long sentences → Short sentences (one idea per sentence)
   - Complex words → Common words (but keep technical terms)
   - Passive voice → Active voice
   - Abstract concepts → Concrete examples (if helpful)
3. **Preserve Professional Content**:
   - Code, API names, function names: Keep as-is
   - Technical terms: Keep, but can add brief explanation
   - Formulas, numbers: Keep as-is
4. **Clear Structure**:
   - If multiple points, list them
   - If cause-effect, make it explicit

# Examples

Original: The implementation leverages a sophisticated caching mechanism to optimize performance by reducing redundant computations and minimizing I/O operations.

Rewritten: This implementation uses caching to improve performance. It does two things: 1) Avoids repeated calculations; 2) Reduces I/O operations.

---

Original: ValidationError extends Error { constructor(message) { super(message); this.name = "ValidationError"; } }

Rewritten: This is a ValidationError class that inherits from Error. It represents validation failure errors. When you create this error, it sets the error message and name.

---

Original: The methodology employed in this study utilizes a mixed-methods approach to triangulate findings and enhance the validity of conclusions.

Rewritten: This study uses mixed methods. That means it collects data both qualitatively and quantitatively, cross-validates them, making conclusions more reliable.

# Now Please Rewrite

Original:
${text}

# Return Format (Must be valid JSON)
\`\`\`json
{
  "simplified": "Rewritten text",
  "domain": "Content type (technical/academic/code/math/general)",
  "confidence": 0.9,
  "keyTerms": ["Technical terms preserved"],
  "tips": "Understanding tip (optional, one sentence about the core idea)"
}
\`\`\`

Requirements:
- simplified must be complete rewritten text
- If original is very short (<20 words), can expand with explanation
- If original is very long, can break into sections
- confidence is your certainty about rewrite quality (0-1)`,

      mixed: `你是"智阅AI"助手。下面的文本包含中英文混合内容。

# 任务
改写成更容易理解的版本。

# 原则
1. 保持准确，不改变核心意思
2. 长句→短句，复杂词→常用词
3. 专业术语保持原语言（中文术语用中文，英文术语用英文）
4. 可以加简短解释帮助理解

# 示例

原文：The API endpoint returns a JSON response containing user data.

改写：这个 API 接口返回 JSON 格式的用户数据。（JSON 是一种常用的数据格式）

---

原文：这个函数使用了 memoization 技术来优化性能。

改写：这个函数用了 memoization（记忆化）技术。它会缓存计算结果，避免重复计算，从而提升速度。

# 现在请改写

原文：
${text}

# 返回格式（有效的 JSON）
\`\`\`json
{
  "simplified": "改写后的文本",
  "domain": "technical/academic/code/math/general",
  "confidence": 0.9,
  "keyTerms": ["term1", "term2"],
  "tips": "理解提示（可选）"
}
\`\`\``,
    };

    return prompts[language];
  }

  /**
   * 构建解释 Prompt
   */
  private buildExplainPrompt(request: ExplainRequest): string {
    const { text, language } = request;

    const prompts = {
      zh: `你是"智阅AI"助手，专门帮助用户理解复杂的专业术语、概念和技术内容。

# 你的任务
对下面的文本进行详细解释，让不熟悉这个领域的人也能理解。

# 解释原则
1. **从基础开始**：假设读者不了解这个领域，从最基本的概念讲起
2. **分层解释**：
   - 第一层：用一句话说明"这是什么"
   - 第二层：解释"为什么需要它"或"它解决什么问题"
   - 第三层：说明"它是如何工作的"（如果适用）
3. **使用类比**：用日常生活中的例子来类比专业概念
4. **保持准确**：简化表达但不能失去准确性
5. **突出关键点**：如果有多个要点，分点说明

# 示例

原文：React Hooks

解释：
React Hooks 是 React 框架中的一个功能，让你可以在函数组件中使用状态和其他 React 特性。

为什么需要它？在 Hooks 出现之前，如果你想在组件中保存数据（比如用户输入的内容），就必须使用类组件，写起来比较复杂。Hooks 让你用更简单的函数组件就能做到同样的事。

怎么工作？最常用的是 useState Hook。比如你想记录按钮被点击了几次，就可以用 useState 创建一个计数器变量，每次点击时更新它。

---

原文：API Rate Limiting

解释：
API Rate Limiting（接口速率限制）是一种保护机制，限制用户在一定时间内可以调用 API 的次数。

为什么需要它？想象一个图书馆，如果允许一个人一次借走所有的书，其他人就借不到了。API 也是一样，如果不限制，有人可能会频繁调用接口，导致服务器过载，影响其他用户使用。

常见的限制方式：比如"每分钟最多 60 次请求"或"每天最多 1000 次请求"。超过限制后，服务器会返回错误，告诉你"请求太频繁，请稍后再试"。

---

原文：Memoization

解释：
Memoization（记忆化）是一种优化技术，通过缓存函数的计算结果来避免重复计算。

为什么需要它？假设你有一个计算很慢的函数，比如计算斐波那契数列。如果多次用相同的输入调用这个函数，每次都重新计算就很浪费时间。

怎么工作？第一次计算时，把输入和结果保存起来（像做笔记）。下次遇到相同的输入，直接查笔记返回结果，不用重新计算。就像你记住了"2+2=4"，下次看到 2+2 就直接说 4，不用再掰手指数。

# 现在请解释

原文：
${text}

# 返回格式（必须是有效的 JSON）
\`\`\`json
{
  "explanation": "详细的解释内容（可以分段）",
  "domain": "领域（技术/学术/数学/通用等）",
  "confidence": 0.9,
  "keyTerms": ["关键术语1", "关键术语2"],
  "relatedConcepts": ["相关概念1", "相关概念2"]
}
\`\`\`

要求：
- explanation 要详细、易懂，可以分段
- keyTerms 是原文中的关键术语
- relatedConcepts 是相关的概念（可选）
- confidence 是你对解释质量的信心（0-1）`,

      en: `You are "SmartRead AI", helping users understand complex professional terms, concepts, and technical content.

# Your Task
Provide a detailed explanation of the following text, making it understandable for people unfamiliar with the field.

# Explanation Principles
1. **Start from Basics**: Assume readers don't know this field, start from fundamental concepts
2. **Layered Explanation**:
   - Layer 1: One sentence on "what it is"
   - Layer 2: Explain "why it's needed" or "what problem it solves"
   - Layer 3: Describe "how it works" (if applicable)
3. **Use Analogies**: Use everyday examples to illustrate professional concepts
4. **Stay Accurate**: Simplify but don't lose accuracy
5. **Highlight Key Points**: If multiple points, list them

# Examples

Original: React Hooks

Explanation:
React Hooks is a feature in the React framework that lets you use state and other React features in function components.

Why is it needed? Before Hooks, if you wanted to store data in a component (like user input), you had to use class components, which were more complex to write. Hooks let you do the same thing with simpler function components.

How does it work? The most common one is useState Hook. For example, if you want to count button clicks, you can use useState to create a counter variable and update it on each click.

---

Original: API Rate Limiting

Explanation:
API Rate Limiting is a protection mechanism that limits how many times a user can call an API within a certain time period.

Why is it needed? Imagine a library where one person could borrow all the books at once - nobody else could borrow any. APIs are similar: without limits, someone might call the API so frequently that the server gets overloaded, affecting other users.

Common limits: Like "maximum 60 requests per minute" or "maximum 1000 requests per day". When you exceed the limit, the server returns an error saying "too many requests, please try again later".

---

Original: Memoization

Explanation:
Memoization is an optimization technique that caches function results to avoid repeated calculations.

Why is it needed? Suppose you have a slow function, like calculating Fibonacci numbers. If you call this function multiple times with the same input, recalculating each time wastes time.

How does it work? The first time you calculate, save the input and result (like taking notes). Next time you see the same input, just look up your notes and return the result without recalculating. Like remembering "2+2=4" - next time you see 2+2, you just say 4 without counting on your fingers.

# Now Please Explain

Original:
${text}

# Return Format (Must be valid JSON)
\`\`\`json
{
  "explanation": "Detailed explanation (can be multi-paragraph)",
  "domain": "Field (technical/academic/math/general etc.)",
  "confidence": 0.9,
  "keyTerms": ["Key term 1", "Key term 2"],
  "relatedConcepts": ["Related concept 1", "Related concept 2"]
}
\`\`\`

Requirements:
- explanation should be detailed and easy to understand, can be multi-paragraph
- keyTerms are key terms from the original text
- relatedConcepts are related concepts (optional)
- confidence is your certainty about explanation quality (0-1)`,

      mixed: `你是"智阅AI"助手。下面的文本包含中英文混合内容，请详细解释。

# 任务
提供详细解释，让不熟悉这个领域的人也能理解。

# 原则
1. 从基础概念开始解释
2. 分层说明：是什么 → 为什么 → 怎么做
3. 使用类比和例子
4. 保持准确性
5. 专业术语保持原语言

# 示例

原文：使用 useState Hook 管理组件状态

解释：
useState 是 React 中的一个 Hook（钩子函数），用来在函数组件中保存和更新数据。

为什么需要它？在网页应用中，组件经常需要"记住"一些信息。比如一个计数器需要记住当前的数字，一个表单需要记住用户输入的内容。useState 就是用来做这件事的。

怎么使用？调用 useState 时传入初始值，它会返回两个东西：1) 当前的值；2) 一个更新这个值的函数。比如 const [count, setCount] = useState(0) 创建了一个初始值为 0 的计数器。

# 现在请解释

原文：
${text}

# 返回格式（有效的 JSON）
\`\`\`json
{
  "explanation": "详细解释",
  "domain": "technical/academic/math/general",
  "confidence": 0.9,
  "keyTerms": ["term1", "term2"],
  "relatedConcepts": ["concept1", "concept2"]
}
\`\`\``,
    };

    return prompts[language];
  }

  /**
   * 调用 API
   */
  private async callAPI(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      switch (this.provider) {
        case 'gpt4':
          return await this.callOpenAI(prompt, controller.signal);
        case 'claude':
          return await this.callClaude(prompt, controller.signal);
        case 'wenxin':
          return await this.callWenxin(prompt, controller.signal);
        case 'moonshot':
          return await this.callMoonshot(prompt, controller.signal);
        default:
          throw new SimplifyError(
            SimplifyErrorType.UNKNOWN_ERROR,
            `Unknown provider: ${this.provider}`
          );
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new SimplifyError(
          SimplifyErrorType.TIMEOUT,
          '请求超时，请重试'
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 调用 OpenAI GPT-4
   */
  private async callOpenAI(
    prompt: string,
    signal: AbortSignal
  ): Promise<string> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content:
                  'You are a professional text simplification assistant.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
          signal,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new SimplifyError(
            SimplifyErrorType.INVALID_API_KEY,
            'API 密钥无效，请检查设置'
          );
        } else if (response.status === 429) {
          throw new SimplifyError(
            SimplifyErrorType.RATE_LIMIT,
            'API 调用次数已达上限'
          );
        } else {
          throw new SimplifyError(
            SimplifyErrorType.UNKNOWN_ERROR,
            `OpenAI API error: ${response.status}`
          );
        }
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof SimplifyError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw new SimplifyError(
        SimplifyErrorType.NETWORK_ERROR,
        '网络连接失败，请检查网络',
        error as Error
      );
    }
  }

  /**
   * 调用 Anthropic Claude
   */
  private async callClaude(
    prompt: string,
    signal: AbortSignal
  ): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new SimplifyError(
            SimplifyErrorType.INVALID_API_KEY,
            'API 密钥无效，请检查设置'
          );
        } else if (response.status === 429) {
          throw new SimplifyError(
            SimplifyErrorType.RATE_LIMIT,
            'API 调用次数已达上限'
          );
        } else {
          throw new SimplifyError(
            SimplifyErrorType.UNKNOWN_ERROR,
            `Claude API error: ${response.status}`
          );
        }
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      if (error instanceof SimplifyError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw new SimplifyError(
        SimplifyErrorType.NETWORK_ERROR,
        '网络连接失败，请检查网络',
        error as Error
      );
    }
  }

  /**
   * 调用百度文心一言
   * TODO: 实现文心一言 API 调用
   */
  private async callWenxin(
    _prompt: string,
    _signal: AbortSignal
  ): Promise<string> {
    // 暂未实现
    throw new SimplifyError(
      SimplifyErrorType.UNKNOWN_ERROR,
      '文心一言暂未实现'
    );
  }

  /**
   * 调用 Moonshot (Kimi)
   */
  private async callMoonshot(
    prompt: string,
    signal: AbortSignal
  ): Promise<string> {
    try {
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
                content:
                  'You are a professional text simplification assistant.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
          signal,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new SimplifyError(
            SimplifyErrorType.INVALID_API_KEY,
            'API 密钥无效，请检查设置'
          );
        } else if (response.status === 429) {
          throw new SimplifyError(
            SimplifyErrorType.RATE_LIMIT,
            'API 调用次数已达上限'
          );
        } else {
          throw new SimplifyError(
            SimplifyErrorType.UNKNOWN_ERROR,
            `Moonshot API error: ${response.status}`
          );
        }
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof SimplifyError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw new SimplifyError(
        SimplifyErrorType.NETWORK_ERROR,
        '网络连接失败，请检查网络',
        error as Error
      );
    }
  }

  /**
   * 解析响应
   */
  private parseResponse(response: string, startTime: number): SimplifyResult {
    try {
      // 方法 1：尝试直接解析 JSON
      try {
        const jsonData = JSON.parse(response);
        if (jsonData.simplified) {
          return {
            simplified: jsonData.simplified,
            domain: jsonData.domain || 'unknown',
            confidence: parseFloat(jsonData.confidence) || 0.8,
            keyTerms: Array.isArray(jsonData.keyTerms) ? jsonData.keyTerms : undefined,
            processingTime: performance.now() - startTime,
            provider: this.provider,
          };
        }
      } catch (jsonError) {
        console.log('[CloudAIEngine] Direct JSON parse failed, trying extraction');
      }

      // 方法 2：提取 JSON 代码块
      const jsonBlockMatch = response.match(/```json\s*([\s\S]+?)\s*```/);
      if (jsonBlockMatch) {
        try {
          const jsonData = JSON.parse(jsonBlockMatch[1]);
          if (jsonData.simplified) {
            return {
              simplified: jsonData.simplified,
              domain: jsonData.domain || 'unknown',
              confidence: parseFloat(jsonData.confidence) || 0.8,
              keyTerms: Array.isArray(jsonData.keyTerms) ? jsonData.keyTerms : undefined,
              processingTime: performance.now() - startTime,
              provider: this.provider,
            };
          }
        } catch (blockError) {
          console.log('[CloudAIEngine] JSON block parse failed');
        }
      }

      // 方法 3：查找 JSON 对象（可能没有代码块标记）
      const jsonObjectMatch = response.match(/\{[\s\S]*"simplified"[\s\S]*\}/);
      if (jsonObjectMatch) {
        try {
          const jsonData = JSON.parse(jsonObjectMatch[0]);
          if (jsonData.simplified) {
            return {
              simplified: jsonData.simplified,
              domain: jsonData.domain || 'unknown',
              confidence: parseFloat(jsonData.confidence) || 0.8,
              keyTerms: Array.isArray(jsonData.keyTerms) ? jsonData.keyTerms : undefined,
              processingTime: performance.now() - startTime,
              provider: this.provider,
            };
          }
        } catch (objectError) {
          console.log('[CloudAIEngine] JSON object parse failed');
        }
      }

      // 方法 4：备用 - 使用正则表达式解析结构化文本
      console.log('[CloudAIEngine] Falling back to regex parsing');
      
      // 尝试提取改写/简化内容
      const simplifiedMatch = response.match(/(?:改写|简化|Simplified|Rewritten)[:：]\s*([\s\S]+?)(?=\n(?:领域|Domain|置信度|Confidence)|$)/);
      const domainMatch = response.match(/(?:领域|Domain|内容类型|Content type)[:：]\s*(.+)/);
      const confidenceMatch = response.match(/(?:置信度|Confidence)[:：]\s*([\d.]+)/);
      const termsMatch = response.match(/(?:关键术语|关键词|Key Terms)[:：]\s*(.+)/);

      const simplified = simplifiedMatch?.[1]?.trim() || response;
      const domain = domainMatch?.[1]?.trim() || 'unknown';
      const confidence = parseFloat(confidenceMatch?.[1] || '0.8');
      const keyTerms = termsMatch?.[1]
        ?.split(/[\s,，\t]+/) // 支持空格、逗号、tab 分隔
        .map((t) => t.trim())
        .filter(Boolean);

      return {
        simplified,
        domain,
        confidence,
        keyTerms,
        processingTime: performance.now() - startTime,
        provider: this.provider,
      };
    } catch (error) {
      console.error('[CloudAIEngine] Parse error:', error);
      // 解析完全失败时，返回原始响应
      return {
        simplified: response,
        domain: 'unknown',
        confidence: 0.5,
        processingTime: performance.now() - startTime,
        provider: this.provider,
      };
    }
  }

  /**
   * 解析解释响应
   */
  private parseExplainResponse(response: string, startTime: number): ExplainResult {
    try {
      // 方法 1：尝试直接解析 JSON
      try {
        const jsonData = JSON.parse(response);
        if (jsonData.explanation) {
          return {
            explanation: jsonData.explanation,
            domain: jsonData.domain || 'unknown',
            confidence: parseFloat(jsonData.confidence) || 0.8,
            keyTerms: Array.isArray(jsonData.keyTerms) ? jsonData.keyTerms : undefined,
            relatedConcepts: Array.isArray(jsonData.relatedConcepts) ? jsonData.relatedConcepts : undefined,
            processingTime: performance.now() - startTime,
            provider: this.provider,
          };
        }
      } catch (jsonError) {
        console.log('[CloudAIEngine] Direct JSON parse failed for explain, trying extraction');
      }

      // 方法 2：提取 JSON 代码块
      const jsonBlockMatch = response.match(/```json\s*([\s\S]+?)\s*```/);
      if (jsonBlockMatch) {
        try {
          const jsonData = JSON.parse(jsonBlockMatch[1]);
          if (jsonData.explanation) {
            return {
              explanation: jsonData.explanation,
              domain: jsonData.domain || 'unknown',
              confidence: parseFloat(jsonData.confidence) || 0.8,
              keyTerms: Array.isArray(jsonData.keyTerms) ? jsonData.keyTerms : undefined,
              relatedConcepts: Array.isArray(jsonData.relatedConcepts) ? jsonData.relatedConcepts : undefined,
              processingTime: performance.now() - startTime,
              provider: this.provider,
            };
          }
        } catch (blockError) {
          console.log('[CloudAIEngine] JSON block parse failed for explain');
        }
      }

      // 方法 3：查找 JSON 对象
      const jsonObjectMatch = response.match(/\{[\s\S]*"explanation"[\s\S]*\}/);
      if (jsonObjectMatch) {
        try {
          const jsonData = JSON.parse(jsonObjectMatch[0]);
          if (jsonData.explanation) {
            return {
              explanation: jsonData.explanation,
              domain: jsonData.domain || 'unknown',
              confidence: parseFloat(jsonData.confidence) || 0.8,
              keyTerms: Array.isArray(jsonData.keyTerms) ? jsonData.keyTerms : undefined,
              relatedConcepts: Array.isArray(jsonData.relatedConcepts) ? jsonData.relatedConcepts : undefined,
              processingTime: performance.now() - startTime,
              provider: this.provider,
            };
          }
        } catch (objectError) {
          console.log('[CloudAIEngine] JSON object parse failed for explain');
        }
      }

      // 方法 4：备用 - 使用正则表达式解析
      console.log('[CloudAIEngine] Falling back to regex parsing for explain');
      
      const explanationMatch = response.match(/(?:解释|Explanation|说明)[:：]\s*([\s\S]+?)(?=\n(?:领域|Domain|关键术语|Key Terms)|$)/);
      const domainMatch = response.match(/(?:领域|Domain|类型)[:：]\s*(.+)/);
      const confidenceMatch = response.match(/(?:置信度|Confidence)[:：]\s*([\d.]+)/);
      const termsMatch = response.match(/(?:关键术语|关键词|Key Terms)[:：]\s*(.+)/);
      const conceptsMatch = response.match(/(?:相关概念|Related Concepts)[:：]\s*(.+)/);

      const explanation = explanationMatch?.[1]?.trim() || response;
      const domain = domainMatch?.[1]?.trim() || 'unknown';
      const confidence = parseFloat(confidenceMatch?.[1] || '0.8');
      const keyTerms = termsMatch?.[1]
        ?.split(/[\s,，\t]+/)
        .map((t) => t.trim())
        .filter(Boolean);
      const relatedConcepts = conceptsMatch?.[1]
        ?.split(/[\s,，\t]+/)
        .map((c) => c.trim())
        .filter(Boolean);

      return {
        explanation,
        domain,
        confidence,
        keyTerms,
        relatedConcepts,
        processingTime: performance.now() - startTime,
        provider: this.provider,
      };
    } catch (error) {
      console.error('[CloudAIEngine] Parse error for explain:', error);
      // 解析完全失败时，返回原始响应
      return {
        explanation: response,
        domain: 'unknown',
        confidence: 0.5,
        processingTime: performance.now() - startTime,
        provider: this.provider,
      };
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
