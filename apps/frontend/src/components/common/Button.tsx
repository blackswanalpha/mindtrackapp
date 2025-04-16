'use client';

import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  href,
  icon,
  fullWidth = false,
  rounded = false
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    light: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700'
  };
  
  // Size styles
  const sizeClasses = {
    small: 'px-2.5 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  // Common classes
  const commonClasses = `
    inline-flex items-center justify-center
    font-medium
    border border-transparent
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;
  
  // Loading spinner
  const loadingSpinner = (
    <svg
      className={`animate-spin -ml-1 mr-2 h-4 w-4 ${
        variant === 'light' ? 'text-gray-800' : 'text-white'
      }`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
  
  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        {icon && <span className="mr-2">{icon}</span>}
        {loading && loadingSpinner}
        {children}
      </Link>
    );
  }
  
  // Render as button
  return (
    <button
      type={type}
      className={commonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {loading && loadingSpinner}
      {children}
    </button>
  );
};

export default Button;
