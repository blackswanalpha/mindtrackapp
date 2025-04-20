'use client';

import React, { useState, createContext, useContext } from 'react';

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'pills' | 'underline';
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  variant = 'default'
}) => {
  // Set active tab (use defaultTabId if provided, otherwise use first tab)
  const [activeTabId, setActiveTabId] = useState(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );

  // Handle tab click
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Get active tab content
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Variant styles
  const getTabStyles = (tab: Tab) => {
    const isActive = tab.id === activeTabId;
    const isDisabled = tab.disabled;

    // Base styles
    let styles = 'px-4 py-2 text-sm font-medium focus:outline-none transition-colors';

    if (isDisabled) {
      styles += ' cursor-not-allowed opacity-50';
    } else {
      styles += ' cursor-pointer';
    }

    // Variant-specific styles
    switch (variant) {
      case 'pills':
        styles += isActive
          ? ' bg-blue-600 text-white rounded-md'
          : ' text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md';
        break;
      case 'underline':
        styles += isActive
          ? ' text-blue-600 border-b-2 border-blue-600'
          : ' text-gray-600 hover:text-gray-900 border-b-2 border-transparent';
        break;
      default: // default variant
        styles += isActive
          ? ' text-blue-600 border-b-2 border-blue-600'
          : ' text-gray-600 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent';
        break;
    }

    return styles;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab navigation */}
      <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200' : ''} ${tabsClassName}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={getTabStyles(tab)}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={tab.id === activeTabId}
            aria-controls={`tab-panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className={`mt-4 ${contentClassName}`}
        role="tabpanel"
        id={`tab-panel-${activeTabId}`}
        aria-labelledby={`tab-${activeTabId}`}
      >
        {activeTab ? activeTab.content : null}
      </div>
    </div>
  );
};

// New Tabs API (Radix UI style)
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

type NewTabsProps = {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

const NewTabs: React.FC<NewTabsProps> = ({
  defaultValue,
  onValueChange,
  children,
  className = ''
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
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

type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = ''
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 text-sm font-medium ${
        isSelected
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
};

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = ''
}) => {
  const { value: selectedValue } = useTabs();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};

// Export the new Tabs API components
export { TabsList, TabsTrigger, TabsContent, NewTabs as Tabs };

// Export the old Tabs component as default for backward compatibility
export default NewTabs;
