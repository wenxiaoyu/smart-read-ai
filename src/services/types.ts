/**
 * 文本简化服务的类型定义
 */

/**
 * 预处理后的文本
 */
export interface PreprocessedText {
  original: string; // 原始文本
  cleaned: string; // 清理后的文本
  length: number; // 字符数
  language: 'zh' | 'en' | 'mixed'; // 语言
}

/**
 * 简化请求
 */
export interface SimplifyRequest {
  text: string; // 要简化的文本
  language: 'zh' | 'en' | 'mixed'; // 语言
  maxLength?: number; // 可选：期望的最大长度
}

/**
 * 简化结果
 */
export interface SimplifyResult {
  simplified: string; // 简化后的文本
  domain: string; // AI 识别的领域
  confidence: number; // 置信度 0-1
  keyTerms?: string[]; // 关键术语（可选）
  processingTime: number; // 处理时间（毫秒）
  provider: CloudProvider; // 使用的提供商
}

/**
 * 解释请求
 */
export interface ExplainRequest {
  text: string; // 要解释的文本
  language: 'zh' | 'en' | 'mixed'; // 语言
  context?: string; // 可选：上下文信息
}

/**
 * 解释结果
 */
export interface ExplainResult {
  explanation: string; // 解释内容
  domain: string; // AI 识别的领域
  confidence: number; // 置信度 0-1
  keyTerms?: string[]; // 关键术语（可选）
  relatedConcepts?: string[]; // 相关概念（可选）
  processingTime: number; // 处理时间（毫秒）
  provider: CloudProvider; // 使用的提供商
}

/**
 * 云端 AI 提供商
 */
export type CloudProvider = 'gpt4' | 'claude' | 'wenxin' | 'moonshot';

/**
 * AI 引擎接口
 */
export interface AIEngine {
  /**
   * 简化文本
   */
  simplify(request: SimplifyRequest): Promise<SimplifyResult>;

  /**
   * 解释文本
   */
  explain(request: ExplainRequest): Promise<ExplainResult>;

  /**
   * 检查引擎是否可用
   */
  isAvailable(): Promise<boolean>;
}

/**
 * 简化错误类型
 */
export enum SimplifyErrorType {
  NO_API_KEY = 'no_api_key',
  INVALID_API_KEY = 'invalid_api_key',
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  UNKNOWN_ERROR = 'unknown_error',
}

/**
 * 简化错误
 */
export class SimplifyError extends Error {
  constructor(
    public type: SimplifyErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'SimplifyError';
  }
}

/**
 * API 密钥配置
 */
export interface APIKeyConfig {
  provider: CloudProvider;
  apiKey: string;
  isDefault?: boolean; // 是否为默认提供商
}

/**
 * 加密后的 API 密钥
 */
export interface EncryptedAPIKey {
  provider: CloudProvider;
  encryptedKey: string;
  iv: string; // 初始化向量
  isDefault?: boolean;
}
