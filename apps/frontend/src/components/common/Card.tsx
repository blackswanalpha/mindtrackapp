'use client';

import React from 'react';

type CardProps = {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  headerAction?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  headerAction
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Card header */}
      {(title || headerAction) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          <div className="flex items-center justify-between">
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      
      {/* Card body */}
      <div className={`px-6 py-4 ${bodyClassName}`}>{children}</div>
      
      {/* Card footer */}
      {footer && (
        <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
