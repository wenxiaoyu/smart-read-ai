import React from 'react'
import './ProgressBar.css'

export interface ProgressBarProps {
  value: number // 0-100
  max?: number
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  label?: string
  animated?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'medium',
  variant = 'default',
  showLabel = false,
  label,
  animated = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const getVariantClass = () => {
    if (variant !== 'default') return variant
    
    // 自动根据百分比选择颜色
    if (percentage >= 90) return 'danger'
    if (percentage >= 70) return 'warning'
    return 'success'
  }

  return (
    <div className={`smartread-progress-wrapper ${className}`}>
      {(showLabel || label) && (
        <div className="smartread-progress-header">
          {label && <span className="smartread-progress-label">{label}</span>}
          {showLabel && <span className="smartread-progress-percentage">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      
      <div className={`smartread-progress-bar smartread-progress-${size}`}>
        <div
          className={`smartread-progress-fill smartread-progress-${getVariantClass()} ${
            animated ? 'smartread-progress-animated' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
