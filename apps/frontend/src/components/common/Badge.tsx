'use client';

import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
type BadgeSize = 'small' | 'medium' | 'large';

type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  rounded?: boolean;
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  rounded = false
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  
  // Size styles
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-sm',
    large: 'px-3 py-1 text-base'
  };
  
  // Rounded styles
  const roundedClass = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
