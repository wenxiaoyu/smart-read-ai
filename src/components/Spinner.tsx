import React from 'react'
import './Spinner.css'

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'primary' | 'white'
  label?: string
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'default',
  label,
  className = '',
}) => {
  return (
    <div className={`smartread-spinner-wrapper ${className}`}>
      <div className={`smartread-spinner smartread-spinner-${size} smartread-spinner-${variant}`}>
        <div className="smartread-spinner-circle"></div>
      </div>
      {label && <span className="smartread-spinner-label">{label}</span>}
    </div>
  )
}
