import React, { forwardRef } from 'react'
import './Switch.css'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  description?: string
  size?: 'small' | 'medium' | 'large'
  labelPosition?: 'left' | 'right'
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = 'medium',
      labelPosition = 'right',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`smartread-switch-wrapper ${className}`}>
        <label
          className={`smartread-switch-label smartread-switch-label-${labelPosition} ${
            disabled ? 'smartread-switch-disabled' : ''
          }`}
        >
          {labelPosition === 'left' && label && (
            <div className="smartread-switch-text-wrapper">
              <span className="smartread-switch-text">{label}</span>
              {description && <span className="smartread-switch-description">{description}</span>}
            </div>
          )}
          
          <div className={`smartread-switch-container smartread-switch-${size}`}>
            <input
              ref={ref}
              type="checkbox"
              className="smartread-switch-input"
              disabled={disabled}
              {...props}
            />
            <span className="smartread-switch-slider"></span>
          </div>
          
          {labelPosition === 'right' && label && (
            <div className="smartread-switch-text-wrapper">
              <span className="smartread-switch-text">{label}</span>
              {description && <span className="smartread-switch-description">{description}</span>}
            </div>
          )}
        </label>
      </div>
    )
  }
)

Switch.displayName = 'Switch'
