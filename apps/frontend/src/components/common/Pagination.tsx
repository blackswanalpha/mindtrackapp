'use client';

import React from 'react';
import { getPaginationRange } from '@/utils/pagination';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }
  
  // Calculate page range to display
  const pageRange = getPaginationRange(currentPage, totalPages, maxPageButtons);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };
  
  return (
    <div className="flex items-center justify-center space-x-1 mt-4">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        &laquo;
      </button>
      
      {/* First page button (if not in range) */}
      {pageRange[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            1
          </button>
          
          {/* Ellipsis if needed */}
          {pageRange[0] > 2 && (
            <span className="px-3 py-1 text-gray-500">...</span>
          )}
        </>
      )}
      
      {/* Page buttons */}
      {pageRange.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white border border-blue-600'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Last page button (if not in range) */}
      {pageRange[pageRange.length - 1] < totalPages && (
        <>
          {/* Ellipsis if needed */}
          {pageRange[pageRange.length - 1] < totalPages - 1 && (
            <span className="px-3 py-1 text-gray-500">...</span>
          )}
          
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}
      
      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
