'use client';

import React from 'react';

type CheckboxProps = {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  label?: string;
  helpText?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  required = false,
  className = '',
  error,
  label,
  helpText
}) => {
  // Generate unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            h-4 w-4 rounded
            text-blue-600
            focus:ring-blue-500
            border-gray-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${checkboxId}-error` : helpText ? `${checkboxId}-description` : undefined}
        />
      </div>
      
      <div className="ml-3 text-sm">
        {/* Label */}
        {label && (
          <label
            htmlFor={checkboxId}
            className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Help text */}
        {helpText && !error && (
          <p
            id={`${checkboxId}-description`}
            className="text-gray-500"
          >
            {helpText}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p
            id={`${checkboxId}-error`}
            className="text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
