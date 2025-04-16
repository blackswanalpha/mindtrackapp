'use client';

import React, { useState } from 'react';

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

export default Tabs;
