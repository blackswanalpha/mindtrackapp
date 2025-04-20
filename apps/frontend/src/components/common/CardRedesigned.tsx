'use client';

import React from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'bordered' | 'elevated' | 'flat' | 'glass';
type CardSize = 'sm' | 'md' | 'lg';

type CardProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  headerAction?: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const CardRedesigned: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  headerAction,
  variant = 'default',
  size = 'md',
  interactive = false,
  hoverEffect = false,
  onClick,
  icon,
}) => {
  // Variant styles
  const variantClasses = {
    default: 'bg-white shadow-md',
    bordered: 'bg-white border border-neutral-200',
    elevated: 'bg-white shadow-lg',
    flat: 'bg-neutral-50',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-md',
  };
  
  // Size styles (padding)
  const sizeClasses = {
    sm: {
      header: 'px-4 py-3',
      body: 'px-4 py-3',
      footer: 'px-4 py-3',
    },
    md: {
      header: 'px-6 py-4',
      body: 'px-6 py-5',
      footer: 'px-6 py-4',
    },
    lg: {
      header: 'px-8 py-5',
      body: 'px-8 py-6',
      footer: 'px-8 py-5',
    },
  };
  
  // Interactive styles
  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-200' 
    : '';
  
  // Hover effect
  const hoverClasses = hoverEffect && !interactive
    ? 'transition-all duration-200 hover:shadow-lg' 
    : '';
  
  // Animation variants for interactive cards
  const cardVariants = {
    hover: { 
      y: -5,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    },
    tap: { 
      y: -2,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: { duration: 0.1 }
    }
  };
  
  // Card content
  const cardContent = (
    <>
      {/* Card header */}
      {(title || headerAction || icon) && (
        <div className={`border-b border-neutral-200 flex items-center justify-between ${sizeClasses[size].header} ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            {typeof title === 'string' ? (
              <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
            ) : (
              title
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Card body */}
      <div className={`${sizeClasses[size].body} ${bodyClassName}`}>{children}</div>
      
      {/* Card footer */}
      {footer && (
        <div className={`border-t border-neutral-200 bg-neutral-50 ${sizeClasses[size].footer} ${footerClassName}`}>
          {footer}
        </div>
      )}
    </>
  );
  
  // Render interactive card with animations
  if (interactive) {
    return (
      <motion.div
        className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${interactiveClasses} ${className}`}
        whileHover="hover"
        whileTap="tap"
        variants={cardVariants}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  // Render regular card
  return (
    <div 
      className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {cardContent}
    </div>
  );
};

export default CardRedesigned;
