/**
 * Grid-based image resizer component
 * Provides visual grid overlay and resize handles for precise image sizing
 */

import React, { useState, useEffect, useRef } from 'react';
import { Move, RotateCcw } from 'lucide-react';

interface ImageGridResizerProps {
  /** The selected image element (figure or img) */
  selectedElement: HTMLElement;
  /** Callback when image size changes */
  onSizeChange: (width: number, height: number) => void;
}

interface GridSize {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Grid-based image resizer with visual feedback
 */
export function ImageGridResizer({
  selectedElement,
  onSizeChange
}: ImageGridResizerProps) {
  const [gridSize, setGridSize] = useState<GridSize>({ width: 6, height: 4, x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  // Grid configuration
  const GRID_CELL_SIZE = 40; // 40px per grid cell
  const MAX_GRID_WIDTH = 12; // 12 columns max
  const MAX_GRID_HEIGHT = 10; // 10 rows max

  /**
   * Get the actual image element from figure or direct img
   */
  const getImageElement = (): HTMLImageElement | null => {
    if (selectedElement.tagName === 'IMG') {
      return selectedElement as HTMLImageElement;
    }
    return selectedElement.querySelector('img');
  };

  /**
   * Calculate current grid size based on actual image dimensions
   */
  const calculateCurrentGridSize = (): GridSize => {
    const imgElement = getImageElement();
    if (!imgElement) return { width: 6, height: 4, x: 0, y: 0 };

    const rect = imgElement.getBoundingClientRect();
    const width = Math.round(rect.width / GRID_CELL_SIZE);
    const height = Math.round(rect.height / GRID_CELL_SIZE);

    return {
      width: Math.max(1, Math.min(width, MAX_GRID_WIDTH)),
      height: Math.max(1, Math.min(height, MAX_GRID_HEIGHT)),
      x: 0,
      y: 0
    };
  };

  /**
   * Apply grid size to actual image
   */
  const applyGridSize = (newGridSize: GridSize) => {
    const pixelWidth = newGridSize.width * GRID_CELL_SIZE;
    const pixelHeight = newGridSize.height * GRID_CELL_SIZE;

    // Just notify parent of size change - let the parent handle the actual DOM updates
    onSizeChange(pixelWidth, pixelHeight);
  };

  /**
   * Handle grid cell click for resizing
   */
  const handleGridCellClick = (cellX: number, cellY: number) => {
    const newGridSize = {
      ...gridSize,
      width: cellX + 1,
      height: cellY + 1
    };
    setGridSize(newGridSize);
    applyGridSize(newGridSize);
  };

  /**
   * Handle preset size buttons
   */
  const handlePresetSize = (preset: 'small' | 'medium' | 'large' | 'full') => {
    let newGridSize: GridSize;
    
    switch (preset) {
      case 'small':
        newGridSize = { ...gridSize, width: 4, height: 3 };
        break;
      case 'medium':
        newGridSize = { ...gridSize, width: 6, height: 4 };
        break;
      case 'large':
        newGridSize = { ...gridSize, width: 8, height: 6 };
        break;
      case 'full':
        newGridSize = { ...gridSize, width: 12, height: 8 };
        break;
      default:
        return;
    }
    
    setGridSize(newGridSize);
    applyGridSize(newGridSize);
  };

  /**
   * Reset to original aspect ratio
   */
  const resetAspectRatio = () => {
    const imgElement = getImageElement();
    if (!imgElement) return;

    // Reset styles to auto to get natural dimensions
    imgElement.style.width = 'auto';
    imgElement.style.height = 'auto';
    imgElement.style.maxWidth = '100%';
    imgElement.style.objectFit = 'contain';

    if (selectedElement.tagName === 'FIGURE') {
      selectedElement.style.width = 'auto';
    }

    // Calculate new grid size based on natural dimensions
    setTimeout(() => {
      const newGridSize = calculateCurrentGridSize();
      setGridSize(newGridSize);
    }, 100);
  };

  // Initialize grid size when component mounts or element changes
  useEffect(() => {
    const currentGridSize = calculateCurrentGridSize();
    setGridSize(currentGridSize);
  }, [selectedElement]);

  return (
    <div className="space-y-4">
      {/* Size Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Sizes
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePresetSize('small')}
            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Small (4×3)
          </button>
          <button
            onClick={() => handlePresetSize('medium')}
            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Medium (6×4)
          </button>
          <button
            onClick={() => handlePresetSize('large')}
            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Large (8×6)
          </button>
          <button
            onClick={() => handlePresetSize('full')}
            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Full (12×8)
          </button>
        </div>
      </div>

      {/* Grid Sizer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grid Size ({gridSize.width}×{gridSize.height} cells)
        </label>
        
        <div 
          ref={gridRef}
          className="relative bg-gray-50 border border-gray-200 rounded-lg p-2 overflow-hidden"
          style={{ width: '280px', height: '200px' }}
        >
          {/* Grid cells */}
          <div className="grid grid-cols-12 gap-px h-full">
            {Array.from({ length: MAX_GRID_WIDTH * MAX_GRID_HEIGHT }, (_, index) => {
              const cellX = index % MAX_GRID_WIDTH;
              const cellY = Math.floor(index / MAX_GRID_WIDTH);
              const isSelected = cellX < gridSize.width && cellY < gridSize.height;
              const isCorner = cellX === gridSize.width - 1 && cellY === gridSize.height - 1;

              return (
                <div
                  key={index}
                  className={`
                    relative cursor-pointer transition-all duration-150
                    ${isSelected 
                      ? 'bg-orange-400 hover:bg-orange-500' 
                      : 'bg-white hover:bg-gray-100'
                    }
                    ${isCorner ? 'ring-2 ring-orange-600' : ''}
                  `}
                  onClick={() => handleGridCellClick(cellX, cellY)}
                  title={`Resize to ${cellX + 1}×${cellY + 1} cells`}
                >
                  {isCorner && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Move className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Click cells to resize • Current: {gridSize.width * GRID_CELL_SIZE}×{gridSize.height * GRID_CELL_SIZE}px
        </div>
      </div>

      {/* Reset Button */}
      <div>
        <button
          onClick={resetAspectRatio}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Original Ratio
        </button>
      </div>

      {/* Current Dimensions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <div>Grid: {gridSize.width}×{gridSize.height} cells</div>
        <div>Size: {gridSize.width * GRID_CELL_SIZE}×{gridSize.height * GRID_CELL_SIZE}px</div>
        <div>Cell size: {GRID_CELL_SIZE}px</div>
      </div>
    </div>
  );
} 