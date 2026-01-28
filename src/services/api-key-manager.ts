import type { CloudProvider, APIKeyConfig, EncryptedAPIKey } from './types';
import { CryptoService } from './crypto-service';

/**
 * API 密钥管理器
 * 负责安全存储和管理 API 密钥
 */
export class APIKeyManager {
  private cryptoService: CryptoService;
  private readonly storageKey = 'smartread_api_keys';

  constructor() {
    this.cryptoService = new CryptoService();
  }

  /**
   * 保存 API 密钥
   * @param config API 密钥配置
   */
  async saveKey(config: APIKeyConfig): Promise<void> {
    try {
      // 加密 API 密钥
      const { ciphertext, iv } = await this.cryptoService.encrypt(
        config.apiKey
      );

      // 获取现有密钥
      const existingKeys = await this.getAllKeys();

      // 如果设置为默认，清除其他默认标记
      if (config.isDefault) {
        existingKeys.forEach((key) => {
          key.isDefault = false;
        });
      }

      // 查找是否已存在该提供商的密钥
      const existingIndex = existingKeys.findIndex(
        (key) => key.provider === config.provider
      );

      const encryptedKey: EncryptedAPIKey = {
        provider: config.provider,
        encryptedKey: ciphertext,
        iv,
        isDefault: config.isDefault,
      };

      if (existingIndex >= 0) {
        // 更新现有密钥
        existingKeys[existingIndex] = encryptedKey;
      } else {
        // 添加新密钥
        existingKeys.push(encryptedKey);
      }

      // 保存到 Chrome Storage
      await chrome.storage.sync.set({
        [this.storageKey]: existingKeys,
      });

      console.log('[APIKeyManager] Key saved:', config.provider);
    } catch (error) {
      console.error('[APIKeyManager] Save error:', error);
      throw new Error('保存 API 密钥失败');
    }
  }

  /**
   * 获取 API 密钥
   * @param provider AI 提供商
   * @returns API 密钥（明文）
   */
  async getKey(provider: CloudProvider): Promise<string | null> {
    try {
      const allKeys = await this.getAllKeys();
      const keyData = allKeys.find((key) => key.provider === provider);

      if (!keyData) {
        return null;
      }

      // 解密 API 密钥
      const apiKey = await this.cryptoService.decrypt(
        keyData.encryptedKey,
        keyData.iv
      );

      return apiKey;
    } catch (error) {
      console.error('[APIKeyManager] Get error:', error);
      throw new Error('获取 API 密钥失败');
    }
  }

  /**
   * 获取默认提供商的 API 密钥
   * @returns { provider, apiKey } 或 null
   */
  async getDefaultKey(): Promise<{
    provider: CloudProvider;
    apiKey: string;
  } | null> {
    try {
      const allKeys = await this.getAllKeys();
      const defaultKey = allKeys.find((key) => key.isDefault);

      if (!defaultKey) {
        // 如果没有设置默认，返回第一个
        if (allKeys.length > 0) {
          const firstKey = allKeys[0];
          const apiKey = await this.cryptoService.decrypt(
            firstKey.encryptedKey,
            firstKey.iv
          );
          return { provider: firstKey.provider, apiKey };
        }
        return null;
      }

      const apiKey = await this.cryptoService.decrypt(
        defaultKey.encryptedKey,
        defaultKey.iv
      );

      return { provider: defaultKey.provider, apiKey };
    } catch (error) {
      console.error('[APIKeyManager] Get default error:', error);
      return null;
    }
  }

  /**
   * 删除 API 密钥
   * @param provider AI 提供商
   */
  async deleteKey(provider: CloudProvider): Promise<void> {
    try {
      const allKeys = await this.getAllKeys();
      const filteredKeys = allKeys.filter((key) => key.provider !== provider);

      await chrome.storage.sync.set({
        [this.storageKey]: filteredKeys,
      });

      console.log('[APIKeyManager] Key deleted:', provider);
    } catch (error) {
      console.error('[APIKeyManager] Delete error:', error);
      throw new Error('删除 API 密钥失败');
    }
  }

  /**
   * 验证 API 密钥
   * @param provider AI 提供商
   * @param apiKey API 密钥
   * @returns 是否有效
   */
  async validateKey(
    provider: CloudProvider,
    apiKey: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // 简单的测试请求
      const testPrompt = 'Hello';

      switch (provider) {
        case 'gpt4':
          return await this.validateOpenAI(apiKey, testPrompt);
        case 'claude':
          return await this.validateClaude(apiKey, testPrompt);
        case 'wenxin':
          return await this.validateWenxin(apiKey, testPrompt);
        case 'moonshot':
          return await this.validateMoonshot(apiKey, testPrompt);
        default:
          return { valid: false, error: 'Unknown provider' };
      }
    } catch (error) {
      console.error('[APIKeyManager] Validate error:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 验证 OpenAI API 密钥
   */
  private async validateOpenAI(
    _apiKey: string,
    _testPrompt: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: _testPrompt }],
            max_tokens: 10,
          }),
        }
      );

      if (response.ok) {
        return { valid: true };
      } else if (response.status === 401) {
        return { valid: false, error: 'API 密钥无效' };
      } else {
        return { valid: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * 验证 Claude API 密钥
   */
  private async validateClaude(
    _apiKey: string,
    _testPrompt: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': _apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [{ role: 'user', content: _testPrompt }],
        }),
      });

      if (response.ok) {
        return { valid: true };
      } else if (response.status === 401) {
        return { valid: false, error: 'API 密钥无效' };
      } else {
        return { valid: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * 验证文心一言 API 密钥
   * TODO: 实现文心一言验证
   */
  private async validateWenxin(
    _apiKey: string,
    _testPrompt: string
  ): Promise<{ valid: boolean; error?: string }> {
    return { valid: false, error: '文心一言暂未实现' };
  }

  /**
   * 验证 Moonshot API 密钥
   */
  private async validateMoonshot(
    _apiKey: string,
    _testPrompt: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(
        'https://api.moonshot.cn/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_apiKey}`,
          },
          body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [{ role: 'user', content: _testPrompt }],
            max_tokens: 10,
          }),
        }
      );

      if (response.ok) {
        return { valid: true };
      } else if (response.status === 401) {
        return { valid: false, error: 'API 密钥无效' };
      } else {
        return { valid: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * 获取所有加密的 API 密钥
   */
  private async getAllKeys(): Promise<EncryptedAPIKey[]> {
    const result = await chrome.storage.sync.get(this.storageKey);
    return (result[this.storageKey] as EncryptedAPIKey[]) || [];
  }

  /**
   * 检查是否有任何 API 密钥
   */
  async hasAnyKey(): Promise<boolean> {
    const allKeys = await this.getAllKeys();
    return allKeys.length > 0;
  }

  /**
   * 获取所有提供商列表（不包含密钥）
   */
  async getProviders(): Promise<
    Array<{ provider: CloudProvider; isDefault: boolean }>
  > {
    const allKeys = await this.getAllKeys();
    return allKeys.map((key) => ({
      provider: key.provider,
      isDefault: key.isDefault || false,
    }));
  }
}
