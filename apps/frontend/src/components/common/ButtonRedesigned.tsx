'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'outline' 
  | 'ghost' 
  | 'link' 
  | 'destructive';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
};

const ButtonRedesigned: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  href,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  elevation = 'sm',
  animate = true,
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-transparent',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 border-transparent',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 border-transparent',
    outline: 'bg-transparent text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-500 border-neutral-300',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-500 border-transparent',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500 border-transparent p-0',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
  };
  
  // Size styles
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  };
  
  // Elevation styles
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm hover:shadow',
    md: 'shadow hover:shadow-md',
    lg: 'shadow-md hover:shadow-lg',
  };
  
  // Common classes
  const commonClasses = `
    inline-flex items-center justify-center
    font-medium
    border
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200
    ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${fullWidth ? 'w-full' : ''}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${elevationClasses[elevation]}
    ${className}
  `;
  
  // Loading spinner
  const loadingSpinner = (
    <svg
      className={`animate-spin -ml-1 mr-2 h-4 w-4 ${
        variant === 'outline' || variant === 'ghost' || variant === 'link' 
          ? 'text-neutral-800' 
          : 'text-white'
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
  
  // Content with icon
  const content = (
    <>
      {loading && loadingSpinner}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2 inline-flex">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex">{icon}</span>
      )}
    </>
  );
  
  // Animation variants
  const buttonVariants = {
    hover: { 
      scale: disabled || loading ? 1 : 1.02,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: disabled || loading ? 1 : 0.98,
      transition: { duration: 0.1 }
    }
  };
  
  // Render as link if href is provided
  if (href) {
    return animate ? (
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        className="inline-block"
      >
        <Link href={href} className={commonClasses}>
          {content}
        </Link>
      </motion.div>
    ) : (
      <Link href={href} className={commonClasses}>
        {content}
      </Link>
    );
  }
  
  // Render as button
  return animate ? (
    <motion.button
      type={type}
      className={commonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
    >
      {content}
    </motion.button>
  ) : (
    <button
      type={type}
      className={commonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default ButtonRedesigned;
