/**
 * Utility functions for pagination
 */

/**
 * Calculate pagination range
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxPageButtons - Maximum number of page buttons to show
 * @returns Array of page numbers to display
 */
export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  maxPageButtons = 5
): number[] => {
  // Handle edge cases
  if (totalPages <= 1) return [1];
  if (totalPages <= maxPageButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // Calculate start and end page
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;
  
  // Adjust if end page exceeds total pages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  // Generate page range
  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
};

/**
 * Calculate total pages
 * @param totalItems - Total number of items
 * @param itemsPerPage - Number of items per page
 * @returns Total number of pages
 */
export const getTotalPages = (
  totalItems: number,
  itemsPerPage: number
): number => {
  return Math.ceil(totalItems / itemsPerPage);
};

/**
 * Get paginated items from array
 * @param items - Array of items
 * @param currentPage - Current page number
 * @param itemsPerPage - Number of items per page
 * @returns Paginated items
 */
export const getPaginatedItems = <T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

/**
 * Create pagination metadata
 * @param totalItems - Total number of items
 * @param currentPage - Current page number
 * @param itemsPerPage - Number of items per page
 * @returns Pagination metadata
 */
export const createPaginationMetadata = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = getTotalPages(totalItems, itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null,
    pageRange: getPaginationRange(currentPage, totalPages)
  };
};
