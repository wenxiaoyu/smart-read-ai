import type { ExplainResult, CloudProvider } from './types';
import { SimplifyError, SimplifyErrorType } from './types';
import { TextPreprocessor } from './text-preprocessor';
import { CloudAIEngine } from './ai/cloud-ai-engine';

/**
 * 解释服务日志
 */
interface ExplainLog {
  timestamp: number;
  textLength: number;
  language: string;
  provider: CloudProvider;
  domain: string;
  confidence: number;
  processingTime: number;
  success: boolean;
  error?: string;
}

/**
 * 解释服务
 * 统一调度云端 AI 引擎进行术语解释
 */
export class ExplainService {
  private preprocessor: TextPreprocessor;
  private cloudEngine: CloudAIEngine | null = null;
  private logs: ExplainLog[] = [];

  constructor() {
    this.preprocessor = new TextPreprocessor();
  }

  /**
   * 配置云端 AI 引擎
   * @param provider AI 提供商
   * @param apiKey API 密钥
   */
  setCloudEngine(provider: CloudProvider, apiKey: string): void {
    this.cloudEngine = new CloudAIEngine(provider, apiKey);
  }

  /**
   * 解释文本
   * @param text 原始文本
   * @returns 解释结果
   */
  async explain(text: string): Promise<ExplainResult> {
    const startTime = performance.now();

    try {
      // 1. 预处理
      const preprocessed = this.preprocessor.preprocess(text);
      console.log('[ExplainService] Preprocessed:', {
        length: preprocessed.length,
        language: preprocessed.language,
      });

      // 2. 检查云端 AI 是否可用
      if (!this.cloudEngine) {
        throw new SimplifyError(
          SimplifyErrorType.NO_API_KEY,
          '请先配置 API 密钥'
        );
      }

      if (!(await this.cloudEngine.isAvailable())) {
        throw new SimplifyError(
          SimplifyErrorType.NO_API_KEY,
          '请先配置 API 密钥'
        );
      }

      // 3. 调用云端 AI
      console.log('[ExplainService] Calling cloud AI...');
      const result = await this.cloudEngine.explain({
        text: preprocessed.cleaned,
        language: preprocessed.language,
      });

      // 4. 记录成功日志
      this.logExplain({
        timestamp: Date.now(),
        textLength: preprocessed.length,
        language: preprocessed.language,
        provider: result.provider,
        domain: result.domain,
        confidence: result.confidence,
        processingTime: performance.now() - startTime,
        success: true,
      });

      console.log('[ExplainService] Success:', {
        domain: result.domain,
        confidence: result.confidence,
        processingTime: result.processingTime,
        provider: result.provider,
      });

      return result;
    } catch (error) {
      // 记录失败日志
      this.logExplain({
        timestamp: Date.now(),
        textLength: text.length,
        language: 'unknown',
        provider: (this.cloudEngine?.['provider'] as CloudProvider) || 'gpt4',
        domain: 'unknown',
        confidence: 0,
        processingTime: performance.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });

      console.error('[ExplainService] Failed:', error);
      throw error;
    }
  }

  /**
   * 记录解释日志
   */
  private logExplain(log: ExplainLog): void {
    this.logs.push(log);
    // 只保留最近 100 条日志
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  /**
   * 获取日志
   */
  getLogs(): ExplainLog[] {
    return [...this.logs];
  }

  /**
   * 清空日志
   */
  clearLogs(): void {
    this.logs = [];
  }
}
