import type { SimplifyResult, CloudProvider } from './types';
import { SimplifyError, SimplifyErrorType } from './types';
import { TextPreprocessor } from './text-preprocessor';
import { CloudAIEngine } from './ai/cloud-ai-engine';

/**
 * 简化服务日志
 */
interface SimplifyLog {
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
 * 简化服务
 * 统一调度云端 AI 引擎
 */
export class SimplifyService {
  private preprocessor: TextPreprocessor;
  private cloudEngine: CloudAIEngine | null = null;
  private logs: SimplifyLog[] = [];

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
   * 简化文本
   * @param text 原始文本
   * @returns 简化结果
   */
  async simplify(text: string): Promise<SimplifyResult> {
    const startTime = performance.now();

    try {
      // 1. 预处理
      const preprocessed = this.preprocessor.preprocess(text);
      console.log('[SimplifyService] Preprocessed:', {
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
      console.log('[SimplifyService] Calling cloud AI...');
      const result = await this.cloudEngine.simplify({
        text: preprocessed.cleaned,
        language: preprocessed.language,
      });

      // 4. 记录成功日志
      this.logSimplify({
        timestamp: Date.now(),
        textLength: preprocessed.length,
        language: preprocessed.language,
        provider: result.provider,
        domain: result.domain,
        confidence: result.confidence,
        processingTime: performance.now() - startTime,
        success: true,
      });

      console.log('[SimplifyService] Success:', {
        domain: result.domain,
        confidence: result.confidence,
        processingTime: result.processingTime,
        provider: result.provider,
      });

      return result;
    } catch (error) {
      // 记录失败日志
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logSimplify({
        timestamp: Date.now(),
        textLength: text.length,
        language: 'unknown',
        provider: this.cloudEngine?.['provider'] || 'gpt4',
        domain: 'unknown',
        confidence: 0,
        processingTime: performance.now() - startTime,
        success: false,
        error: errorMessage,
      });

      console.error('[SimplifyService] Error:', error);

      // 重新抛出错误
      if (error instanceof SimplifyError) {
        throw error;
      }

      throw new SimplifyError(
        SimplifyErrorType.UNKNOWN_ERROR,
        '处理失败，请重试',
        error as Error
      );
    }
  }

  /**
   * 记录简化日志
   */
  private logSimplify(log: SimplifyLog): void {
    this.logs.push(log);

    // 只保留最近 100 条日志
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalCalls: number;
    successRate: number;
    averageProcessingTime: number;
    providerUsage: Record<CloudProvider, number>;
  } {
    const totalCalls = this.logs.length;
    const successCalls = this.logs.filter((log) => log.success).length;
    const successRate = totalCalls > 0 ? successCalls / totalCalls : 0;

    const totalProcessingTime = this.logs.reduce(
      (sum, log) => sum + log.processingTime,
      0
    );
    const averageProcessingTime =
      totalCalls > 0 ? totalProcessingTime / totalCalls : 0;

    const providerUsage: Record<CloudProvider, number> = {
      gpt4: 0,
      claude: 0,
      wenxin: 0,
      moonshot: 0,
    };

    this.logs.forEach((log) => {
      providerUsage[log.provider]++;
    });

    return {
      totalCalls,
      successRate,
      averageProcessingTime,
      providerUsage,
    };
  }

  /**
   * 清除日志
   */
  clearLogs(): void {
    this.logs = [];
  }
}
