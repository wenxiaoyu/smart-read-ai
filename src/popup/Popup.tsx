import './popup.css'
import { Button } from '../components'

function Popup() {
  // const [searchQuery, setSearchQuery] = useState('')
  // const [searchResults, setSearchResults] = useState<typeof mockKnowledgeNodes>([])
  // const [tokenUsage, setTokenUsage] = useState(mockTokenUsage)
  // const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  // useEffect(() => {
  //   // 加载主题设置
  //   chrome.storage.local.get(['theme'], (result) => {
  //     if (result.theme && typeof result.theme === 'string') {
  //       setTheme(result.theme as 'light' | 'dark' | 'auto')
  //     }
  //   })

  //   // 加载 Token 使用情况
  //   setTokenUsage(mockTokenUsage)
  // }, [])

  // // 搜索知识节点
  // const handleSearch = (query: string) => {
  //   setSearchQuery(query)

  //   if (query.trim().length < 2) {
  //     setSearchResults([])
  //     return
  //   }

  //   // Mock 搜索
  //   const results = mockKnowledgeNodes.filter(node =>
  //     node.content.toLowerCase().includes(query.toLowerCase()) ||
  //     (node.explanation && node.explanation.toLowerCase().includes(query.toLowerCase())) ||
  //     node.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  //   )

  //   setSearchResults(results)
  // }

  // // 切换主题
  // const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
  //   setTheme(newTheme)
  //   chrome.storage.local.set({ theme: newTheme })
  // }

  // 打开设置页
  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  // // 计算 Token 使用百分比
  // const tokenPercentage = tokenUsage.percentage
  // const todayUsed = tokenUsage.history
  //   .filter(h => Date.now() - h.timestamp < 86400000)
  //   .reduce((sum, h) => sum + h.tokens, 0)
  // const monthUsed = tokenUsage.totalTokens

  return (
    <div className="smartread-popup">
      {/* 头部 */}
      <div className="popup-header">
        <div className="popup-logo">
          <span className="logo-icon">📖</span>
          <span className="logo-text">智阅 AI</span>
        </div>
        <Button
          variant="ghost"
          size="small"
          icon="⚙️"
          onClick={handleOpenOptions}
          className="settings-btn-component"
        >
          设置
        </Button>
      </div>

      {/* 使用说明 */}
      <div className="usage-guide-section">
        <div className="guide-header">
          <span className="guide-icon">📚</span>
          <h2 className="guide-title">使用说明</h2>
        </div>

        <div className="guide-content">
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-text">
              <h3>配置 API 密钥</h3>
              <p>点击右上角&ldquo;设置&rdquo;按钮，在 AI 配置页面添加您的 API 密钥</p>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-text">
              <h3>选中文本</h3>
              <p>在任意网页上选中您想要简化或解释的文本</p>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-text">
              <h3>使用功能</h3>
              <p>点击工具栏中的&ldquo;简化&rdquo;或&ldquo;解释&rdquo;按钮，查看 AI 生成的结果</p>
            </div>
          </div>
        </div>

        <div className="guide-features">
          <h3 className="features-title">✨ 核心功能</h3>
          <ul className="features-list">
            <li>
              💡 <strong>文本简化</strong>：将复杂文本转换为易懂的表达
            </li>
            <li>
              📖 <strong>术语解释</strong>：对专业术语进行详细解释
            </li>
            <li>
              📋 <strong>快速复制</strong>：一键复制选中文本或结果
            </li>
          </ul>
        </div>

        <div className="guide-providers">
          <h3 className="providers-title">🤖 支持的 AI 服务</h3>
          <div className="providers-list">
            <div className="provider-item">
              <span className="provider-icon">⚫</span>
              <span className="provider-name">OpenAI GPT-4</span>
            </div>
            <div className="provider-item">
              <span className="provider-icon">🟤</span>
              <span className="provider-name">Anthropic Claude</span>
            </div>
            <div className="provider-item">
              <span className="provider-icon">🌙</span>
              <span className="provider-name">Moonshot (Kimi)</span>
            </div>
          </div>
        </div>

        <div className="guide-notice">
          <div className="notice-icon">💡</div>
          <div className="notice-content">
            <strong>提示：</strong>首次使用前，请先在设置页面配置至少一个 AI 服务商的 API 密钥。
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="popup-footer">
        <span className="footer-text">智阅 AI v0.1.1</span>
        <span className="footer-separator">•</span>
        <a href="#" className="footer-link" onClick={handleOpenOptions}>
          完整设置
        </a>
      </div>
    </div>
  )
}

export default Popup
