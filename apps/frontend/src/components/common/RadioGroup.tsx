'use client';

import React from 'react';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type RadioGroupProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  label?: string;
  helpText?: string;
  inline?: boolean;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  className = '',
  error,
  label,
  helpText,
  inline = false
}) => {
  // Generate unique ID for the group
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`w-full ${className}`}>
      {/* Group label */}
      {label && (
        <div className="text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      {/* Radio options */}
      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        className={`${inline ? 'flex flex-wrap gap-4' : 'space-y-2'}`}
      >
        {options.map((option, index) => {
          const optionId = `${name}-${option.value}`;
          const isChecked = value === option.value;
          const isDisabled = disabled || option.disabled;
          
          return (
            <div key={option.value} className={`flex items-center ${inline ? '' : 'block'}`}>
              <input
                id={optionId}
                name={name}
                type="radio"
                value={option.value}
                checked={isChecked}
                onChange={onChange}
                disabled={isDisabled}
                required={required && index === 0}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${groupId}-error` : helpText ? `${groupId}-description` : undefined}
              />
              <label
                htmlFor={optionId}
                className={`ml-2 block text-sm ${
                  isDisabled ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      
      {/* Error message */}
      {error && (
        <p
          id={`${groupId}-error`}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p
          id={`${groupId}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;
