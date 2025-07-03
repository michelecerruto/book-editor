'use client';

import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  currentPageWords: number;
  onPageChange: (page: number) => void;
  onAddPage: () => void;
  onRemovePage: () => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  currentPageWords,
  onPageChange,
  onAddPage,
  onRemovePage,
  className
}: PaginationControlsProps) {
  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;
  const canRemovePage = totalPages > 1;

  return (
    <div className={cn("bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm", className)}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Page Number Display & Word Count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-center">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {currentPage}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  / {totalPages}
                </span>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <span className="text-lg font-semibold text-orange-600">
                  {currentPageWords.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  words
                </span>
              </div>
            </div>
          </div>

          {/* Center: Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Previous Button */}
            <button
              onClick={() => canGoToPrevious && onPageChange(currentPage - 1)}
              disabled={!canGoToPrevious}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                canGoToPrevious
                  ? "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Input */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Go to page</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                  }
                }}
                className="w-16 px-2 py-1 text-center border border-orange-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => canGoToNext && onPageChange(currentPage + 1)}
              disabled={!canGoToNext}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                canGoToNext
                  ? "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              )}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Page Management */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAddPage}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              title="Add new page"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button
              onClick={onRemovePage}
              disabled={!canRemovePage}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                canRemovePage
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
                  : "bg-gray-100 text-red-300 cursor-not-allowed border border-gray-200"
              )}
              title="Remove current page"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 