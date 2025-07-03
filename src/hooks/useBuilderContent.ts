/**
 * Custom hook for managing content in Builder
 */

import { useState, useCallback, useEffect, useRef, RefObject } from 'react';
import { Book } from '@/types/book';
import { processContentForBuilder, applyBuilderStyling } from '@/utils/builderUtils';

interface UseBuilderContentProps {
  /** Current book being edited */
  book: Book;
  /** Index of the current page */
  currentPageIndex: number;
  /** Reference to the content container */
  contentRef: RefObject<HTMLElement | null>;
  /** Callback when book is saved */
  onSave: (book: Book) => void;
  /** Callback when an element is selected */
  onElementSelect: (elementId: string) => void;
  /** Callback when existing element drag starts */
  onExistingElementDragStart?: (e: DragEvent, elementId: string) => void;
}

interface UseBuilderContentReturn {
  /** Current page content */
  pageContent: string;
  /** Update page content */
  updateContent: (content: string) => void;
  /** Attach event listeners to all elements */
  attachEventListeners: () => void;
  /** Refresh event listeners (for manual content changes) */
  refreshListeners: () => void;
  /** Update element styles */
  updateElementStyle: (property: string, value: string, elementId?: string) => void;
  /** Update element content */
  updateElementContent: (content: string, elementId?: string) => void;
  /** Delete an element */
  deleteElement: (elementId?: string) => void;
}

/**
 * Hook for managing content in Builder
 * @param props - Hook configuration
 * @returns Content state and management functions
 */
export function useBuilderContent({
  book,
  currentPageIndex,
  contentRef,
  onSave,
  onElementSelect,
  onExistingElementDragStart
}: UseBuilderContentProps): UseBuilderContentReturn {
  const [pageContent, setPageContent] = useState('');
  
  // Flag to prevent feedback loop when updating content from within builder
  const isUpdatingFromBuilderRef = useRef(false);

  // Get current page
  const currentPage = book.pages[currentPageIndex] || { title: '', content: '' };

  // Use refs to stabilize callback dependencies
  const onElementSelectRef = useRef(onElementSelect);
  const onExistingElementDragStartRef = useRef(onExistingElementDragStart);
  
  // Update refs when callbacks change
  useEffect(() => {
    onElementSelectRef.current = onElementSelect;
  }, [onElementSelect]);
  
  useEffect(() => {
    onExistingElementDragStartRef.current = onExistingElementDragStart;
  }, [onExistingElementDragStart]);

  /**
   * Removes all event listeners from elements by cloning them
   */
  const removeAllEventListeners = useCallback(() => {
    if (!contentRef.current) return;
    
    const elements = contentRef.current.querySelectorAll('[data-element-id]');
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Preserve important styling before cloning
      const importantStyles = {
        opacity: htmlElement.style.opacity,
        outline: htmlElement.style.outline,
        outlineOffset: htmlElement.style.outlineOffset,
        boxShadow: htmlElement.style.boxShadow
      };
      
      const newElement = htmlElement.cloneNode(true) as HTMLElement;
      
      // Restore important styling after cloning
      Object.entries(importantStyles).forEach(([property, value]) => {
        if (value) {
          // Convert camelCase to kebab-case for CSS properties
          const cssProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          newElement.style.setProperty(cssProperty, value);
        }
      });
      
      htmlElement.parentNode?.replaceChild(newElement, htmlElement);
    });
  }, [contentRef]);

  /**
   * Attaches event listeners to all elements in the content
   */
  const attachEventListeners = useCallback(() => {
    if (!contentRef.current) {
      return;
    }

    const elements = contentRef.current.querySelectorAll('[data-element-id]');
    
    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const elementId = htmlElement.getAttribute('data-element-id');
      
      if (!elementId) {
        return;
      }
      
      // Apply builder styling
      applyBuilderStyling(htmlElement);
      
      // Click handler for selection - using capture to ensure we get the event first
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        onElementSelectRef.current(elementId);
      };
      
      // Hover effects
      const handleMouseEnter = () => {
        if (!htmlElement.style.outline.includes('solid')) {
          htmlElement.style.outline = '1px dashed #f97316';
          htmlElement.style.outlineOffset = '1px';
        }
      };
      
      const handleMouseLeave = () => {
        if (htmlElement.style.outline.includes('dashed')) {
          htmlElement.style.outline = 'none';
        }
      };
      
      // Add all event listeners with capture for click
      htmlElement.addEventListener('click', handleClick as EventListener, { capture: true, passive: false });
      htmlElement.addEventListener('mouseenter', handleMouseEnter);
      htmlElement.addEventListener('mouseleave', handleMouseLeave);
      
      // Drag and drop
      if (onExistingElementDragStartRef.current) {
        const handleDragStart = (e: DragEvent) => {
          onExistingElementDragStartRef.current?.(e, elementId);
        };
        htmlElement.draggable = true;
        htmlElement.addEventListener('dragstart', handleDragStart);
      }
    });
  }, [contentRef]);

  /**
   * Updates content and saves to book
   */
  const updateContent = useCallback((content: string) => {
    setPageContent(content);
    
    // Mark that we're updating from within the builder
    isUpdatingFromBuilderRef.current = true;
    
    const updatedPages = book.pages.map((page, index) => 
      index === currentPageIndex 
        ? { ...page, content }
        : page
    );
    
    const updatedBook = { ...book, pages: updatedPages };
    onSave(updatedBook);
    
    // Reset the flag after a short delay to allow the update to propagate
    setTimeout(() => {
      isUpdatingFromBuilderRef.current = false;
    }, 50);
  }, [book, currentPageIndex, onSave]);

  /**
   * Updates content from current DOM and saves
   */
  const updateContentFromDOM = useCallback(() => {
    if (contentRef.current) {
      // Create a temporary clone to clean up selection styling before saving
      const tempContainer = contentRef.current.cloneNode(true) as HTMLElement;
      
      // Remove selection styling from all elements in the clone
      const elementsWithSelection = tempContainer.querySelectorAll('[data-element-id]');
      elementsWithSelection.forEach(element => {
        const htmlElement = element as HTMLElement;
        // Remove selection styling properties
        htmlElement.style.removeProperty('outline');
        htmlElement.style.removeProperty('outline-offset');
        htmlElement.style.removeProperty('box-shadow');
        // Keep other styling intact
      });
      
      const newContent = tempContainer.innerHTML;
      updateContent(newContent);
    }
  }, [contentRef, updateContent]);



  /**
   * Updates an element's style property
   */
  const updateElementStyle = useCallback((
    property: string,
    value: string,
    elementId?: string
  ) => {
    if (!contentRef.current) return;
    
    const targetElement = elementId 
      ? contentRef.current.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement
      : contentRef.current.querySelector('[style*="outline: 2px solid rgb(249, 115, 22)"], [style*="outline: 2px solid #f97316"]') as HTMLElement;
    
    if (targetElement) {
      // Convert camelCase to kebab-case for CSS properties
      const cssProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      
      targetElement.style.setProperty(cssProperty, value);
      
      // Update content without triggering full DOM refresh
      // This avoids the feedback loop that breaks styling
      if (contentRef.current) {
        // Create a temporary clone to clean up selection styling before saving
        const tempContainer = contentRef.current.cloneNode(true) as HTMLElement;
        
        // Remove selection styling from all elements in the clone
        const elementsWithSelection = tempContainer.querySelectorAll('[data-element-id]');
        elementsWithSelection.forEach(element => {
          const htmlElement = element as HTMLElement;
          // Remove selection styling properties
          htmlElement.style.removeProperty('outline');
          htmlElement.style.removeProperty('outline-offset');
          htmlElement.style.removeProperty('box-shadow');
          // Keep other styling intact
        });
        
        const newContent = tempContainer.innerHTML;
        
        // Mark that we're updating from within the builder
        isUpdatingFromBuilderRef.current = true;
        
        const updatedPages = book.pages.map((page, index) => 
          index === currentPageIndex 
            ? { ...page, content: newContent }
            : page
        );
        
        const updatedBook = { ...book, pages: updatedPages };
        onSave(updatedBook);
        
        // Reset the flag after a short delay
        setTimeout(() => {
          isUpdatingFromBuilderRef.current = false;
        }, 50);
      }
    }
  }, [contentRef, book, currentPageIndex, onSave]);

  /**
   * Updates an element's content
   */
  const updateElementContent = useCallback((
    content: string,
    elementId?: string
  ) => {
    if (!contentRef.current) return;
    
    const targetElement = elementId 
      ? contentRef.current.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement
      : contentRef.current.querySelector('[style*="outline: 2px solid rgb(249, 115, 22)"], [style*="outline: 2px solid #f97316"]') as HTMLElement;
    
    if (!targetElement) {
      return;
    }
    
    if (targetElement.tagName === 'IMG') {
      targetElement.setAttribute('src', content);
    } else {
      // For text elements, always use innerHTML to support rich text formatting
      if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(targetElement.tagName)) {
        targetElement.innerHTML = content;
      } else {
        // For other elements, check if content contains HTML tags
        if (content.includes('<') && content.includes('>')) {
          targetElement.innerHTML = content;
        } else {
          targetElement.textContent = content;
        }
      }
    }
    
    updateContentFromDOM();
  }, [contentRef, updateContentFromDOM]);

  /**
   * Deletes an element
   */
  const deleteElement = useCallback((elementId?: string) => {
    if (!contentRef.current) return;
    
    const targetElement = elementId 
      ? contentRef.current.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement
      : contentRef.current.querySelector('[style*="outline: 2px solid rgb(249, 115, 22)"], [style*="outline: 2px solid #f97316"]') as HTMLElement;
    
    if (targetElement) {
      targetElement.remove();
      updateContentFromDOM();
    }
  }, [contentRef, updateContentFromDOM]);

  // Initialize content when page changes
  useEffect(() => {
    // Skip reprocessing if this update is coming from within the builder
    if (isUpdatingFromBuilderRef.current) {
      return;
    }
    let contentToProcess = currentPage.content || '';
    
    // If content is empty, add some default elements to get started
    if (!contentToProcess.trim()) {
      contentToProcess = `
        <h1 data-element-id="default-title" style="color: #111827; font-weight: 800; font-size: 32px; margin: 32px 0 24px 0; line-height: 1.2; text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px;">Chapter Title</h1>
        <p data-element-id="default-paragraph" style="color: #374151; line-height: 1.7; margin-bottom: 16px; font-size: 16px; text-align: justify;">Start writing your content here. You can click on any element to select it, then use the sidebar to edit properties or drag new elements from the library.</p>
      `.trim();
    }
    
    const processed = processContentForBuilder(contentToProcess);
    setPageContent(processed.html);
    
    // Update DOM and attach listeners
    setTimeout(() => {
      if (contentRef.current && processed.html) {
        contentRef.current.innerHTML = processed.html;
        attachEventListeners();
      }
    }, 100);
  }, [currentPage.content, contentRef, attachEventListeners]);

  // Process DOM content to add missing element IDs when content changes
  const processExistingDOMContent = useCallback(() => {
    if (!contentRef.current) return false;

    const allElements = contentRef.current.querySelectorAll('*');
    let addedIds = 0;
    
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Skip script, style, meta, etc.
      if (['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE', 'BR'].includes(htmlElement.tagName)) {
        return;
      }
      
      // Skip if already has data-element-id
      if (htmlElement.hasAttribute('data-element-id')) {
        return;
      }
      
      // Skip if it's a nested element inside another element with data-element-id
      const parentWithId = htmlElement.closest('[data-element-id]');
      if (parentWithId && parentWithId !== htmlElement) {
        return;
      }
      
      // Add element ID for block elements and important inline elements
      const isBlockElement = ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'TABLE', 'FIGURE', 'IMG'].includes(htmlElement.tagName);
      const hasContent = htmlElement.textContent?.trim() || htmlElement.tagName === 'IMG';
      
      if (isBlockElement && hasContent) {
        const elementId = `manual-${htmlElement.tagName.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        htmlElement.setAttribute('data-element-id', elementId);
        addedIds++;
      }
    });
    
    return addedIds > 0;
  }, [contentRef]);

  // Manual function to refresh listeners (called by external events like typing)
  const refreshListeners = useCallback(() => {
    if (!contentRef.current) return;
    
    // Process any new elements that need IDs
    processExistingDOMContent();
    // Clear and re-attach event listeners
    removeAllEventListeners();
    attachEventListeners();
  }, [processExistingDOMContent, removeAllEventListeners, attachEventListeners]);

  // Process content when builder is accessed (to handle editor-added content)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current && processExistingDOMContent()) {
        // If we added IDs to existing elements, refresh listeners
        attachEventListeners();
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [contentRef, processExistingDOMContent, attachEventListeners]);



  return {
    pageContent,
    updateContent,
    attachEventListeners,
    refreshListeners,
    updateElementStyle,
    updateElementContent,
    deleteElement
  };
} 