/**
 * Canvas component for Builder
 * The main editing area where elements can be dropped and arranged
 */

import React, { RefObject } from 'react';
import { cn } from '@/lib/utils';
import { DragDropState, ElementLibraryItem } from '@/types/builder';
import { BookSettings } from '@/types/book';

interface BuilderCanvasProps {
  /** Reference to the content container */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  /** Current drag and drop state */
  dragState: DragDropState;
  /** Element library for getting drag feedback */
  elementLibrary: ElementLibraryItem[];
  /** Book settings for margins and page numbering */
  bookSettings: BookSettings;
  /** Current page index */
  currentPageIndex: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when dropping on canvas */
  onDrop: (e: React.DragEvent) => void;
  /** Callback when dragging over canvas */
  onDragOver: (e: React.DragEvent) => void;
  /** Callback when clicking on canvas */
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Renders the main editing canvas
 * @param props - Component props
 * @returns Canvas component
 */
export function BuilderCanvas({
  contentRef,
  isPreviewMode,
  dragState,
  elementLibrary,
  bookSettings,
  currentPageIndex,
  totalPages,
  onDrop,
  onDragOver,
  onClick
}: BuilderCanvasProps) {
  const isDraggingNewElement = Boolean(dragState.draggedElementType);
  const isDraggingExistingElement = Boolean(dragState.draggedElementId);
  const isDragging = isDraggingNewElement || isDraggingExistingElement;

  /**
   * Formats page number according to book settings
   */
  const formatPageNumber = (pageNum: number): string => {
    const { format, prefix, suffix } = bookSettings.pageNumbering;
    let formattedNumber = '';
    
    switch (format) {
      case 'roman':
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        let result = '';
        let num = pageNum;
        
        for (let i = 0; i < values.length; i++) {
          while (num >= values[i]) {
            result += numerals[i];
            num -= values[i];
          }
        }
        formattedNumber = result.toLowerCase();
        break;
      case 'text':
        const pageWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        formattedNumber = pageWords[pageNum - 1] || pageNum.toString();
        break;
      default:
        formattedNumber = pageNum.toString();
    }
    
    // Replace {total} placeholder in suffix with actual total pages
    const processedSuffix = suffix.replace('{total}', totalPages.toString());
    
    return `${prefix}${formattedNumber}${processedSuffix}`;
  };

  /**
   * Gets page number positioning styles
   */
  const getPageNumberStyles = () => {
    const { position } = bookSettings.pageNumbering;
    const baseStyles = {
      position: 'absolute' as const,
      fontSize: `${bookSettings.pageNumbering.fontSize}px`,
      color: bookSettings.pageNumbering.color,
      fontWeight: bookSettings.pageNumbering.fontWeight,
      zIndex: 10,
      userSelect: 'none' as const,
      pointerEvents: 'none' as const
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: '16px', left: '16px' };
      case 'top-center':
        return { ...baseStyles, top: '16px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...baseStyles, top: '16px', right: '16px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '16px', left: '16px' };
      case 'bottom-center':
        return { ...baseStyles, bottom: '16px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...baseStyles, bottom: '16px', right: '16px' };
      default:
        return { ...baseStyles, bottom: '16px', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  /**
   * Gets content wrapper styles with margins
   */
  const getContentWrapperStyles = () => {
    const { margins } = bookSettings;
    const marginValue = (value: number, unit: string) => `${value}${unit}`;
    
    return {
      paddingTop: marginValue(margins.top, margins.unit),
      paddingBottom: marginValue(margins.bottom, margins.unit),
      paddingLeft: marginValue(margins.left, margins.unit),
      paddingRight: marginValue(margins.right, margins.unit)
    };
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div className="p-8">
        <div className="relative" style={{ width: '800px' }}>
          {/* Page Container with Book Settings */}
          <div
            className={cn(
              "bg-white shadow-lg rounded-lg overflow-hidden min-h-[800px] relative border-2 transition-all duration-200",
              isDragging 
                ? isDraggingNewElement
                  ? "border-orange-400 border-dashed bg-orange-50/50"
                  : "border-blue-400 border-dashed bg-blue-50/50"
                : "border-gray-200"
            )}
            style={{ minHeight: '1000px' }}
          >
            {/* Page Number */}
            {isPreviewMode && bookSettings.pageNumbering.enabled && (
              <div style={getPageNumberStyles()}>
                {formatPageNumber(currentPageIndex + 1)}
              </div>
            )}

            {/* Content Container with Margins */}
            <div
              ref={contentRef}
              className={cn(
                "min-h-full relative transition-all duration-200",
                !isPreviewMode && "p-4"
              )}
              style={isPreviewMode ? getContentWrapperStyles() : undefined}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={onClick}
            />

            {/* Drop Indicator for New Elements */}
            {isDraggingNewElement && (
              <div className="absolute inset-0 bg-orange-500/10 border-2 border-dashed border-orange-400 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg">
                  Drop {elementLibrary.find(el => el.id === dragState.draggedElementType)?.title} here
                </div>
              </div>
            )}

            {/* Drop Indicator for Existing Elements (Reordering) */}
            {isDraggingExistingElement && (
              <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg">
                  🔄 Reordering element - drop to move
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 