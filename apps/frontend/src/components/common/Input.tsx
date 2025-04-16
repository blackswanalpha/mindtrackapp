'use client';

import React from 'react';

type InputProps = {
  id?: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  label?: string;
  helpText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autoComplete?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  error,
  label,
  helpText,
  icon,
  iconPosition = 'right',
  onIconClick,
  min,
  max,
  step,
  autoComplete
}) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Input */}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          className={`
            block w-full rounded-md shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-description` : undefined}
        />
        
        {/* Icon */}
        {icon && (
          <div
            className={`absolute inset-y-0 ${
              iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
            } flex items-center pointer-events-none`}
            onClick={onIconClick ? () => onIconClick() : undefined}
            style={{ pointerEvents: onIconClick ? 'auto' : 'none' }}
          >
            {icon}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p
          id={`${inputId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Input;
