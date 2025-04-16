'use client';

import React from 'react';

type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
};

function Table<T>({
  columns,
  data,
  keyField,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  headerClassName = '',
  rowClassName,
  onRowClick
}: TableProps<T>) {
  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    return item[column.accessor] as React.ReactNode;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!data.length) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`bg-gray-50 ${headerClassName}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={String(item[keyField])}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${rowClassName ? rowClassName(item, index) : ''}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${column.className || ''}`}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
