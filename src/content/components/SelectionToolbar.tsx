import React, { useRef } from 'react'
import './SelectionToolbar.css'

export interface SelectionToolbarProps {
  position: { x: number; y: number }
  selectedText: string
  onAction: (action: 'simplify' | 'explain' | 'copy') => void
  onClose: () => void
  loading?: boolean
  loadingAction?: 'simplify' | 'explain' | 'copy' | null
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  position,
  onAction,
  loading = false,
  loadingAction = null,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null)

  // 移除自动隐藏逻辑，改为手动控制
  // 用户可以通过以下方式关闭工具栏：
  // 1. 点击按钮执行操作
  // 2. 选中新的文本
  // 3. 点击页面其他地方

  const handleButtonClick = (action: 'simplify' | 'explain' | 'copy', event: React.MouseEvent) => {
    // 如果正在加载，禁止点击
    if (loading) {
      event.stopPropagation()
      return
    }
    
    // 阻止事件冒泡，避免触发外部点击关闭
    event.stopPropagation()
    console.log('[Toolbar] Button clicked:', action)
    onAction(action)
    // 点击后不关闭工具栏，让用户可以继续操作
  }

  const isButtonLoading = (action: 'simplify' | 'explain' | 'copy') => {
    return loading && loadingAction === action
  }

  return (
    <div
      ref={toolbarRef}
      className="smartread-toolbar-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 60}px`, // 工具栏在选中文本上方
      }}
    >
      <div className="smartread-toolbar-content">
        <button
          className="smartread-toolbar-button"
          onClick={(e) => handleButtonClick('simplify', e)}
          title="简化文本"
          disabled={loading}
          style={{
            opacity: loading && loadingAction !== 'simplify' ? 0.5 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {isButtonLoading('simplify') ? (
            <span className="smartread-toolbar-spinner">⏳</span>
          ) : (
            <span className="smartread-toolbar-icon">💡</span>
          )}
          <span className="smartread-toolbar-text">简化</span>
        </button>

        <button
          className="smartread-toolbar-button"
          onClick={(e) => handleButtonClick('explain', e)}
          title="解释术语"
          disabled={loading}
          style={{
            opacity: loading && loadingAction !== 'explain' ? 0.5 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {isButtonLoading('explain') ? (
            <span className="smartread-toolbar-spinner">⏳</span>
          ) : (
            <span className="smartread-toolbar-icon">📖</span>
          )}
          <span className="smartread-toolbar-text">解释</span>
        </button>

        <button
          className="smartread-toolbar-button"
          onClick={(e) => handleButtonClick('copy', e)}
          title="复制文本"
          disabled={loading}
          style={{
            opacity: loading && loadingAction !== 'copy' ? 0.5 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {isButtonLoading('copy') ? (
            <span className="smartread-toolbar-spinner">⏳</span>
          ) : (
            <span className="smartread-toolbar-icon">📋</span>
          )}
          <span className="smartread-toolbar-text">复制</span>
        </button>
      </div>

      {/* 小三角指示器 */}
      <div className="smartread-toolbar-arrow"></div>
    </div>
  )
}
