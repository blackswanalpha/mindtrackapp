'use client';

import React from 'react';
import { motion } from 'framer-motion';

type BadgeVariant = 'default' | 'outline' | 'subtle' | 'dot';
type BadgeColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type BadgeShape = 'rounded' | 'pill';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  animated?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  count?: number;
  maxCount?: number;
};

const BadgeRedesigned: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color = 'primary',
  size = 'md',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  className = '',
  animated = false,
  onClick,
  removable = false,
  onRemove,
  count,
  maxCount = 99,
}) => {
  // Color styles
  const colorClasses = {
    primary: {
      default: 'bg-primary-600 text-white',
      outline: 'border border-primary-600 text-primary-600',
      subtle: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-primary-600',
    },
    secondary: {
      default: 'bg-secondary-600 text-white',
      outline: 'border border-secondary-600 text-secondary-600',
      subtle: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-secondary-600',
    },
    accent: {
      default: 'bg-accent-600 text-white',
      outline: 'border border-accent-600 text-accent-600',
      subtle: 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-accent-600',
    },
    success: {
      default: 'bg-green-600 text-white',
      outline: 'border border-green-600 text-green-600',
      subtle: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-green-600',
    },
    warning: {
      default: 'bg-amber-500 text-white',
      outline: 'border border-amber-500 text-amber-600',
      subtle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-amber-500',
    },
    error: {
      default: 'bg-red-600 text-white',
      outline: 'border border-red-600 text-red-600',
      subtle: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-red-600',
    },
    info: {
      default: 'bg-blue-600 text-white',
      outline: 'border border-blue-600 text-blue-600',
      subtle: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-blue-600',
    },
    neutral: {
      default: 'bg-neutral-600 text-white',
      outline: 'border border-neutral-600 text-neutral-600',
      subtle: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200',
      dot: 'text-neutral-700 dark:text-neutral-300',
      dotColor: 'bg-neutral-600',
    },
  };
  
  // Size styles
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };
  
  // Shape styles
  const shapeClasses = {
    rounded: 'rounded',
    pill: 'rounded-full',
  };
  
  // Dot size based on badge size
  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };
  
  // Animation variants
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  // Format count with max limit
  const formattedCount = count !== undefined 
    ? count > maxCount 
      ? `${maxCount}+` 
      : count.toString()
    : null;
  
  // Determine content based on variant
  const content = (
    <>
      {variant === 'dot' && (
        <span className={`inline-block ${dotSizeClasses[size]} ${colorClasses[color].dotColor} rounded-full mr-1.5`} />
      )}
      
      {icon && iconPosition === 'left' && (
        <span className="mr-1 flex-shrink-0">{icon}</span>
      )}
      
      {formattedCount !== null ? formattedCount : children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-1 flex-shrink-0">{icon}</span>
      )}
      
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1.5 flex-shrink-0 hover:opacity-80 focus:outline-none"
          aria-label="Remove"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </>
  );
  
  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center font-medium
    ${sizeClasses[size]}
    ${shapeClasses[shape]}
    ${colorClasses[color][variant]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;
  
  // Render with or without animation
  return animated ? (
    <motion.span
      className={baseClasses}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={onClick ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      variants={badgeVariants}
      onClick={onClick}
    >
      {content}
    </motion.span>
  ) : (
    <span
      className={baseClasses}
      onClick={onClick}
    >
      {content}
    </span>
  );
};

export default BadgeRedesigned;
