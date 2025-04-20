'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'glass' | 'outline' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  animation?: 'none' | 'fade' | 'slide' | 'scale';
  delay?: number;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  variant = 'default',
  padding = 'medium',
  animation = 'none',
  delay = 0
}) => {
  // Determine padding class
  const paddingClass = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }[padding];

  // Determine variant class
  const variantClass = {
    default: 'bg-white shadow-md',
    glass: 'glass',
    outline: 'bg-white border border-neutral-200',
    gradient: 'bg-gradient-soft'
  }[variant];

  // Determine hover effect class
  const hoverClass = hoverEffect 
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' 
    : '';

  // Animation variants
  const animationVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 }
    },
    none: {
      hidden: {},
      visible: {}
    }
  };

  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${variantClass} ${paddingClass} ${hoverClass} ${className}`}
      initial={animation !== 'none' ? "hidden" : false}
      animate={animation !== 'none' ? "visible" : false}
      variants={animationVariants[animation]}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0] // Cubic bezier easing
      }}
    >
      {children}
    </motion.div>
  );
};

export default ModernCard;
