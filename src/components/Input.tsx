import React, { forwardRef } from 'react'
import './Input.css'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      suffix,
      size = 'medium',
      variant = 'default',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`smartread-input-wrapper ${className}`}>
        {label && <label className="smartread-input-label">{label}</label>}
        
        <div
          className={`smartread-input-container smartread-input-${size} smartread-input-${variant} ${
            error ? 'smartread-input-error' : ''
          } ${disabled ? 'smartread-input-disabled' : ''}`}
        >
          {icon && <span className="smartread-input-icon">{icon}</span>}
          
          <input
            ref={ref}
            className="smartread-input-field"
            disabled={disabled}
            {...props}
          />
          
          {suffix && <span className="smartread-input-suffix">{suffix}</span>}
        </div>
        
        {error && <p className="smartread-input-error-text">{error}</p>}
        {!error && hint && <p className="smartread-input-hint">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
