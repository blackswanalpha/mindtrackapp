'use client';

import React from 'react';

type LoadingProps = {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
};

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  fullScreen = false,
  message
}) => {
  // Determine spinner size
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4'
  };
  
  // Container classes
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex flex-col items-center justify-center py-4';
  
  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-transparent border-blue-600`}
        role="status"
        aria-label="Loading"
      ></div>
      
      {message && (
        <p className="mt-2 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export default Loading;
