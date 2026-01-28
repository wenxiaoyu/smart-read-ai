import React, { forwardRef } from 'react'
import './Select.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      size = 'medium',
      variant = 'default',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`smartread-select-wrapper ${className}`}>
        {label && <label className="smartread-select-label">{label}</label>}
        
        <div
          className={`smartread-select-container smartread-select-${size} smartread-select-${variant} ${
            error ? 'smartread-select-error' : ''
          } ${disabled ? 'smartread-select-disabled' : ''}`}
        >
          <select
            ref={ref}
            className="smartread-select-field"
            disabled={disabled}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <span className="smartread-select-arrow">▼</span>
        </div>
        
        {error && <p className="smartread-select-error-text">{error}</p>}
        {!error && hint && <p className="smartread-select-hint">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
