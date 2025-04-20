'use client';

import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

// Context for tabs
type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

// Tabs variants
type TabsVariant = 'default' | 'pills' | 'underline' | 'enclosed' | 'unstyled';
type TabsColor = 'primary' | 'secondary' | 'accent' | 'neutral';
type TabsSize = 'sm' | 'md' | 'lg';
type TabsAlignment = 'start' | 'center' | 'end' | 'stretch';

// Main Tabs component
type TabsProps = {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  variant?: TabsVariant;
  color?: TabsColor;
  size?: TabsSize;
  alignment?: TabsAlignment;
  fullWidth?: boolean;
  animated?: boolean;
};

const TabsRedesigned: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = '',
  variant = 'default',
  color = 'primary',
  size = 'md',
  alignment = 'start',
  fullWidth = false,
  animated = true,
}) => {
  // Use controlled or uncontrolled state
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList component
type TabsListProps = {
  children: React.ReactNode;
  className?: string;
  variant?: TabsVariant;
  color?: TabsColor;
  size?: TabsSize;
  alignment?: TabsAlignment;
  fullWidth?: boolean;
};

const TabsList: React.FC<TabsListProps> = ({ 
  children, 
  className = '',
  variant = 'default',
  color = 'primary',
  size = 'md',
  alignment = 'start',
  fullWidth = false,
}) => {
  // Variant styles
  const variantClasses = {
    default: 'border-b border-neutral-200 dark:border-neutral-700',
    pills: 'space-x-1',
    underline: 'border-b border-neutral-200 dark:border-neutral-700',
    enclosed: 'border-b border-neutral-200 dark:border-neutral-700',
    unstyled: '',
  };
  
  // Alignment styles
  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: fullWidth ? 'justify-stretch' : 'justify-start',
  };
  
  return (
    <div className={`flex ${alignmentClasses[alignment]} ${variantClasses[variant]} ${className}`}>
      {fullWidth ? (
        <div className="flex w-full">
          {React.Children.map(children, (child) => (
            <div className="flex-1">{child}</div>
          ))}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

// TabsTrigger component
type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: TabsVariant;
  color?: TabsColor;
  size?: TabsSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top';
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = '',
  disabled = false,
  variant = 'default',
  color = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;
  
  // Color styles
  const colorClasses = {
    primary: {
      selected: 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400',
      hover: 'hover:text-primary-700 dark:hover:text-primary-300',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      bgHover: 'hover:bg-primary-100 dark:hover:bg-primary-900/30',
      bgSelected: 'bg-primary-100 dark:bg-primary-900/30',
      pillSelected: 'bg-primary-600 text-white dark:bg-primary-500',
      pillHover: 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
    },
    secondary: {
      selected: 'text-secondary-600 dark:text-secondary-400 border-secondary-600 dark:border-secondary-400',
      hover: 'hover:text-secondary-700 dark:hover:text-secondary-300',
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
      bgHover: 'hover:bg-secondary-100 dark:hover:bg-secondary-900/30',
      bgSelected: 'bg-secondary-100 dark:bg-secondary-900/30',
      pillSelected: 'bg-secondary-600 text-white dark:bg-secondary-500',
      pillHover: 'hover:bg-secondary-50 dark:hover:bg-secondary-900/20',
    },
    accent: {
      selected: 'text-accent-600 dark:text-accent-400 border-accent-600 dark:border-accent-400',
      hover: 'hover:text-accent-700 dark:hover:text-accent-300',
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      bgHover: 'hover:bg-accent-100 dark:hover:bg-accent-900/30',
      bgSelected: 'bg-accent-100 dark:bg-accent-900/30',
      pillSelected: 'bg-accent-600 text-white dark:bg-accent-500',
      pillHover: 'hover:bg-accent-50 dark:hover:bg-accent-900/20',
    },
    neutral: {
      selected: 'text-neutral-800 dark:text-white border-neutral-800 dark:border-white',
      hover: 'hover:text-neutral-900 dark:hover:text-neutral-100',
      bg: 'bg-neutral-100 dark:bg-neutral-800',
      bgHover: 'hover:bg-neutral-200 dark:hover:bg-neutral-700',
      bgSelected: 'bg-neutral-200 dark:bg-neutral-700',
      pillSelected: 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900',
      pillHover: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5',
  };
  
  // Variant styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'pills':
        return `rounded-full font-medium transition-colors ${
          isSelected 
            ? colorClasses[color].pillSelected
            : `text-neutral-600 dark:text-neutral-300 ${colorClasses[color].pillHover}`
        }`;
      
      case 'underline':
        return `font-medium border-b-2 ${sizeClasses[size]} transition-colors ${
          isSelected 
            ? `border-b-2 ${colorClasses[color].selected}`
            : `border-transparent text-neutral-600 dark:text-neutral-300 ${colorClasses[color].hover}`
        }`;
      
      case 'enclosed':
        return `font-medium border-t border-l border-r rounded-t-lg ${sizeClasses[size]} transition-colors ${
          isSelected 
            ? `${colorClasses[color].selected} ${colorClasses[color].bgSelected} border-neutral-200 dark:border-neutral-700 border-b-0`
            : `border-transparent text-neutral-600 dark:text-neutral-300 ${colorClasses[color].hover}`
        }`;
      
      case 'unstyled':
        return `${sizeClasses[size]} transition-colors ${
          isSelected 
            ? colorClasses[color].selected
            : `text-neutral-600 dark:text-neutral-300 ${colorClasses[color].hover}`
        }`;
      
      default: // default variant
        return `font-medium ${sizeClasses[size]} transition-colors ${
          isSelected 
            ? `border-b-2 ${colorClasses[color].selected}`
            : `border-b-2 border-transparent text-neutral-600 dark:text-neutral-300 ${colorClasses[color].hover}`
        }`;
    }
  };
  
  // Icon layout
  const getIconLayout = () => {
    if (!icon) return null;
    
    switch (iconPosition) {
      case 'left':
        return <span className="mr-2">{icon}</span>;
      case 'right':
        return <span className="ml-2">{icon}</span>;
      case 'top':
        return (
          <div className="flex flex-col items-center">
            <span className="mb-1">{icon}</span>
            <span>{children}</span>
          </div>
        );
      default:
        return <span className="mr-2">{icon}</span>;
    }
  };
  
  // Content based on icon position
  const content = iconPosition === 'top' ? (
    getIconLayout()
  ) : (
    <div className="flex items-center">
      {iconPosition === 'left' && getIconLayout()}
      <span>{children}</span>
      {iconPosition === 'right' && getIconLayout()}
    </div>
  );

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={`${getVariantClasses()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {content}
    </button>
  );
};

// TabsContent component
type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
};

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
  animated = true,
}) => {
  const { value: selectedValue } = useTabs();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }
    },
  };

  return animated ? (
    <motion.div
      role="tabpanel"
      initial="hidden"
      animate="visible"
      variants={contentVariants}
      className={`py-4 ${className}`}
    >
      {children}
    </motion.div>
  ) : (
    <div role="tabpanel" className={`py-4 ${className}`}>
      {children}
    </div>
  );
};

// Export the components
export { TabsRedesigned as Tabs, TabsList, TabsTrigger, TabsContent };
