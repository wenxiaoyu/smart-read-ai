import { useState, useEffect } from 'react'
import './options.css'
import { Button, Input, Select, Switch, useToast } from '../components'
import { APIKeyManager } from '../services/api-key-manager'
import { CloudProvider } from '../services/types'

interface Settings {
  // 简化功能 API 密钥
  simplifyApiKeys: {
    gpt4?: string
    claude?: string
    wenxin?: string
    moonshot?: string
  }
  defaultSimplifyProvider?: CloudProvider
  
  // 界面设置
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  
  // 功能设置
  enableAutoTranslate: boolean
  enableKnowledgeBase: boolean
  maxTokensPerRequest: number
}

function Options() {
  const [settings, setSettings] = useState<Settings>({
    simplifyApiKeys: {},
    defaultSimplifyProvider: undefined,
    theme: 'auto',
    language: 'zh-CN',
    enableAutoTranslate: true,
    enableKnowledgeBase: true,
    maxTokensPerRequest: 2000,
  })
  
  const [saved, setSaved] = useState(false)
  const [showSimplifyKeys, setShowSimplifyKeys] = useState({
    gpt4: false,
    claude: false,
    wenxin: false,
    moonshot: false,
  })
  const [activeTab, setActiveTab] = useState<'simplify' | 'interface' | 'data'>('simplify')
  const { showToast, ToastContainer } = useToast()
  const [apiKeyManager] = useState(() => new APIKeyManager())

  useEffect(() => {
    // 加载设置
    const loadSettings = async () => {
      chrome.storage.local.get(['settings'], async (result) => {
        if (result.settings) {
          setSettings({ ...settings, ...result.settings })
        }
        
        // 加载简化功能的 API 密钥
        try {
          const providers = await apiKeyManager.getProviders()
          const simplifyApiKeys: Settings['simplifyApiKeys'] = {}
          let defaultProvider: CloudProvider | undefined
          
          for (const { provider, isDefault } of providers) {
            // 获取密钥并只显示最后 4 位
            const key = await apiKeyManager.getKey(provider)
            if (key) {
              simplifyApiKeys[provider] = '••••' + key.slice(-4)
            }
            if (isDefault) {
              defaultProvider = provider
            }
          }
          
          setSettings(prev => ({
            ...prev,
            simplifyApiKeys,
            defaultSimplifyProvider: defaultProvider,
          }))
        } catch (error) {
          console.error('Failed to load API keys:', error)
        }
      })
    }
    
    loadSettings()
  }, [])

  const handleSave = async () => {
    // 保存基础设置
    chrome.storage.local.set({ settings }, () => {
      setSaved(true)
      showToast({ message: '设置已保存', type: 'success', duration: 2000 })
      setTimeout(() => setSaved(false), 2000)
    })
    
    // 保存简化功能 API 密钥
    try {
      const { simplifyApiKeys, defaultSimplifyProvider } = settings
      
      // 保存每个 API 密钥（只保存实际输入的密钥，不保存掩码）
      for (const [provider, key] of Object.entries(simplifyApiKeys)) {
        if (key && !key.startsWith('••••')) {
          await apiKeyManager.saveKey({
            provider: provider as CloudProvider,
            apiKey: key,
            isDefault: provider === defaultSimplifyProvider,
          })
        }
      }
      
      showToast({ message: 'API 密钥已保存', type: 'success', duration: 2000 })
    } catch (error) {
      console.error('Failed to save API keys:', error)
      showToast({ message: 'API 密钥保存失败', type: 'error', duration: 2000 })
    }
  }

  const handleReset = async () => {
    const defaultSettings: Settings = {
      simplifyApiKeys: {},
      defaultSimplifyProvider: undefined,
      theme: 'auto',
      language: 'zh-CN',
      enableAutoTranslate: true,
      enableKnowledgeBase: true,
      maxTokensPerRequest: 2000,
    }
    setSettings(defaultSettings)
    chrome.storage.local.set({ settings: defaultSettings })
    
    // 清除所有 API 密钥
    try {
      const providers = await apiKeyManager.getProviders()
      for (const { provider } of providers) {
        await apiKeyManager.deleteKey(provider)
      }
    } catch (error) {
      console.error('Failed to clear API keys:', error)
    }
    
    showToast({ message: '已恢复默认设置', type: 'info', duration: 2000 })
  }

  const handleExportData = () => {
    chrome.storage.local.get(null, (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `smartread-ai-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast({ message: '数据导出成功', type: 'success', duration: 2000 })
    })
  }

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      chrome.storage.local.clear(() => {
        showToast({ message: '数据已清除', type: 'warning', duration: 2000 })
        handleReset()
      })
    }
  }

  return (
    <div className="smartread-options">
      {/* 头部 */}
      <header className="options-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">📖</span>
            <div>
              <h1 className="logo-title">智阅 AI 设置</h1>
              <p className="logo-subtitle">配置您的 AI 阅读助手</p>
            </div>
          </div>
          <div className="version-badge">v0.1.1</div>
        </div>
      </header>

      {/* 标签页导航 */}
      <nav className="tabs-nav">
        <Button
          variant="ghost"
          className={`tab-btn-component ${activeTab === 'simplify' ? 'active' : ''}`}
          onClick={() => setActiveTab('simplify')}
        >
          <span className="tab-icon">💡</span>
          <span>AI 配置</span>
        </Button>
        <Button
          variant="ghost"
          className={`tab-btn-component ${activeTab === 'interface' ? 'active' : ''}`}
          onClick={() => setActiveTab('interface')}
        >
          <span className="tab-icon">🎨</span>
          <span>界面设置</span>
        </Button>
        <Button
          variant="ghost"
          className={`tab-btn-component ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <span className="tab-icon">💾</span>
          <span>数据管理</span>
        </Button>
      </nav>

      {/* 主内容区 */}
      <main className="options-main">
        {/* AI 配置 */}
        {activeTab === 'simplify' && (
          <div className="tab-content">
            <section className="settings-section">
              <h2 className="section-title">AI 服务配置</h2>
              <p className="section-desc">配置用于文本简化的 AI 服务 API 密钥</p>

              <div className="simplify-api-config">
                {/* OpenAI GPT-4 */}
                <div className="api-key-item">
                  <div className="api-key-header">
                    <div className="api-key-info">
                      <span className="api-key-icon">⚫</span>
                      <div>
                        <div className="api-key-name">OpenAI GPT-4</div>
                        <div className="api-key-hint">支持 GPT-4 和 GPT-3.5 模型</div>
                      </div>
                    </div>
                    <label className="default-badge">
                      <input
                        type="radio"
                        name="defaultProvider"
                        value="gpt4"
                        checked={settings.defaultSimplifyProvider === 'gpt4'}
                        onChange={(e) => setSettings({ ...settings, defaultSimplifyProvider: e.target.value as CloudProvider })}
                      />
                      <span>默认</span>
                    </label>
                  </div>
                  <Input
                    type={showSimplifyKeys.gpt4 ? 'text' : 'password'}
                    placeholder="请输入 OpenAI API Key"
                    value={settings.simplifyApiKeys.gpt4 || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      simplifyApiKeys: { ...settings.simplifyApiKeys, gpt4: e.target.value }
                    })}
                    suffix={
                      <button
                        className="toggle-visibility-btn"
                        onClick={() => setShowSimplifyKeys({ ...showSimplifyKeys, gpt4: !showSimplifyKeys.gpt4 })}
                        style={{ all: 'unset', cursor: 'pointer', fontSize: '20px' }}
                      >
                        {showSimplifyKeys.gpt4 ? '🙈' : '👁️'}
                      </button>
                    }
                  />
                </div>

                {/* Anthropic Claude */}
                <div className="api-key-item">
                  <div className="api-key-header">
                    <div className="api-key-info">
                      <span className="api-key-icon">🟤</span>
                      <div>
                        <div className="api-key-name">Anthropic Claude</div>
                        <div className="api-key-hint">支持 Claude 3.5 Sonnet 等模型</div>
                      </div>
                    </div>
                    <label className="default-badge">
                      <input
                        type="radio"
                        name="defaultProvider"
                        value="claude"
                        checked={settings.defaultSimplifyProvider === 'claude'}
                        onChange={(e) => setSettings({ ...settings, defaultSimplifyProvider: e.target.value as CloudProvider })}
                      />
                      <span>默认</span>
                    </label>
                  </div>
                  <Input
                    type={showSimplifyKeys.claude ? 'text' : 'password'}
                    placeholder="请输入 Claude API Key"
                    value={settings.simplifyApiKeys.claude || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      simplifyApiKeys: { ...settings.simplifyApiKeys, claude: e.target.value }
                    })}
                    suffix={
                      <button
                        className="toggle-visibility-btn"
                        onClick={() => setShowSimplifyKeys({ ...showSimplifyKeys, claude: !showSimplifyKeys.claude })}
                        style={{ all: 'unset', cursor: 'pointer', fontSize: '20px' }}
                      >
                        {showSimplifyKeys.claude ? '🙈' : '👁️'}
                      </button>
                    }
                  />
                </div>

                {/* Moonshot (Kimi) */}
                <div className="api-key-item">
                  <div className="api-key-header">
                    <div className="api-key-info">
                      <span className="api-key-icon">🌙</span>
                      <div>
                        <div className="api-key-name">Moonshot (Kimi)</div>
                        <div className="api-key-hint">支持 moonshot-v1-8k/32k/128k 模型</div>
                      </div>
                    </div>
                    <label className="default-badge">
                      <input
                        type="radio"
                        name="defaultProvider"
                        value="moonshot"
                        checked={settings.defaultSimplifyProvider === 'moonshot'}
                        onChange={(e) => setSettings({ ...settings, defaultSimplifyProvider: e.target.value as CloudProvider })}
                      />
                      <span>默认</span>
                    </label>
                  </div>
                  <Input
                    type={showSimplifyKeys.moonshot ? 'text' : 'password'}
                    placeholder="请输入 Moonshot API Key"
                    value={settings.simplifyApiKeys.moonshot || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      simplifyApiKeys: { ...settings.simplifyApiKeys, moonshot: e.target.value }
                    })}
                    suffix={
                      <button
                        className="toggle-visibility-btn"
                        onClick={() => setShowSimplifyKeys({ ...showSimplifyKeys, moonshot: !showSimplifyKeys.moonshot })}
                        style={{ all: 'unset', cursor: 'pointer', fontSize: '20px' }}
                      >
                        {showSimplifyKeys.moonshot ? '🙈' : '👁️'}
                      </button>
                    }
                  />
                </div>

                {/* 百度文心一言 */}
                <div className="api-key-item">
                  <div className="api-key-header">
                    <div className="api-key-info">
                      <span className="api-key-icon">🔵</span>
                      <div>
                        <div className="api-key-name">百度文心一言</div>
                        <div className="api-key-hint">支持 ERNIE 系列模型（即将支持）</div>
                      </div>
                    </div>
                    <label className="default-badge">
                      <input
                        type="radio"
                        name="defaultProvider"
                        value="wenxin"
                        checked={settings.defaultSimplifyProvider === 'wenxin'}
                        onChange={(e) => setSettings({ ...settings, defaultSimplifyProvider: e.target.value as CloudProvider })}
                        disabled
                      />
                      <span>默认</span>
                    </label>
                  </div>
                  <Input
                    type={showSimplifyKeys.wenxin ? 'text' : 'password'}
                    placeholder="请输入文心一言 API Key（即将支持）"
                    value={settings.simplifyApiKeys.wenxin || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      simplifyApiKeys: { ...settings.simplifyApiKeys, wenxin: e.target.value }
                    })}
                    disabled
                    suffix={
                      <button
                        className="toggle-visibility-btn"
                        onClick={() => setShowSimplifyKeys({ ...showSimplifyKeys, wenxin: !showSimplifyKeys.wenxin })}
                        style={{ all: 'unset', cursor: 'pointer', fontSize: '20px' }}
                        disabled
                      >
                        {showSimplifyKeys.wenxin ? '🙈' : '👁️'}
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="api-key-notice">
                <div className="notice-icon">🔒</div>
                <div className="notice-content">
                  <div className="notice-title">安全提示</div>
                  <div className="notice-text">
                    API 密钥将使用 AES-256-GCM 加密存储在本地，不会上传到任何服务器。
                    请妥善保管您的 API 密钥，不要分享给他人。
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <h2 className="section-title">使用说明</h2>
              <div className="usage-guide">
                <div className="guide-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <div className="step-title">获取 API 密钥</div>
                    <div className="step-desc">
                      访问对应 AI 服务商的官网注册账号并获取 API 密钥：
                      <ul>
                        <li>OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com</a></li>
                        <li>Claude: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
                        <li>Moonshot: <a href="https://platform.moonshot.cn/console/api-keys" target="_blank" rel="noopener noreferrer">platform.moonshot.cn</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <div className="step-title">配置 API 密钥</div>
                    <div className="step-desc">
                      将获取的 API 密钥粘贴到上方对应的输入框中，并选择一个作为默认服务商。
                    </div>
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <div className="step-title">开始使用</div>
                    <div className="step-desc">
                      在任意网页上选中文本，点击工具栏中的"简化"按钮即可使用 AI 简化功能。
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 界面设置 */}
        {activeTab === 'interface' && (
          <div className="tab-content">
            <section className="settings-section">
              <h2 className="section-title">主题设置</h2>
              <p className="section-desc">选择您喜欢的界面主题</p>

              <div className="theme-grid">
                <label className={`theme-card ${settings.theme === 'light' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={settings.theme === 'light'}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                  />
                  <div className="theme-preview light-preview">
                    <div className="preview-header"></div>
                    <div className="preview-body"></div>
                  </div>
                  <div className="theme-name">☀️ 浅色模式</div>
                </label>

                <label className={`theme-card ${settings.theme === 'dark' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={settings.theme === 'dark'}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                  />
                  <div className="theme-preview dark-preview">
                    <div className="preview-header"></div>
                    <div className="preview-body"></div>
                  </div>
                  <div className="theme-name">🌙 暗黑模式</div>
                </label>

                <label className={`theme-card ${settings.theme === 'auto' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    checked={settings.theme === 'auto'}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                  />
                  <div className="theme-preview auto-preview">
                    <div className="preview-header"></div>
                    <div className="preview-body"></div>
                  </div>
                  <div className="theme-name">🔄 跟随系统</div>
                </label>
              </div>
            </section>

            <section className="settings-section">
              <h2 className="section-title">语言设置</h2>

              <Select
                options={[
                  { value: 'zh-CN', label: '简体中文' },
                  { value: 'en-US', label: 'English' }
                ]}
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value as any })}
              />
            </section>

            <section className="settings-section">
              <h2 className="section-title">功能开关</h2>

              <div className="setting-item">
                <Switch
                  label="启用自动翻译"
                  description="自动翻译选中的外语文本"
                  checked={settings.enableAutoTranslate}
                  onChange={(e) => setSettings({ ...settings, enableAutoTranslate: e.target.checked })}
                />
              </div>

              <div className="setting-item">
                <Switch
                  label="启用知识库"
                  description="保存和管理您的知识节点"
                  checked={settings.enableKnowledgeBase}
                  onChange={(e) => setSettings({ ...settings, enableKnowledgeBase: e.target.checked })}
                />
              </div>
            </section>
          </div>
        )}

        {/* 数据管理 */}
        {activeTab === 'data' && (
          <div className="tab-content">
            <section className="settings-section">
              <h2 className="section-title">数据导出</h2>
              <p className="section-desc">导出您的所有数据，包括设置和知识库</p>

              <Button 
                variant="secondary" 
                icon="📥" 
                onClick={handleExportData}
              >
                导出数据
              </Button>
            </section>

            <section className="settings-section danger-section">
              <h2 className="section-title">危险操作</h2>
              <p className="section-desc">以下操作不可恢复，请谨慎操作</p>

              <div className="danger-actions">
                <Button 
                  variant="danger" 
                  icon="🗑️" 
                  onClick={handleClearData}
                >
                  清除所有数据
                </Button>
                <Button 
                  variant="warning" 
                  icon="↩️" 
                  onClick={handleReset}
                >
                  恢复默认设置
                </Button>
              </div>
            </section>

            <section className="settings-section">
              <h2 className="section-title">关于</h2>
              <div className="about-info">
                <p><strong>智阅 AI</strong></p>
                <p>版本：v{chrome.runtime.getManifest().version}</p>
                <p>一个帮助您更好地阅读和理解技术文档的 AI 助手</p>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 底部操作栏 */}
      <footer className="options-footer">
        <Button 
          variant="primary" 
          size="large" 
          onClick={handleSave}
        >
          {saved ? '✓ 已保存' : '保存设置'}
        </Button>
      </footer>

      {/* Toast 通知容器 */}
      <ToastContainer />
    </div>
  )
}

export default Options
