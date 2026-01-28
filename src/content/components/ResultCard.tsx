import React, { useState, useRef, useEffect } from 'react'
import './ResultCard.css'
import { Spinner } from '../../components'

export interface ResultCardProps {
  type: 'simplify' | 'explain' | 'code' | 'formula'
  originalText: string
  result: string
  loading?: boolean
  position: { x: number; y: number }
  onClose: () => void
  onCopy: () => void
  onSave: () => void
  metadata?: {
    domain?: string
    confidence?: number
    processingTime?: number
    provider?: string
    keyTerms?: string[]
  }
  error?: string
}

export const ResultCard: React.FC<ResultCardProps> = ({
  type,
  originalText,
  result,
  loading = false,
  position,
  onClose,
  onCopy,
  // onSave, // 收藏功能将在后续版本推出
  metadata,
  error,
}) => {
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)
  // const [saved, setSaved] = useState(false) // 收藏功能将在后续版本推出
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // 智能定位：确保卡片不超出屏幕边界
  useEffect(() => {
    if (!cardRef.current) return

    const card = cardRef.current
    const cardRect = card.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let newX = position.x
    let newY = position.y + 20 // 默认在选中文本下方

    // 水平方向调整
    if (newX + cardRect.width / 2 > viewportWidth - 20) {
      // 右侧超出，向左调整
      newX = viewportWidth - cardRect.width / 2 - 20
    } else if (newX - cardRect.width / 2 < 20) {
      // 左侧超出，向右调整
      newX = cardRect.width / 2 + 20
    }

    // 垂直方向调整
    if (newY + cardRect.height > viewportHeight - 20) {
      // 下方超出，显示在选中文本上方
      newY = position.y - cardRect.height - 20
      
      // 如果上方也超出，则固定在顶部
      if (newY < 20) {
        newY = 20
      }
    }

    setAdjustedPosition({ x: newX, y: newY })
  }, [position, expanded])

  // 拖拽开始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 只允许在头部拖拽
    if (!(e.target as HTMLElement).closest('.smartread-result-header')) {
      return
    }
    
    // 不允许在按钮上拖拽
    if ((e.target as HTMLElement).closest('.smartread-result-action-btn')) {
      return
    }

    setIsDragging(true)
    const cardRect = cardRef.current!.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - cardRect.left - cardRect.width / 2,
      y: e.clientY - cardRect.top,
    })
    
    // 阻止文本选择
    e.preventDefault()
  }

  // 拖拽中
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      setAdjustedPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const getTitle = () => {
    switch (type) {
      case 'simplify':
        return 'AI 简化结果'
      case 'explain':
        return 'AI 术语解释'
      case 'code':
        return 'AI 代码解析'
      case 'formula':
        return 'AI 公式解析'
      default:
        return 'AI 解析结果'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'simplify':
        return '💡'
      case 'explain':
        return '📖'
      case 'code':
        return '💻'
      case 'formula':
        return '📐'
      default:
        return '🤖'
    }
  }

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 收藏功能将在后续版本推出
  // const handleSave = () => {
  //   onSave()
  //   setSaved(true)
  //   setTimeout(() => setSaved(false), 2000)
  // }

  // 高亮关键词
  const highlightKeyTerms = (text: string, keyTerms?: string[]) => {
    if (!keyTerms || keyTerms.length === 0) {
      return text
    }

    // 创建正则表达式，匹配所有关键词（不区分大小写）
    const pattern = keyTerms
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 转义特殊字符
      .join('|')
    
    const regex = new RegExp(`(${pattern})`, 'gi')
    
    // 分割文本并高亮关键词
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      // 检查是否是关键词（不区分大小写）
      const isKeyTerm = keyTerms.some(
        term => term.toLowerCase() === part.toLowerCase()
      )
      
      if (isKeyTerm) {
        return (
          <mark key={index} className="smartread-highlight-term">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  // 渲染带高亮的结果内容
  const renderResultContent = () => {
    const lines = result.split('\n')
    
    return lines.map((line, lineIndex) => (
      <p key={lineIndex}>
        {highlightKeyTerms(line, metadata?.keyTerms)}
      </p>
    ))
  }

  return (
    <div
      ref={cardRef}
      className={`smartread-result-card ${isDragging ? 'smartread-dragging' : ''}`}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="smartread-result-header"
        style={{ cursor: 'grab' }}
      >
        <span className="smartread-result-icon">{getIcon()}</span>
        <span className="smartread-result-title">{getTitle()}</span>
        <div className="smartread-result-actions">
          <button
            className="smartread-result-action-btn"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? '收起' : '展开'}
          >
            {expanded ? '−' : '+'}
          </button>
          <button className="smartread-result-action-btn" onClick={onClose} title="关闭">
            ×
          </button>
        </div>
      </div>

      {expanded && (
        <div className="smartread-result-body">
          {loading ? (
            <div className="smartread-result-loading">
              <Spinner size="medium" variant="primary" label="AI 正在分析中..." />
            </div>
          ) : error ? (
            <div className="smartread-result-error">
              <div className="smartread-error-icon">⚠️</div>
              <div className="smartread-error-message">{error}</div>
            </div>
          ) : (
            <>
              <div className="smartread-result-section">
                <div className="smartread-section-label">原文</div>
                <div className="smartread-section-content smartread-original">
                  {originalText}
                </div>
              </div>

              <div className="smartread-result-section">
                <div className="smartread-section-label">
                  {type === 'simplify' && '简化'}
                  {type === 'explain' && '解释'}
                  {type === 'code' && '解析'}
                  {type === 'formula' && '说明'}
                </div>
                <div className="smartread-section-content smartread-result">
                  {renderResultContent()}
                </div>
              </div>

              {/* 元数据显示 - 默认展开 */}
              {metadata && (metadata.domain || metadata.confidence !== undefined || metadata.processingTime !== undefined || metadata.provider) && (
                <div className="smartread-metadata-section">
                  <div className="smartread-metadata-title">分析信息</div>
                  <div className="smartread-metadata">
                    {metadata.domain && (
                      <div className="smartread-metadata-item">
                        <span className="smartread-metadata-label">领域</span>
                        <span className="smartread-metadata-value">{metadata.domain}</span>
                      </div>
                    )}
                    {metadata.confidence !== undefined && (
                      <div className="smartread-metadata-item">
                        <span className="smartread-metadata-label">置信度</span>
                        <span className="smartread-metadata-value">
                          {(metadata.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    {metadata.processingTime !== undefined && (
                      <div className="smartread-metadata-item">
                        <span className="smartread-metadata-label">处理时间</span>
                        <span className="smartread-metadata-value">
                          {(metadata.processingTime / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}
                    {metadata.provider && (
                      <div className="smartread-metadata-item">
                        <span className="smartread-metadata-label">AI 模型</span>
                        <span className="smartread-metadata-value">{metadata.provider}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="smartread-result-footer">
                <button className="smartread-footer-btn" onClick={handleCopy}>
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? '已复制' : '复制'}</span>
                </button>
                {/* 以下功能将在后续版本中推出 */}
                {/* <button className="smartread-footer-btn" onClick={handleSave}>
                  <span>{saved ? '✓' : '⭐'}</span>
                  <span>{saved ? '已收藏' : '收藏'}</span>
                </button>
                <button className="smartread-footer-btn">
                  <span>🔗</span>
                  <span>来源</span>
                </button> */}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
