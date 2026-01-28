import React, { useEffect, useState } from 'react'
import './Toast.css'

export interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number // 毫秒，0 表示不自动关闭
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  onClose?: () => void
  closable?: boolean
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'top-center',
  onClose,
  closable = true,
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300) // 等待动画完成
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠'
      case 'error':
        return '✕'
      default:
        return 'ℹ'
    }
  }

  if (!visible) return null

  return (
    <div className={`smartread-toast smartread-toast-${type} smartread-toast-${position} ${visible ? 'smartread-toast-visible' : ''}`}>
      <div className="smartread-toast-content">
        <span className="smartread-toast-icon">{getIcon()}</span>
        <span className="smartread-toast-message">{message}</span>
        {closable && (
          <button className="smartread-toast-close" onClick={handleClose}>
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// Toast 容器组件，用于管理多个 Toast
export interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="smartread-toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

// Toast Hook - 用于在应用中方便地显示 Toast
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = (props: ToastProps) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { ...props, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast,
    ToastContainer: () => <ToastContainer toasts={toasts} onRemove={removeToast} />,
  }
}
