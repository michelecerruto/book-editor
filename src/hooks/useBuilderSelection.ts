/**
 * Custom hook for managing element selection in Builder
 */

import { useState, useCallback, RefObject } from 'react';
import { ElementSelection } from '@/types/builder';
import { applySelectionStyling, clearAllSelections } from '@/utils/builderUtils';

interface UseBuilderSelectionProps {
  /** Reference to the content container */
  contentRef: RefObject<HTMLElement | null>;
}

interface UseBuilderSelectionReturn {
  /** Current selection state */
  selection: ElementSelection;
  /** Select an element by ID */
  selectElement: (elementId: string | null) => void;
  /** Get the currently selected DOM element */
  getSelectedElement: () => HTMLElement | null;
  /** Clear all selections */
  clearSelection: () => void;
}

/**
 * Hook for managing element selection in Builder
 * @param props - Hook configuration
 * @returns Selection state and management functions
 */
export function useBuilderSelection({ 
  contentRef 
}: UseBuilderSelectionProps): UseBuilderSelectionReturn {
  const [selection, setSelection] = useState<ElementSelection>({
    selectedElementId: null,
    selectedElement: null
  });

  /**
   * Gets the currently selected DOM element
   */
  const getSelectedElement = useCallback((): HTMLElement | null => {
    if (!selection.selectedElementId || !contentRef.current) {
      return null;
    }
    return contentRef.current.querySelector(`[data-element-id="${selection.selectedElementId}"]`) as HTMLElement;
  }, [selection.selectedElementId, contentRef]);

  /**
   * Clears all visual selections in the container
   */
  const clearAllVisualSelections = useCallback(() => {
    if (contentRef.current) {
      clearAllSelections(contentRef.current);
    }
  }, [contentRef]);

  /**
   * Selects an element by its ID
   * @param elementId - ID of the element to select, or null to deselect
   */
  const selectElement = useCallback((elementId: string | null) => {
    // Always clear all visual selections first
    clearAllVisualSelections();
    
    // Update selection state
    const newSelection: ElementSelection = {
      selectedElementId: elementId,
      selectedElement: null
    };
    
    // Apply visual selection if element exists
    if (elementId && contentRef.current) {
      const element = contentRef.current.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
      if (element) {
        applySelectionStyling(element);
        newSelection.selectedElement = element;
      }
    }
    
    setSelection(newSelection);
  }, [contentRef, clearAllVisualSelections]);

  /**
   * Clears the current selection
   */
  const clearSelection = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  return {
    selection,
    selectElement,
    getSelectedElement,
    clearSelection
  };
} 