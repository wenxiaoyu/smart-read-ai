/**
 * 加密服务
 * 使用 AES-256-GCM 加密 API 密钥
 */
export class CryptoService {
  private readonly algorithm = 'AES-GCM';
  private readonly keyLength = 256;

  /**
   * 生成设备指纹
   * 基于浏览器和设备信息生成唯一标识
   */
  private async generateDeviceFingerprint(): Promise<string> {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      navigator.hardwareConcurrency?.toString() || '',
      screen.width.toString(),
      screen.height.toString(),
      screen.colorDepth.toString(),
      new Date().getTimezoneOffset().toString(),
    ].join('|');

    return fingerprint;
  }

  /**
   * 派生加密密钥
   * 从设备指纹派生 AES 密钥
   */
  private async deriveKey(fingerprint: string): Promise<CryptoKey> {
    // 将指纹转换为 ArrayBuffer
    const encoder = new TextEncoder();
    const fingerprintBuffer = encoder.encode(fingerprint);

    // 使用 SHA-256 哈希指纹
    const hashBuffer = await crypto.subtle.digest('SHA-256', fingerprintBuffer);

    // 导入为 AES 密钥
    const key = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );

    return key;
  }

  /**
   * 加密文本
   * @param plaintext 明文
   * @returns 加密结果 { ciphertext, iv }
   */
  async encrypt(plaintext: string): Promise<{ ciphertext: string; iv: string }> {
    try {
      // 生成设备指纹
      const fingerprint = await this.generateDeviceFingerprint();

      // 派生密钥
      const key = await this.deriveKey(fingerprint);

      // 生成随机 IV（初始化向量）
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // 编码明文
      const encoder = new TextEncoder();
      const plaintextBuffer = encoder.encode(plaintext);

      // 加密
      const ciphertextBuffer = await crypto.subtle.encrypt(
        { name: this.algorithm, iv },
        key,
        plaintextBuffer
      );

      // 转换为 Base64
      const ciphertext = this.arrayBufferToBase64(ciphertextBuffer);
      const ivBase64 = this.arrayBufferToBase64(iv.buffer);

      return { ciphertext, iv: ivBase64 };
    } catch (error) {
      console.error('[CryptoService] Encryption error:', error);
      throw new Error('加密失败');
    }
  }

  /**
   * 解密文本
   * @param ciphertext 密文（Base64）
   * @param iv 初始化向量（Base64）
   * @returns 明文
   */
  async decrypt(ciphertext: string, iv: string): Promise<string> {
    try {
      // 生成设备指纹
      const fingerprint = await this.generateDeviceFingerprint();

      // 派生密钥
      const key = await this.deriveKey(fingerprint);

      // 解码 Base64
      const ciphertextBuffer = this.base64ToArrayBuffer(ciphertext);
      const ivBuffer = this.base64ToArrayBuffer(iv);

      // 解密
      const plaintextBuffer = await crypto.subtle.decrypt(
        { name: this.algorithm, iv: ivBuffer },
        key,
        ciphertextBuffer
      );

      // 解码明文
      const decoder = new TextDecoder();
      const plaintext = decoder.decode(plaintextBuffer);

      return plaintext;
    } catch (error) {
      console.error('[CryptoService] Decryption error:', error);
      throw new Error('解密失败，可能是设备指纹已变化');
    }
  }

  /**
   * ArrayBuffer 转 Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Base64 转 ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
