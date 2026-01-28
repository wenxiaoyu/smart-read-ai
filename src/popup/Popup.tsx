import { useState, useEffect } from 'react'
import './popup.css'
import { mockKnowledgeNodes, mockTokenUsage } from '../mock/knowledge-data'
import { Input, Button, ProgressBar } from '../components'

function Popup() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof mockKnowledgeNodes>([])
  const [tokenUsage, setTokenUsage] = useState(mockTokenUsage)
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  useEffect(() => {
    // 加载主题设置
    chrome.storage.local.get(['theme'], (result) => {
      if (result.theme && typeof result.theme === 'string') {
        setTheme(result.theme as 'light' | 'dark' | 'auto')
      }
    })

    // 加载 Token 使用情况
    setTokenUsage(mockTokenUsage)
  }, [])

  // 搜索知识节点
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    // Mock 搜索
    const results = mockKnowledgeNodes.filter(node =>
      node.content.toLowerCase().includes(query.toLowerCase()) ||
      (node.explanation && node.explanation.toLowerCase().includes(query.toLowerCase())) ||
      node.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    
    setSearchResults(results)
  }

  // 切换主题
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme)
    chrome.storage.local.set({ theme: newTheme })
  }

  // 打开设置页
  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  // 计算 Token 使用百分比
  const tokenPercentage = tokenUsage.percentage
  const todayUsed = tokenUsage.history
    .filter(h => Date.now() - h.timestamp < 86400000)
    .reduce((sum, h) => sum + h.tokens, 0)
  const monthUsed = tokenUsage.totalTokens

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

      {/* 搜索框 */}
      <div className="search-section">
        <Input
          icon="🔍"
          placeholder="搜索知识库...（即将推出）"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          disabled
          suffix={
            searchQuery ? (
              <button 
                className="clear-btn"
                onClick={() => handleSearch('')}
                style={{ all: 'unset', cursor: 'pointer' }}
              >
                ×
              </button>
            ) : undefined
          }
          className="search-input-component"
        />

        <div className="coming-soon-notice">
          <span className="notice-icon">🚀</span>
          <span className="notice-text">知识库功能即将在 v0.2.0 推出</span>
        </div>

        {/* 搜索结果 */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((node) => (
              <div key={node.id} className="search-result-item">
                <div className="result-type">{node.type === 'term' ? '📖' : '💡'}</div>
                <div className="result-content">
                  <div className="result-title">{node.content}</div>
                  <div className="result-excerpt">
                    {node.explanation ? node.explanation.substring(0, 60) + '...' : '无说明'}
                  </div>
                  <div className="result-tags">
                    {node.tags.map((tag, index) => (
                      <span key={index} className="result-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>未找到相关知识</p>
          </div>
        )}
      </div>

      {/* Token 使用统计 */}
      <div className="token-section">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <span className="section-title">Token 使用情况</span>
          <span className="demo-badge">演示数据</span>
        </div>
        
        <div className="token-stats">
          <div className="token-numbers">
            <span className="token-used">{tokenUsage.totalTokens.toLocaleString()}</span>
            <span className="token-separator">/</span>
            <span className="token-limit">{tokenUsage.budget.toLocaleString()}</span>
          </div>
          <div className="token-percentage">{tokenPercentage.toFixed(1)}%</div>
        </div>

        <ProgressBar
          value={tokenUsage.totalTokens}
          max={tokenUsage.budget}
          size="medium"
          animated
          className="token-progress-component"
        />

        <div className="token-details">
          <div className="token-detail-item">
            <span className="detail-label">今日使用</span>
            <span className="detail-value">{todayUsed.toLocaleString()}</span>
          </div>
          <div className="token-detail-item">
            <span className="detail-label">本月使用</span>
            <span className="detail-value">{monthUsed.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 快速设置 */}
      <div className="quick-settings">
        <div className="section-header">
          <span className="section-icon">⚡</span>
          <span className="section-title">快速设置</span>
        </div>

        <div className="theme-selector">
          <Button
            variant={theme === 'light' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleThemeChange('light')}
          >
            ☀️ 浅色
          </Button>
          <Button
            variant={theme === 'dark' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleThemeChange('dark')}
          >
            🌙 暗黑
          </Button>
          <Button
            variant={theme === 'auto' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => handleThemeChange('auto')}
          >
            🔄 自动
          </Button>
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
