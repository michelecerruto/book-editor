/**
 * Canvas component for Builder
 * The main editing area where elements can be dropped and arranged
 */

import React, { RefObject } from 'react';
import { cn } from '@/lib/utils';
import { DragDropState, ElementLibraryItem } from '@/types/builder';

interface BuilderCanvasProps {
  /** Reference to the content container */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  /** Current drag and drop state */
  dragState: DragDropState;
  /** Element library for getting drag feedback */
  elementLibrary: ElementLibraryItem[];
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
  onDrop,
  onDragOver,
  onClick
}: BuilderCanvasProps) {
  const isDraggingNewElement = Boolean(dragState.draggedElementType);
  const isDraggingExistingElement = Boolean(dragState.draggedElementId);
  const isDragging = isDraggingNewElement || isDraggingExistingElement;

  return (
    <div className="flex-1 overflow-auto bg-gray-100">
      <div className="p-8">
        <div className="relative" style={{ width: '800px' }}>
          {/* Main Content Container */}
          <div
            ref={contentRef}
            className={cn(
              "bg-white shadow-lg rounded-lg overflow-hidden min-h-[800px] relative border-2 transition-all duration-200",
              isPreviewMode ? "p-8" : "p-4",
              isDragging 
                ? isDraggingNewElement
                  ? "border-orange-400 border-dashed bg-orange-50/50"
                  : "border-blue-400 border-dashed bg-blue-50/50"
                : "border-gray-200"
            )}
            style={{ minHeight: '1000px' }}
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
  );
} 