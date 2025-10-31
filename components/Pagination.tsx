import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-amber-800/30 ${className}`}>
      <div className="text-sm text-amber-100/70">
        顯示 {Math.min(startIndex + 1, totalItems)}-{Math.min(startIndex + itemsPerPage, totalItems)} 筆，共 {totalItems} 筆
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-l-md bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="第一頁"
        >
          &laquo;
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="上一頁"
        >
          &lsaquo;
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-md ${
                currentPage === pageNum 
                  ? 'bg-amber-500/30 text-amber-100 border border-amber-500/50' 
                  : 'bg-amber-900/30 text-amber-100/70 hover:bg-amber-800/30'
              }`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="下一頁"
        >
          &rsaquo;
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-r-md bg-amber-900/30 text-amber-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="最後一頁"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
