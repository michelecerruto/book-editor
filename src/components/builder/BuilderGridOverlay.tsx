/**
 * Grid overlay component for Builder canvas
 * Shows visual grid lines when an image is selected
 */

import React, { useEffect, useState } from 'react';

interface BuilderGridOverlayProps {
  /** Whether to show the grid overlay */
  isVisible: boolean;
  /** The canvas container reference */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Currently selected image element */
  selectedImageElement?: HTMLElement | null;
}

/**
 * Visual grid overlay for the canvas
 */
export function BuilderGridOverlay({
  isVisible,
  containerRef,
  selectedImageElement
}: BuilderGridOverlayProps) {
  const [gridBounds, setGridBounds] = useState<DOMRect | null>(null);

  // Grid configuration (must match ImageGridResizer)
  const GRID_CELL_SIZE = 40;

  /**
   * Calculate grid bounds based on the canvas container
   */
  const calculateGridBounds = () => {
    if (!containerRef.current) return null;
    return containerRef.current.getBoundingClientRect();
  };

  /**
   * Update grid bounds when container changes
   */
  useEffect(() => {
    if (!isVisible) {
      setGridBounds(null);
      return;
    }

    const updateBounds = () => {
      const bounds = calculateGridBounds();
      setGridBounds(bounds);
    };

    updateBounds();

    // Update on resize
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [isVisible, containerRef]);

  /**
   * Get the selected image bounds for highlighting
   */
  const getImageBounds = () => {
    if (!selectedImageElement) return null;

    const imgElement = selectedImageElement.tagName === 'IMG' 
      ? selectedImageElement 
      : selectedImageElement.querySelector('img');
    
    if (!imgElement) return null;
    
    return imgElement.getBoundingClientRect();
  };

  if (!isVisible || !gridBounds) {
    return null;
  }

  const imageBounds = getImageBounds();
  const gridColumns = Math.ceil(gridBounds.width / GRID_CELL_SIZE);
  const gridRows = Math.ceil(gridBounds.height / GRID_CELL_SIZE);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        left: gridBounds.left,
        top: gridBounds.top,
        width: gridBounds.width,
        height: gridBounds.height,
      }}
    >
      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.3 }}
      >
        <defs>
          <pattern
            id="grid-pattern"
            width={GRID_CELL_SIZE}
            height={GRID_CELL_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${GRID_CELL_SIZE} 0 L 0 0 0 ${GRID_CELL_SIZE}`}
              fill="none"
              stroke="#f97316"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-pattern)"
        />
        
        {/* Major grid lines every 4 cells */}
        {Array.from({ length: Math.ceil(gridColumns / 4) + 1 }, (_, i) => (
          <line
            key={`v-major-${i}`}
            x1={i * GRID_CELL_SIZE * 4}
            y1={0}
            x2={i * GRID_CELL_SIZE * 4}
            y2="100%"
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.7"
          />
        ))}
        {Array.from({ length: Math.ceil(gridRows / 4) + 1 }, (_, i) => (
          <line
            key={`h-major-${i}`}
            x1={0}
            y1={i * GRID_CELL_SIZE * 4}
            x2="100%"
            y2={i * GRID_CELL_SIZE * 4}
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.7"
          />
        ))}
      </svg>

      {/* Image highlight overlay */}
      {imageBounds && (
        <div
          className="absolute border-2 border-orange-500 bg-orange-100 bg-opacity-20 rounded-lg"
          style={{
            left: imageBounds.left - gridBounds.left,
            top: imageBounds.top - gridBounds.top,
            width: imageBounds.width,
            height: imageBounds.height,
          }}
        >
          {/* Corner indicators */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
          
          {/* Size indicator */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {Math.round(imageBounds.width)}×{Math.round(imageBounds.height)}px
          </div>
        </div>
      )}

      {/* Grid info overlay */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 border border-orange-200 rounded-lg p-3 text-xs">
        <div className="font-semibold text-orange-700 mb-1">Grid Overlay</div>
        <div className="text-gray-600">Cell size: {GRID_CELL_SIZE}px</div>
        <div className="text-gray-600">Grid: {gridColumns}×{gridRows} cells</div>
        {imageBounds && (
          <div className="text-orange-600 mt-1 font-medium">
            Image: {Math.round(imageBounds.width / GRID_CELL_SIZE)}×{Math.round(imageBounds.height / GRID_CELL_SIZE)} cells
          </div>
        )}
      </div>
    </div>
  );
} 