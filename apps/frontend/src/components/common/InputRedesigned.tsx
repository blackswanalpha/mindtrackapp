'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type InputVariant = 'default' | 'filled' | 'outlined' | 'underlined';
type InputSize = 'sm' | 'md' | 'lg';

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
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  animated?: boolean;
  successMessage?: string;
  isSuccess?: boolean;
};

const InputRedesigned: React.FC<InputProps> = ({
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
  autoComplete,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  animated = true,
  successMessage,
  isSuccess = false,
}) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // State for focus
  const [isFocused, setIsFocused] = useState(false);
  
  // Variant styles
  const variantClasses = {
    default: `
      bg-white border border-neutral-300 
      focus:border-primary-500 focus:ring-primary-500
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
      ${isSuccess ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}
    `,
    filled: `
      bg-neutral-100 border border-transparent 
      focus:bg-white focus:border-primary-500 focus:ring-primary-500
      ${error ? 'bg-red-50 focus:border-red-500 focus:ring-red-500' : ''}
      ${isSuccess ? 'bg-green-50 focus:border-green-500 focus:ring-green-500' : ''}
    `,
    outlined: `
      bg-transparent border border-neutral-300 
      focus:border-primary-500 focus:ring-primary-500
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
      ${isSuccess ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}
    `,
    underlined: `
      bg-transparent border-b border-neutral-300 rounded-none px-0
      focus:border-primary-500 focus:ring-0
      ${error ? 'border-red-300 focus:border-red-500' : ''}
      ${isSuccess ? 'border-green-300 focus:border-green-500' : ''}
    `,
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  // Label size styles
  const labelSizeClasses = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-1.5',
    lg: 'text-base mb-2',
  };
  
  // Animation variants for label
  const labelVariants = {
    focused: { 
      y: 0,
      scale: 0.85,
      color: error ? '#ef4444' : isSuccess ? '#10b981' : '#6366f1',
      transition: { duration: 0.2 }
    },
    blurred: { 
      y: value ? 0 : 24,
      scale: value ? 0.85 : 1,
      color: value ? '#64748b' : '#94a3b8',
      transition: { duration: 0.2 }
    }
  };
  
  // Handle focus events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
      <div className="relative">
        {/* Animated floating label */}
        {label && animated && (
          <motion.label
            htmlFor={inputId}
            className="absolute left-4 origin-top-left pointer-events-none text-neutral-400 font-medium"
            initial="blurred"
            animate={isFocused || value ? 'focused' : 'blurred'}
            variants={labelVariants}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
        
        {/* Static label */}
        {label && !animated && (
          <label
            htmlFor={inputId}
            className={`block font-medium text-neutral-700 ${labelSizeClasses[size]}`}
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
            placeholder={animated ? (isFocused ? placeholder : '') : placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              block rounded-md shadow-sm
              focus:outline-none focus:ring-2
              disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
              transition-all duration-200
              ${variantClasses[variant]}
              ${sizeClasses[size]}
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${animated && label ? 'pt-6' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error 
                ? `${inputId}-error` 
                : isSuccess && successMessage 
                  ? `${inputId}-success` 
                  : helpText 
                    ? `${inputId}-description` 
                    : undefined
            }
          />
          
          {/* Icon */}
          {icon && (
            <div
              className={`absolute inset-y-0 ${
                iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
              } flex items-center pointer-events-none text-neutral-500`}
              onClick={onIconClick ? () => onIconClick() : undefined}
              style={{ pointerEvents: onIconClick ? 'auto' : 'none' }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-600 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1.5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {/* Success message */}
      {isSuccess && successMessage && !error && (
        <p
          id={`${inputId}-success`}
          className="mt-1.5 text-sm text-green-600 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1.5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          {successMessage}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && !isSuccess && (
        <p
          id={`${inputId}-description`}
          className="mt-1.5 text-sm text-neutral-500"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default InputRedesigned;
