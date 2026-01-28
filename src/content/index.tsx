// Content Script - SmartRead AI
// 智阅AI 划词工具和结果展示

import { createRoot, Root } from 'react-dom/client'
import { SelectionToolbar } from './components/SelectionToolbar'
import { ResultCard } from './components/ResultCard'
import { createShadowContainer, getSelectionPosition, copyToClipboard } from '../utils/dom'
import { MockAIResponse } from '../mock/ai-responses'
import { mockAddKnowledgeNode } from '../mock/knowledge-data'
import { debounce } from '../utils/performance'
import { SimplifyService } from '../services/simplify-service'
import { ExplainService } from '../services/explain-service'
import { APIKeyManager } from '../services/api-key-manager'
import { SimplifyError, SimplifyErrorType } from '../services/types'

console.log('[SmartRead AI] Content script loaded on:', window.location.href)
console.log('[SmartRead AI] Document ready state:', document.readyState)

// 应用状态
interface AppState {
  toolbarVisible: boolean
  toolbarPosition: { x: number; y: number }
  selectedText: string
  resultVisible: boolean
  resultPosition: { x: number; y: number }
  resultData: MockAIResponse | null
  resultLoading: boolean
  toolbarLoading: boolean // 新增：工具栏按钮加载状态
  toolbarLoadingAction: 'simplify' | 'explain' | 'copy' | null // 新增：哪个按钮在加载
  resultError?: string // 新增：错误信息
}

class SmartReadAI {
  private shadowRoot: ShadowRoot
  private root: Root
  private simplifyService: SimplifyService
  private explainService: ExplainService
  private apiKeyManager: APIKeyManager
  private state: AppState = {
    toolbarVisible: false,
    toolbarPosition: { x: 0, y: 0 },
    selectedText: '',
    resultVisible: false,
    resultPosition: { x: 0, y: 0 },
    resultData: null,
    resultLoading: false,
    toolbarLoading: false,
    toolbarLoadingAction: null,
    resultError: undefined,
  }

  constructor() {
    console.log('[SmartRead AI] Initializing...')
    
    // 初始化服务
    this.simplifyService = new SimplifyService()
    this.explainService = new ExplainService()
    this.apiKeyManager = new APIKeyManager()
    
    // 创建 Shadow DOM 容器
    const { shadowRoot } = createShadowContainer('smartread-ai-root')
    this.shadowRoot = shadowRoot
    console.log('[SmartRead AI] Shadow DOM created')

    // 注入样式到 Shadow DOM
    this.injectStyles()
    console.log('[SmartRead AI] Styles injected')

    // 创建 React 根节点
    const appContainer = document.createElement('div')
    this.shadowRoot.appendChild(appContainer)
    this.root = createRoot(appContainer)
    console.log('[SmartRead AI] React root created')

    // 初始化
    this.init()
  }

  private injectStyles() {
    // 注入所有组件样式
    const allStyles = `
      /* 划词工具栏样式 - 毛玻璃效果 */
      .smartread-toolbar-container {
        position: fixed;
        z-index: 2147483647;
        animation: smartread-fadeInUp 0.2s ease-out;
        transform: translateX(-50%);
        pointer-events: auto;
      }

      .smartread-toolbar-content {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 6px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        display: flex;
        gap: 4px;
        pointer-events: auto;
      }

      .smartread-toolbar-button {
        all: unset;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 12px;
        padding: 10px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .smartread-toolbar-button:hover {
        background: rgba(255, 255, 255, 0.4);
        border-color: rgba(255, 255, 255, 0.6);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }

      .smartread-toolbar-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .smartread-toolbar-icon {
        font-size: 16px;
        line-height: 1;
      }

      .smartread-toolbar-text {
        font-size: 13px;
        line-height: 1;
      }

      .smartread-toolbar-spinner {
        font-size: 16px;
        line-height: 1;
        display: inline-block;
        animation: smartread-spin 1s linear infinite;
      }

      .smartread-toolbar-arrow {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid rgba(255, 255, 255, 0.15);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }

      /* 结果展示卡片样式 - 毛玻璃效果 */
      .smartread-result-card {
        position: fixed;
        width: 500px;
        max-width: calc(100vw - 40px);
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(30px) saturate(180%);
        -webkit-backdrop-filter: blur(30px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
        animation: smartread-slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 2147483646;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
        transform: translateX(-50%);
        overflow: hidden;
        user-select: none;
      }

      .smartread-result-card.smartread-dragging {
        transition: none;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.4) inset;
      }

      .smartread-result-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        color: rgba(0, 0, 0, 0.85);
        user-select: none;
      }

      .smartread-result-icon {
        font-size: 22px;
        line-height: 1;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      }

      .smartread-result-title {
        flex: 1;
        font-weight: 700;
        font-size: 15px;
        line-height: 1;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
      }

      .smartread-result-actions {
        display: flex;
        gap: 6px;
      }

      .smartread-result-action-btn {
        all: unset;
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: rgba(0, 0, 0, 0.7);
        width: 32px;
        height: 32px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        user-select: none;
      }

      .smartread-result-action-btn:hover {
        background: rgba(255, 255, 255, 0.5);
        border-color: rgba(255, 255, 255, 0.6);
        transform: scale(1.05);
      }

      .smartread-result-body {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.2);
        user-select: text;
        padding-bottom: 70px;
      }

      .smartread-result-body::-webkit-scrollbar {
        width: 10px;
      }

      .smartread-result-body::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        margin: 4px;
      }

      .smartread-result-body::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 5px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      .smartread-result-body::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.25);
        background-clip: padding-box;
      }

      .smartread-result-section {
        margin-bottom: 18px;
      }

      .smartread-result-section:last-of-type {
        margin-bottom: 0;
      }

      .smartread-section-label {
        font-size: 11px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .smartread-section-content {
        padding: 14px 16px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.7;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .smartread-section-content p {
        margin: 0;
        margin-bottom: 8px;
      }

      .smartread-section-content p:last-child {
        margin-bottom: 0;
      }

      .smartread-original {
        background: rgba(100, 116, 139, 0.15);
        color: rgba(0, 0, 0, 0.75);
        font-style: italic;
      }

      .smartread-result {
        background: rgba(59, 130, 246, 0.15);
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }

      /* 关键词高亮样式 - 低调版本 */
      .smartread-highlight-term {
        background: #fef9c3;
        color: inherit;
        font-weight: 600;
        padding: 1px 2px;
        border-radius: 2px;
      }

      .smartread-result-loading {
        text-align: center;
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      /* Spinner 组件样式 */
      .smartread-spinner-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .smartread-spinner {
        display: inline-block;
        position: relative;
      }

      .smartread-spinner-circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border-style: solid;
        border-color: transparent;
        animation: smartread-spin 0.8s linear infinite;
      }

      .smartread-spinner-small {
        width: 16px;
        height: 16px;
      }

      .smartread-spinner-small .smartread-spinner-circle {
        border-width: 2px;
      }

      .smartread-spinner-medium {
        width: 24px;
        height: 24px;
      }

      .smartread-spinner-medium .smartread-spinner-circle {
        border-width: 3px;
      }

      .smartread-spinner-large {
        width: 40px;
        height: 40px;
      }

      .smartread-spinner-large .smartread-spinner-circle {
        border-width: 4px;
      }

      .smartread-spinner-default .smartread-spinner-circle {
        border-top-color: rgba(0, 0, 0, 0.2);
        border-right-color: rgba(0, 0, 0, 0.2);
        border-bottom-color: rgba(0, 0, 0, 0.2);
        border-left-color: rgba(0, 0, 0, 0.7);
      }

      .smartread-spinner-primary .smartread-spinner-circle {
        border-top-color: rgba(102, 126, 234, 0.2);
        border-right-color: rgba(102, 126, 234, 0.2);
        border-bottom-color: rgba(102, 126, 234, 0.2);
        border-left-color: rgba(102, 126, 234, 1);
      }

      .smartread-spinner-white .smartread-spinner-circle {
        border-top-color: rgba(255, 255, 255, 0.2);
        border-right-color: rgba(255, 255, 255, 0.2);
        border-bottom-color: rgba(255, 255, 255, 0.2);
        border-left-color: rgba(255, 255, 255, 1);
      }

      .smartread-spinner-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.7);
        font-weight: 500;
      }

      .smartread-result-footer {
        display: flex;
        gap: 8px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.4);
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 12px 16px;
        border-radius: 0 0 20px 20px;
      }

      .smartread-footer-btn {
        all: unset;
        flex: 1;
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 12px;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
        user-select: none;
        color: rgba(0, 0, 0, 0.75);
        font-weight: 600;
      }

      .smartread-footer-btn:hover {
        background: rgba(255, 255, 255, 0.6);
        border-color: rgba(255, 255, 255, 0.7);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .smartread-footer-btn:active {
        transform: translateY(0);
      }

      /* 动画 */
      @keyframes smartread-fadeInUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @keyframes smartread-slideInUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @keyframes smartread-spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* 暗黑模式 - 毛玻璃效果 */
      @media (prefers-color-scheme: dark) {
        .smartread-toolbar-content {
          background: rgba(30, 30, 30, 0.6);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .smartread-toolbar-button {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .smartread-toolbar-button:hover {
          background: rgba(80, 80, 80, 0.6);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .smartread-toolbar-arrow {
          border-top-color: rgba(30, 30, 30, 0.6);
        }

        .smartread-result-card {
          background: rgba(30, 30, 30, 0.85);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5),
                      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .smartread-result-header {
          background: rgba(40, 40, 40, 0.5);
          border-bottom-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        .smartread-result-action-btn {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.8);
        }

        .smartread-result-action-btn:hover {
          background: rgba(80, 80, 80, 0.6);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .smartread-result-body {
          background: rgba(20, 20, 20, 0.3);
        }

        .smartread-result-body::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .smartread-result-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
        }

        .smartread-result-body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .smartread-section-label {
          color: rgba(255, 255, 255, 0.5);
        }

        .smartread-section-content {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .smartread-original {
          background: rgba(100, 116, 139, 0.25);
          color: rgba(255, 255, 255, 0.75);
        }

        .smartread-result {
          background: rgba(59, 130, 246, 0.25);
          color: rgba(147, 197, 253, 0.95);
        }

        /* 暗黑模式 - 关键词高亮 */
        .smartread-highlight-term {
          background: #422006;
          color: inherit;
        }

        .smartread-result-loading p {
          color: rgba(255, 255, 255, 0.6);
        }

        .smartread-spinner-default .smartread-spinner-circle {
          border-top-color: rgba(255, 255, 255, 0.2);
          border-right-color: rgba(255, 255, 255, 0.2);
          border-bottom-color: rgba(255, 255, 255, 0.2);
          border-left-color: rgba(255, 255, 255, 0.7);
        }

        .smartread-spinner-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .smartread-result-footer {
          background: rgba(40, 40, 40, 0.5);
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        .smartread-footer-btn {
          background: rgba(60, 60, 60, 0.5);
          border-color: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.8);
        }

        .smartread-footer-btn:hover {
          background: rgba(80, 80, 80, 0.6);
          border-color: rgba(255, 255, 255, 0.25);
        }
      }

      /* 响应式：小屏幕优化 */
      @media (max-width: 640px) {
        .smartread-toolbar-content {
          padding: 3px;
          gap: 1px;
        }

        .smartread-toolbar-button {
          padding: 6px 10px;
          font-size: 13px;
        }

        .smartread-toolbar-icon {
          font-size: 14px;
        }

        .smartread-toolbar-text {
          font-size: 12px;
        }

        .smartread-result-card {
          width: calc(100vw - 20px);
          max-width: none;
        }

        .smartread-result-body {
          max-height: 300px;
        }

        .smartread-section-content {
          font-size: 13px;
        }

        .smartread-footer-btn {
          font-size: 12px;
          padding: 6px 8px;
        }
      }

      /* 元数据显示样式 - 默认展开，无折叠功能 */
      .smartread-metadata-section {
        margin-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        padding-top: 12px;
      }

      .smartread-metadata-title {
        font-size: 11px;
        font-weight: 700;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
      }

      .smartread-metadata {
        margin-top: 0;
        padding: 0;
        background: transparent;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }

      .smartread-metadata-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
        background: #f9fafb;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
        font-size: 13px;
        transition: all 0.2s;
      }

      .smartread-metadata-item:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
      }

      .smartread-metadata-item.smartread-key-terms {
        grid-column: 1 / -1;
        flex-direction: column;
        align-items: flex-start;
      }

      .smartread-metadata-label {
        font-size: 11px;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .smartread-metadata-value {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        line-height: 1.4;
      }

      .smartread-key-terms-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }

      .smartread-key-term {
        padding: 5px 12px;
        background: #e5e7eb;
        color: #374151;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s;
      }

      .smartread-key-term:hover {
        background: #d1d5db;
      }

      /* 错误状态样式 */
      .smartread-result-error {
        text-align: center;
        padding: 32px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .smartread-error-icon {
        font-size: 48px;
        line-height: 1;
        opacity: 0.8;
      }

      .smartread-error-message {
        color: #dc2626;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
      }

      /* 暗黑模式 - 元数据和错误 */
      @media (prefers-color-scheme: dark) {
        .smartread-metadata-section {
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        .smartread-metadata-title {
          color: #6b7280;
        }

        .smartread-metadata-item {
          background: #374151;
          border-color: #4b5563;
        }

        .smartread-metadata-item:hover {
          background: #4b5563;
          border-color: #6b7280;
        }

        .smartread-metadata-label {
          color: #6b7280;
        }

        .smartread-metadata-value {
          color: #f3f4f6;
        }

        .smartread-key-term {
          background: #4b5563;
          color: #e5e7eb;
        }

        .smartread-key-term:hover {
          background: #6b7280;
        }

        .smartread-error-message {
          color: #f87171;
        }
      }
    `

    const styleSheet = document.createElement('style')
    styleSheet.textContent = allStyles
    this.shadowRoot.appendChild(styleSheet)
  }

  private init() {
    // 初始化 API 密钥
    this.initializeAPIKey()
    
    // 监听文本选中 - 使用防抖优化性能
    // 防抖延迟 50ms，避免频繁触发
    const debouncedHandleSelection = debounce(this.handleSelection, 50)
    document.addEventListener('mouseup', debouncedHandleSelection)
    console.log('[SmartRead AI] Event listener added with debounce')

    // 渲染初始状态
    this.render()

    console.log('[SmartRead AI] Initialized successfully')
  }

  private async initializeAPIKey() {
    try {
      // 获取默认 API 密钥
      const defaultKey = await this.apiKeyManager.getDefaultKey()
      if (defaultKey) {
        console.log('[SmartRead AI] Default API key found:', defaultKey.provider)
        this.simplifyService.setCloudEngine(defaultKey.provider, defaultKey.apiKey)
        this.explainService.setCloudEngine(defaultKey.provider, defaultKey.apiKey)
      } else {
        console.log('[SmartRead AI] No API key configured')
      }
    } catch (error) {
      console.error('[SmartRead AI] Failed to initialize API key:', error)
    }
  }

  private handleSelection = (event: MouseEvent) => {
    console.log('[SmartRead AI] Mouse up detected at:', event.clientX, event.clientY)
    
    // 检查是否点击在 Shadow DOM 内部（工具栏或结果卡片）
    const shadowContainer = document.getElementById('smartread-ai-root')
    
    // 检查 event.target
    if (shadowContainer?.shadowRoot?.contains(event.target as Node)) {
      console.log('[SmartRead AI] Click inside Shadow DOM (event.target), ignoring')
      return
    }
    
    // 检查 event.composedPath() - 这会包含 Shadow DOM 内的元素
    const path = event.composedPath()
    if (path.some(node => {
      // 只检查 Node 类型的对象（排除 Window 等非 Node 对象）
      if (node instanceof Node) {
        return node === shadowContainer || shadowContainer?.shadowRoot?.contains(node)
      }
      return false
    })) {
      console.log('[SmartRead AI] Click inside Shadow DOM (composedPath), ignoring')
      return
    }
    
    // 获取选中信息，传入鼠标事件坐标作为备用
    const selectionInfo = getSelectionPosition(event)
    console.log('[SmartRead AI] Selection info:', selectionInfo)

    if (selectionInfo) {
      console.log('[SmartRead AI] Showing toolbar at:', selectionInfo.x, selectionInfo.y)
      // 只在没有显示结果卡片时才显示工具栏
      // 如果结果卡片已显示，不要隐藏它
      if (!this.state.resultVisible) {
        this.setState({
          toolbarVisible: true,
          toolbarPosition: { x: selectionInfo.x, y: selectionInfo.y },
          selectedText: selectionInfo.text,
        })
      } else {
        console.log('[SmartRead AI] Result card is visible, not showing toolbar')
      }
    } else {
      // 没有选中文本，且不在显示结果时，隐藏工具栏
      if (this.state.toolbarVisible && !this.state.resultVisible) {
        console.log('[SmartRead AI] Hiding toolbar')
        this.setState({
          toolbarVisible: false,
        })
      }
    }
  }

  private handleToolbarAction = async (action: 'simplify' | 'explain' | 'copy') => {
    console.log('[SmartRead AI] Toolbar action triggered:', action)
    
    if (action === 'copy') {
      // 复制功能 - 显示加载状态
      this.setState({
        toolbarLoading: true,
        toolbarLoadingAction: 'copy',
      })
      
      const success = await copyToClipboard(this.state.selectedText)
      if (success) {
        this.showToast('已复制到剪贴板')
      } else {
        this.showToast('复制失败')
      }
      
      // 复制后关闭工具栏
      this.setState({
        toolbarVisible: false,
        toolbarLoading: false,
        toolbarLoadingAction: null,
      })
      return
    }

    // 简化功能 - 使用真实的 SimplifyService
    if (action === 'simplify') {
      console.log('[SmartRead AI] Starting simplify with SimplifyService')
      
      // 先显示结果卡片的加载状态，保持工具栏可见
      this.setState({
        toolbarLoading: true,
        toolbarLoadingAction: 'simplify',
        resultVisible: true,
        resultPosition: this.state.toolbarPosition,
        resultLoading: true,
        resultData: null,
        resultError: undefined,
      })

      try {
        // 调用简化服务
        const result = await this.simplifyService.simplify(this.state.selectedText)
        console.log('[SmartRead AI] Simplify result:', result)

        // 转换为 MockAIResponse 格式以兼容现有 UI
        const response: MockAIResponse = {
          type: 'simplify',
          result: result.simplified,
          metadata: {
            domain: result.domain,
            confidence: result.confidence,
            processingTime: result.processingTime,
            provider: result.provider,
            keyTerms: result.keyTerms,
          },
        }

        // 显示结果，隐藏工具栏
        this.setState({
          toolbarVisible: false,
          toolbarLoading: false,
          toolbarLoadingAction: null,
          resultLoading: false,
          resultData: response,
        })
      } catch (error) {
        console.error('[SmartRead AI] Simplify failed:', error)
        
        // 处理不同类型的错误
        let errorMessage = '简化失败，请重试'
        if (error instanceof SimplifyError) {
          switch (error.type) {
            case SimplifyErrorType.NO_API_KEY:
              errorMessage = '请先在设置页面配置 API 密钥'
              break
            case SimplifyErrorType.INVALID_API_KEY:
              errorMessage = 'API 密钥无效，请检查设置'
              break
            case SimplifyErrorType.NETWORK_ERROR:
              errorMessage = '网络连接失败，请检查网络'
              break
            case SimplifyErrorType.TIMEOUT:
              errorMessage = '请求超时，请重试'
              break
            case SimplifyErrorType.RATE_LIMIT:
              errorMessage = 'API 调用次数已达上限'
              break
            default:
              errorMessage = error.message
          }
        }
        
        // 显示错误在结果卡片中，隐藏工具栏
        this.setState({
          toolbarVisible: false,
          toolbarLoading: false,
          toolbarLoadingAction: null,
          resultLoading: false,
          resultError: errorMessage,
        })
      }
      return
    }

    // 解释功能 - 使用真实的 ExplainService
    if (action === 'explain') {
      console.log('[SmartRead AI] Starting explain with ExplainService')
      
      // 先显示结果卡片的加载状态，保持工具栏可见
      this.setState({
        toolbarLoading: true,
        toolbarLoadingAction: 'explain',
        resultVisible: true,
        resultPosition: this.state.toolbarPosition,
        resultLoading: true,
        resultData: null,
        resultError: undefined,
      })

      try {
        // 调用解释服务
        const result = await this.explainService.explain(this.state.selectedText)
        console.log('[SmartRead AI] Explain result:', result)

        // 转换为 MockAIResponse 格式以兼容现有 UI
        const response: MockAIResponse = {
          type: 'explain',
          result: result.explanation,
          metadata: {
            domain: result.domain,
            confidence: result.confidence,
            processingTime: result.processingTime,
            provider: result.provider,
            keyTerms: result.keyTerms,
          },
        }

        // 显示结果，隐藏工具栏
        this.setState({
          toolbarVisible: false,
          toolbarLoading: false,
          toolbarLoadingAction: null,
          resultLoading: false,
          resultData: response,
        })
      } catch (error) {
        console.error('[SmartRead AI] Explain failed:', error)
        
        // 处理不同类型的错误
        let errorMessage = '解释失败，请重试'
        if (error instanceof SimplifyError) {
          switch (error.type) {
            case SimplifyErrorType.NO_API_KEY:
              errorMessage = '请先在设置页面配置 API 密钥'
              break
            case SimplifyErrorType.INVALID_API_KEY:
              errorMessage = 'API 密钥无效，请检查设置'
              break
            case SimplifyErrorType.NETWORK_ERROR:
              errorMessage = '网络连接失败，请检查网络'
              break
            case SimplifyErrorType.TIMEOUT:
              errorMessage = '请求超时，请重试'
              break
            case SimplifyErrorType.RATE_LIMIT:
              errorMessage = 'API 调用次数已达上限'
              break
            default:
              errorMessage = error.message
          }
        }
        
        // 显示错误在结果卡片中，隐藏工具栏
        this.setState({
          toolbarVisible: false,
          toolbarLoading: false,
          toolbarLoadingAction: null,
          resultLoading: false,
          resultError: errorMessage,
        })
      }
      return
    }
  }

  private handleCloseToolbar = () => {
    this.setState({
      toolbarVisible: false,
    })
  }

  private handleCloseResult = () => {
    this.setState({
      resultVisible: false,
      resultData: null,
      resultError: undefined,
    })
  }

  private handleCopyResult = async () => {
    if (this.state.resultData) {
      const success = await copyToClipboard(this.state.resultData.result)
      if (success) {
        this.showToast('已复制结果')
      }
    }
  }

  private handleSaveResult = async () => {
    if (this.state.resultData) {
      try {
        await mockAddKnowledgeNode({
          type: this.state.resultData.type === 'simplify' ? 'conclusion' : 'term',
          content: this.state.selectedText,
          explanation: this.state.resultData.result,
          sourceUrl: window.location.href,
          createdAt: Date.now(),
          tags: ['Demo', this.state.resultData.type],
        })
        this.showToast('已保存到知识库')
      } catch (error) {
        console.error('Save failed:', error)
        this.showToast('保存失败')
      }
    }
  }

  private showToast(message: string) {
    // 简单的 Toast 提示（后续可以优化为组件）
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    `

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => toast.remove(), 300)
    }, 2000)
  }

  private setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState }
    this.render()
  }

  private render() {
    console.log('[SmartRead AI] Rendering, state:', {
      toolbarVisible: this.state.toolbarVisible,
      resultVisible: this.state.resultVisible,
    })
    
    this.root.render(
      <>
        {this.state.toolbarVisible && (
          <SelectionToolbar
            position={this.state.toolbarPosition}
            selectedText={this.state.selectedText}
            onAction={this.handleToolbarAction}
            onClose={this.handleCloseToolbar}
            loading={this.state.toolbarLoading}
            loadingAction={this.state.toolbarLoadingAction}
          />
        )}

        {this.state.resultVisible && (
          <ResultCard
            type={this.state.resultData?.type || 'simplify'}
            originalText={this.state.selectedText}
            result={this.state.resultData?.result || ''}
            loading={this.state.resultLoading}
            position={this.state.resultPosition}
            onClose={this.handleCloseResult}
            onCopy={this.handleCopyResult}
            onSave={this.handleSaveResult}
            metadata={this.state.resultData?.metadata}
            error={this.state.resultError}
          />
        )}
      </>
    )
    
    console.log('[SmartRead AI] Render complete')
  }

  public destroy() {
    document.removeEventListener('mouseup', this.handleSelection)
    this.root.unmount()
  }
}

// 初始化应用
let app: SmartReadAI | null = null

console.log('[SmartRead AI] Starting initialization...')

if (document.readyState === 'loading') {
  console.log('[SmartRead AI] Document still loading, waiting for DOMContentLoaded')
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[SmartRead AI] DOMContentLoaded fired')
    app = new SmartReadAI()
  })
} else {
  console.log('[SmartRead AI] Document already loaded, initializing immediately')
  app = new SmartReadAI()
}

// 清理
window.addEventListener('beforeunload', () => {
  if (app) {
    app.destroy()
  }
})

