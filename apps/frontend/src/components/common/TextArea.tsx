'use client';

import React from 'react';

type TextAreaProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  label?: string;
  helpText?: string;
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
};

const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  error,
  label,
  helpText,
  rows = 4,
  maxLength,
  autoComplete,
  resize = 'vertical'
}) => {
  // Generate unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* TextArea */}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        autoComplete={autoComplete}
        style={{ resize }}
        className={`
          block w-full rounded-md shadow-sm
          focus:border-blue-500 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helpText ? `${textareaId}-description` : undefined}
      />
      
      {/* Character count */}
      {maxLength && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p
          id={`${textareaId}-error`}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p
          id={`${textareaId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default TextArea;
