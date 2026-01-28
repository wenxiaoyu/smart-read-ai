import type { PreprocessedText } from './types';

/**
 * 文本预处理器
 * 负责清理文本和检测语言
 */
export class TextPreprocessor {
  /**
   * 预处理文本
   * @param text 原始文本
   * @returns 预处理后的文本
   */
  preprocess(text: string): PreprocessedText {
    const startTime = performance.now();

    // 1. 清理文本：去除多余空白
    const cleaned = this.cleanText(text);

    // 2. 检测语言
    const language = this.detectLanguage(cleaned);

    const processingTime = performance.now() - startTime;

    // 确保处理时间 < 10ms
    if (processingTime > 10) {
      console.warn(
        `[TextPreprocessor] Processing time exceeded 10ms: ${processingTime.toFixed(2)}ms`
      );
    }

    return {
      original: text,
      cleaned,
      length: cleaned.length,
      language,
    };
  }

  /**
   * 清理文本
   * @param text 原始文本
   * @returns 清理后的文本
   */
  private cleanText(text: string): string {
    return (
      text
        .trim()
        // 将多个空白字符替换为单个空格
        .replace(/\s+/g, ' ')
        // 去除行首行尾空白
        .replace(/^\s+|\s+$/gm, '')
    );
  }

  /**
   * 检测语言
   * @param text 文本
   * @returns 语言类型
   */
  private detectLanguage(text: string): 'zh' | 'en' | 'mixed' {
    // 检测中文字符（包括中文标点）
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);

    // 检测英文字符
    const hasEnglish = /[a-zA-Z]/.test(text);

    if (hasChinese && hasEnglish) {
      return 'mixed';
    } else if (hasChinese) {
      return 'zh';
    } else {
      return 'en';
    }
  }
}
