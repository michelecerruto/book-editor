/**
 * Canvas component for Builder
 * The main editing area where elements can be dropped and arranged
 */

import React, { RefObject, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DragDropState, ElementLibraryItem } from '@/types/builder';
import { BookSettings, PageNumberSettings, DesignSettings } from '@/types/book';


interface BuilderCanvasProps {
  /** Reference to the content container */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  /** Current drag and drop state */
  dragState: DragDropState;
  /** Element library for getting drag feedback */
  elementLibrary: ElementLibraryItem[];
  /** Book settings for margins and page numbers */
  bookSettings: BookSettings;
  /** Design settings for typography, layout, and colors */
  designSettings: DesignSettings;
  /** Current page number for page numbering */
  currentPageNumber: number;
  /** Currently selected element (for grid overlay) */
  selectedElement?: HTMLElement | null;
  /** Callback when dropping on canvas */
  onDrop: (e: React.DragEvent) => void;
  /** Callback when dragging over canvas */
  onDragOver: (e: React.DragEvent) => void;
  /** Callback when clicking on canvas */
  onClick: (e: React.MouseEvent) => void;
  /** Callback when content should be updated/saved */
  onContentUpdate?: () => void;
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
  designSettings,
  currentPageNumber,
  selectedElement,
  onDrop,
  onDragOver,
  onClick,
  onContentUpdate
}: BuilderCanvasProps) {
  const isDraggingNewElement = Boolean(dragState.draggedElementType);
  const isDraggingExistingElement = Boolean(dragState.draggedElementId);
  const isDragging = isDraggingNewElement || isDraggingExistingElement;

  // Listen for image resize events to trigger content updates
  useEffect(() => {
    const handleImageResize = () => {
      onContentUpdate?.();
    };

    if (contentRef.current) {
      contentRef.current.addEventListener('imageResized', handleImageResize);
      return () => {
        contentRef.current?.removeEventListener('imageResized', handleImageResize);
      };
    }
  }, [contentRef, onContentUpdate]);

  // selectedElement is passed but not used directly in this component
  // It's available for future enhancements
  React.useEffect(() => {
    // This effect acknowledges selectedElement to prevent lint warnings
  }, [selectedElement]);

  // Helper function to format page numbers
  const formatPageNumber = (pageNum: number, format: PageNumberSettings['format']): string => {
    switch (format) {
      case 'roman-lower':
        return toRoman(pageNum).toLowerCase();
      case 'roman-upper':
        return toRoman(pageNum);
      case 'alpha-lower':
        return toAlpha(pageNum).toLowerCase();
      case 'alpha-upper':
        return toAlpha(pageNum);
      case 'numeric':
      default:
        return pageNum.toString();
    }
  };

  const toRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    return result;
  };

  const toAlpha = (num: number): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    while (num > 0) {
      num--;
      result = letters[num % 26] + result;
      num = Math.floor(num / 26);
    }
    return result;
  };

  // Generate page number display
  const getPageNumberDisplay = (): string => {
    if (!bookSettings.pageNumbers.enabled) return '';
    
    const formattedNumber = formatPageNumber(currentPageNumber, bookSettings.pageNumbers.format);
    const prefix = bookSettings.pageNumbers.prefix || '';
    const suffix = bookSettings.pageNumbers.suffix || '';
    
    return `${prefix}${formattedNumber}${suffix}`;
  };

  // Get page number position styles
  const getPageNumberStyles = () => {
    const { position, fontSize, color } = bookSettings.pageNumbers;
    
    const baseStyles: React.CSSProperties = {
      position: 'absolute' as const,
      fontSize: `${fontSize}px`,
      color: color,
      fontFamily: 'inherit',
      userSelect: 'none',
      pointerEvents: 'none',
      zIndex: 10
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: '8px', left: '16px' };
      case 'top-center':
        return { ...baseStyles, top: '8px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...baseStyles, top: '8px', right: '16px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '8px', left: '16px' };
      case 'bottom-center':
        return { ...baseStyles, bottom: '8px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...baseStyles, bottom: '8px', right: '16px' };
      default:
        return { ...baseStyles, bottom: '8px', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  // Get font family CSS
  const getFontFamilyStyle = (fontFamily: string): string => {
    switch (fontFamily) {
      case 'serif': return '"Times New Roman", Times, serif';
      case 'sans': return 'Arial, Helvetica, sans-serif';
      case 'crimson': return '"Crimson Text", serif';
      case 'libre': return '"Libre Baskerville", serif';
      case 'playfair': return '"Playfair Display", serif';
      case 'inter': return 'Inter, sans-serif';
      case 'lora': return 'Lora, serif';
      case 'merriweather': return 'Merriweather, serif';
      case 'system':
      default: return 'system-ui, -apple-system, sans-serif';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      {/* Global styles for content */}
      <style jsx>{`
        [data-content-area] p {
          margin-bottom: ${designSettings.typography.paragraphSpacing} !important;
        }
        [data-content-area] h1,
        [data-content-area] h2,
        [data-content-area] h3,
        [data-content-area] h4,
        [data-content-area] h5,
        [data-content-area] h6 {
          font-family: ${getFontFamilyStyle(designSettings.typography.fontFamily)} !important;
          color: ${designSettings.colors.textColor} !important;
        }
        [data-content-area] * {
          font-family: ${getFontFamilyStyle(designSettings.typography.fontFamily)} !important;
          color: ${designSettings.colors.textColor} !important;
        }
      `}</style>
      <div className="p-8">
        <div 
          className="relative mx-auto" 
          style={{ 
            width: designSettings.layout.pageWidth === 'full' ? '100%' : designSettings.layout.pageWidth,
            maxWidth: '100%'
          }}
        >
          {/* Main Content Container */}
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
            {/* Page Number (visible in preview mode or always if enabled) */}
            {bookSettings.pageNumbers.enabled && (isPreviewMode || !isDragging) && (
              <div style={getPageNumberStyles()}>
                {getPageNumberDisplay()}
              </div>
            )}

            {/* Content area with margins */}
            <div
              ref={contentRef}
              data-content-area
              className={cn(
                "min-h-full relative transition-all duration-200",
                !isPreviewMode && "p-4"
              )}
              style={{
                paddingTop: isPreviewMode ? `${bookSettings.margins.top}px` : designSettings.layout.pageMargins,
                paddingBottom: isPreviewMode ? `${bookSettings.margins.bottom}px` : designSettings.layout.pageMargins,
                paddingLeft: isPreviewMode ? `${bookSettings.margins.left}px` : designSettings.layout.pageMargins,
                paddingRight: isPreviewMode ? `${bookSettings.margins.right}px` : designSettings.layout.pageMargins,
                backgroundColor: designSettings.colors.backgroundColor,
                color: designSettings.colors.textColor,
                fontFamily: getFontFamilyStyle(designSettings.typography.fontFamily),
                fontSize: designSettings.typography.baseFontSize,
                lineHeight: designSettings.typography.lineHeight,
                minHeight: '1000px'
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={onClick}
            />
          </div>

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
  );
} 