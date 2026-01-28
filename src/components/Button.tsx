import React from 'react'
import './Button.css'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }

  return (
    <button
      type={type}
      className={`smartread-button smartread-button-${variant} smartread-button-${size} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && <span className="smartread-button-spinner">⏳</span>}
      {!loading && icon && <span className="smartread-button-icon">{icon}</span>}
      <span className="smartread-button-text">{children}</span>
    </button>
  )
}
