/**
 * Custom hook for managing drag and drop functionality in Builder
 */

import { useState, useCallback, RefObject } from 'react';
import { DragDropState, ElementLibraryItem } from '@/types/builder';
import { generateElementId, applyBuilderStyling } from '@/utils/builderUtils';

interface UseBuilderDragDropProps {
  /** Reference to the content container */
  contentRef: RefObject<HTMLElement | null>;
  /** Element library items */
  elementLibrary: ElementLibraryItem[];
  /** Callback when content is updated */
  onContentUpdate: (content: string) => void;
  /** Callback when an element is selected */
  onElementSelect: (elementId: string) => void;
  /** Callback to refresh event listeners */
  onRefreshListeners: () => void;
}

interface UseBuilderDragDropReturn {
  /** Current drag and drop state */
  dragState: DragDropState;
  /** Handle drag start from element library */
  handleDragStart: (e: React.DragEvent, elementType: string) => void;
  /** Handle drag start from existing element */
  handleExistingElementDragStart: (e: DragEvent, elementId: string) => void;
  /** Handle drop on canvas */
  handleDrop: (e: React.DragEvent) => void;
  /** Handle drag over canvas */
  handleDragOver: (e: React.DragEvent) => void;
  /** Handle drag end */
  handleDragEnd: () => void;
}

/**
 * Hook for managing drag and drop functionality in Builder
 * @param props - Hook configuration
 * @returns Drag and drop state and handlers
 */
export function useBuilderDragDrop({
  contentRef,
  elementLibrary,
  onContentUpdate,
  onElementSelect,
  onRefreshListeners
}: UseBuilderDragDropProps): UseBuilderDragDropReturn {
  const [dragState, setDragState] = useState<DragDropState>({
    draggedElementType: null,
    draggedElementId: null
  });

  /**
   * Cleans selection styling from content before saving
   */
  const saveCleanContent = useCallback(() => {
    if (!contentRef.current) return;
    
    // Create a temporary clone to clean up selection styling before saving
    const tempContainer = contentRef.current.cloneNode(true) as HTMLElement;
    
    // Remove selection styling from all elements in the clone
    const elementsWithSelection = tempContainer.querySelectorAll('[data-element-id]');
    elementsWithSelection.forEach(el => {
      const htmlElement = el as HTMLElement;
      // Remove selection styling properties
      htmlElement.style.removeProperty('outline');
      htmlElement.style.removeProperty('outline-offset');
      htmlElement.style.removeProperty('box-shadow');
    });
    
    const cleanContent = tempContainer.innerHTML;
    onContentUpdate(cleanContent);
  }, [contentRef, onContentUpdate]);

  /**
   * Handles drag start from element library
   */
  const handleDragStart = useCallback((e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('text/plain', elementType);
    e.dataTransfer.effectAllowed = 'copy';
    
    setDragState(prev => ({
      ...prev,
      draggedElementType: elementType
    }));

    // Create drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 25);

    // Clean up drag image
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  }, []);

  /**
   * Handles drag start from existing elements (for reordering)
   */
  const handleExistingElementDragStart = useCallback((e: DragEvent, elementId: string) => {
    if (!e.dataTransfer || !elementId) {
      console.warn('Invalid drag start:', { hasDataTransfer: !!e.dataTransfer, elementId });
      return;
    }

    e.dataTransfer.setData('text/plain', `existing:${elementId}`);
    e.dataTransfer.effectAllowed = 'move';
    
    setDragState(prev => ({
      ...prev,
      draggedElementId: elementId
    }));

    // Apply visual feedback - find element by ID to be safe
    if (contentRef.current) {
      const element = contentRef.current.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
      if (element) {
        element.style.opacity = '0.7';
      }
    }
  }, [contentRef]);

  /**
   * Creates a new element from template and adds it to the canvas
   */
  const createNewElement = useCallback((elementType: string): boolean => {
    const template = elementLibrary.find(el => el.id === elementType)?.template;
    
    if (!template || !contentRef.current) {
      return false;
    }

    const uniqueId = generateElementId();

    // Create new element from template
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = template;
    const newElement = tempDiv.firstElementChild as HTMLElement;

    if (!newElement) return false;

    // Set the data-element-id attribute directly
    newElement.setAttribute('data-element-id', uniqueId);

    // Apply builder styling to make it selectable
    applyBuilderStyling(newElement);

    // Check if this is the first element
    const existingElements = contentRef.current.querySelectorAll('[data-element-id]');
    
    if (existingElements.length === 0 || contentRef.current.innerHTML.includes('Start Building Your Layout')) {
      // Replace placeholder content
      contentRef.current.innerHTML = '';
    }

    // Add to canvas
    contentRef.current.appendChild(newElement);

    // Update content using clean content saving (strips selection styling)
    saveCleanContent();
    
    // Refresh listeners after a short delay to ensure DOM is updated
    setTimeout(() => {
      onRefreshListeners();
      onElementSelect(uniqueId);
    }, 50);

    return true;
  }, [elementLibrary, contentRef, onContentUpdate, onElementSelect, onRefreshListeners, saveCleanContent]);

  /**
   * Finds the element to insert before based on drop position
   */
  const findInsertPosition = useCallback((e: React.DragEvent): HTMLElement | null => {
    if (!contentRef.current) return null;

    const allElements = Array.from(contentRef.current.querySelectorAll('[data-element-id]')) as HTMLElement[];
    const dropY = e.clientY;

    // Find the element closest to the drop position
    let insertBefore: HTMLElement | null = null;
    let minDistance = Infinity;

    allElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementMiddle = rect.top + rect.height / 2;
      const distance = Math.abs(dropY - elementMiddle);

      if (distance < minDistance) {
        minDistance = distance;
        // If dropping in the top half of an element, insert before it
        // If dropping in the bottom half, insert after it (null means end)
        insertBefore = dropY < elementMiddle ? element : null;
      }
    });

    return insertBefore;
  }, [contentRef]);

  /**
   * Handles reordering of existing elements with proper positioning
   */
  const reorderElement = useCallback((elementId: string, insertBefore?: HTMLElement | null): boolean => {
    if (!contentRef.current) {
      console.warn('No content ref available for reordering');
      return false;
    }

    const element = contentRef.current.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
    
    if (!element) {
      console.warn('Element not found for reordering:', elementId);
      return false;
    }

    // Don't move if it's the same position
    if (insertBefore === element.nextElementSibling) {
      console.log('Element already in correct position');
      return false;
    }

    // Reset any drag styling and clean up selection styling
    element.style.opacity = '1';
    element.style.removeProperty('outline');
    element.style.removeProperty('outline-offset');
    element.style.removeProperty('box-shadow');
    
    // Remove from current position
    element.remove();
    
    // Insert at the new position
    if (insertBefore) {
      contentRef.current.insertBefore(element, insertBefore);
    } else {
      contentRef.current.appendChild(element);
    }

    // Apply builder styling to ensure it remains interactive
    applyBuilderStyling(element);

    // Immediately save content and refresh listeners
    saveCleanContent();
    
    // Immediately refresh listeners and then select the element
    onRefreshListeners();
    
    // Use a small delay for selection to ensure listeners are attached
    setTimeout(() => {
      onElementSelect(elementId);
    }, 50);

    return true;
  }, [contentRef, onRefreshListeners, onElementSelect, saveCleanContent]);

  /**
   * Creates a new image element and adds it to the canvas
   */
  const createImageElement = useCallback((imageUrl: string): boolean => {
    if (!contentRef.current) return false;

    const uniqueId = generateElementId();

    // Create image element with proper styling
    const figure = document.createElement('figure');
    figure.setAttribute('data-element-id', uniqueId);
    figure.style.cssText = 'margin: 24px 0; text-align: center;';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Uploaded image';
    img.style.cssText = 'max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);';

    const figcaption = document.createElement('figcaption');
    figcaption.style.cssText = 'margin-top: 8px; font-size: 14px; color: #64748b; font-style: italic;';
    figcaption.textContent = 'Image caption goes here';

    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Apply builder styling to make it selectable
    applyBuilderStyling(figure);

    // Check if this is the first element
    const existingElements = contentRef.current.querySelectorAll('[data-element-id]');
    
    if (existingElements.length === 0 || contentRef.current.innerHTML.includes('Start Building Your Layout')) {
      // Replace placeholder content
      contentRef.current.innerHTML = '';
    }

    // Add to canvas
    contentRef.current.appendChild(figure);

    // Update content using clean content saving (strips selection styling)
    saveCleanContent();
    
    // Refresh listeners after a short delay to ensure DOM is updated
    setTimeout(() => {
      onRefreshListeners();
      onElementSelect(uniqueId);
    }, 50);

    return true;
  }, [contentRef, onElementSelect, onRefreshListeners, saveCleanContent]);

  /**
   * Handles drop events on the canvas
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Clean up drop indicators
    if (contentRef.current) {
      const indicators = contentRef.current.querySelectorAll('.drop-indicator');
      indicators.forEach(indicator => indicator.remove());
    }
    
    const data = e.dataTransfer.getData('text/plain');
    
    // More robust checking for existing element reordering
    if (data && data.startsWith('existing:')) {
      // Handle reordering with position detection
      const elementId = data.replace('existing:', '');
      if (elementId) {
        const insertBefore = findInsertPosition(e);
        const success = reorderElement(elementId, insertBefore);
        if (!success) {
          console.warn('Failed to reorder element:', elementId);
        }
      }
    } else if (data) {
      // Check if it's an image (JSON format)
      if (data.startsWith('{') && data.includes('"type"') && data.includes('"image"')) {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'image' && parsedData.imageUrl) {
            createImageElement(parsedData.imageUrl);
          } else {
            // Fallback to treating as element type
            createNewElement(data);
          }
        } catch {
          // If JSON parsing fails, treat as element type
          createNewElement(data);
        }
      } else {
        // Handle new element from library (simple string)
        createNewElement(data);
      }
    }

    setDragState({
      draggedElementType: null,
      draggedElementId: null
    });
  }, [createNewElement, createImageElement, reorderElement, findInsertPosition, contentRef]);

  /**
   * Handles drag over events
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (dragState.draggedElementId) {
      e.dataTransfer.dropEffect = 'move';
      
      // Add visual drop indicator for reordering
      if (contentRef.current) {
        // Remove existing drop indicators
        const existingIndicators = contentRef.current.querySelectorAll('.drop-indicator');
        existingIndicators.forEach(indicator => indicator.remove());
        
        const insertBefore = findInsertPosition(e);
        
        // Create drop indicator line
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        indicator.style.cssText = `
          height: 2px;
          background: #f97316;
          margin: 4px 0;
          border-radius: 1px;
          position: relative;
          pointer-events: none;
          animation: pulse 1s infinite;
        `;
        
        // Insert the indicator at the correct position
        if (insertBefore) {
          contentRef.current.insertBefore(indicator, insertBefore);
        } else {
          contentRef.current.appendChild(indicator);
        }
      }
    } else {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [dragState.draggedElementId, contentRef, findInsertPosition]);

  /**
   * Handles drag end events
   */
  const handleDragEnd = useCallback(() => {
    // Reset visual feedback and ensure proper styling
    if (contentRef.current) {
      // Clean up drop indicators
      const indicators = contentRef.current.querySelectorAll('.drop-indicator');
      indicators.forEach(indicator => indicator.remove());
      
      const elements = contentRef.current.querySelectorAll('[data-element-id]') as NodeListOf<HTMLElement>;
      elements.forEach(element => {
        element.style.opacity = '1'; // Explicitly set to 1 instead of empty string
        // Reapply builder styling to ensure elements don't become gray
        applyBuilderStyling(element);
      });
    }

    setDragState({
      draggedElementType: null,
      draggedElementId: null
    });
  }, [contentRef]);

  return {
    dragState,
    handleDragStart,
    handleExistingElementDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnd
  };
} 