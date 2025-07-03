/**
 * Toolbar component for Builder
 * Contains preview toggle, save, and close buttons
 */

import React from 'react';
import { BookOpen, Edit, X, FileEdit } from 'lucide-react';

interface BuilderToolbarProps {
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  /** Current page index */
  currentPageIndex: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback to toggle preview mode */
  onTogglePreview: () => void;
  /** Callback to switch to editor mode */
  onSwitchToEditor: () => void;
  /** Callback to close the builder */
  onClose: () => void;
}

/**
 * Renders the toolbar with action buttons
 * @param props - Component props
 * @returns Toolbar component
 */
export function BuilderToolbar({
  isPreviewMode,
  currentPageIndex,
  totalPages,
  onTogglePreview,
  onSwitchToEditor,
  onClose
}: BuilderToolbarProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          
          <h1 className="text-lg font-semibold text-gray-900">
            Page Builder
          </h1>
          
          <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            Page {currentPageIndex + 1} of {totalPages}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Toggle Button */}
          <button
            onClick={onTogglePreview}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isPreviewMode
                ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-50'
                : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
            }`}
            title={isPreviewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
          >
            {isPreviewMode ? (
              <>
                <Edit className="w-4 h-4" />
                Edit Mode
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Preview
              </>
            )}
          </button>

          {/* Switch to Editor Button */}
          <button
            onClick={onSwitchToEditor}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            title="Switch to Text Editor"
          >
            <FileEdit className="w-4 h-4" />
            Text Editor
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
            title="Close Builder"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 