/**
 * Utility functions for Builder functionality
 */

import { ProcessedContent } from '@/types/builder';

/**
 * Generates a unique element ID for Builder elements
 * @param prefix - Prefix for the ID (e.g., 'element', 'imported')
 * @param tagName - HTML tag name (optional)
 * @returns Unique element ID
 */
export function generateElementId(prefix: string = 'element', tagName?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const tag = tagName ? `-${tagName.toLowerCase()}` : '';
  return `${prefix}${tag}-${timestamp}-${random}`;
}

/**
 * Checks if content already has Builder elements
 * @param content - HTML content to check
 * @returns True if content has Builder elements
 */
export function hasBuilderElements(content: string): boolean {
  return content.includes('data-element-id');
}

/**
 * Applies basic Builder styling to an HTML element
 * @param element - HTML element to style
 * @param isImported - Whether this is imported content
 */
export function applyBuilderStyling(element: HTMLElement, isImported: boolean = false): void {
  element.style.cursor = 'pointer';
  element.style.minHeight = '20px';
  element.style.position = 'relative';
  
  // Ensure proper color for visibility - be more aggressive about fixing gray text
  const currentColor = element.style.color || window.getComputedStyle(element).color;
  if (!element.style.color || currentColor === 'gray' || currentColor === 'rgb(128, 128, 128)' || currentColor === '#808080') {
    element.style.color = '#1f2937';
  }
  
  // Ensure opacity is full
  if (element.style.opacity && element.style.opacity !== '1') {
    element.style.opacity = '1';
  }
  
  if (isImported) {
    element.style.padding = element.style.padding || '10px';
    element.style.margin = element.style.margin || '10px 0';
    element.style.border = element.style.border || '1px dashed transparent';
    element.style.borderRadius = '4px';
  }
}

/**
 * Processes a single HTML element for Builder compatibility
 * @param element - Element to process
 */
function processElementForBuilder(element: Element): void {
  if (element.nodeType !== Node.ELEMENT_NODE) return;
  
  const htmlElement = element as HTMLElement;
  
  // Skip non-visual elements
  if (['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE', 'BR'].includes(htmlElement.tagName)) {
    return;
  }
  
  // Skip if already processed
  if (htmlElement.getAttribute('data-element-id')) {
    return;
  }
  
  // Generate and set unique ID
  const uniqueId = generateElementId('imported', htmlElement.tagName);
  htmlElement.setAttribute('data-element-id', uniqueId);
  
  // Apply Builder styling
  applyBuilderStyling(htmlElement, true);
  
  // Process child elements recursively
  Array.from(htmlElement.children).forEach(processElementForBuilder);
}

/**
 * Processes content to make it compatible with Builder
 * @param content - Raw HTML content
 * @returns Processed content result
 */
export function processContentForBuilder(content: string): ProcessedContent {
  if (!content?.trim()) {
    return {
      html: '<div style="padding: 40px; text-align: center; color: #6b7280; font-style: italic;">Start building your layout by dragging elements from the sidebar</div>',
      wasAlreadyProcessed: false,
      elementCount: 0
    };
  }
  
  if (hasBuilderElements(content)) {
    const elementCount = (content.match(/data-element-id/g) || []).length;
    return {
      html: content,
      wasAlreadyProcessed: true,
      elementCount
    };
  }
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Handle mixed content with text nodes and inline elements
  const hasOnlyTextAndInlineElements = !tempDiv.querySelector('div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, blockquote, table, figure');
  
  if (hasOnlyTextAndInlineElements) {
    // Check if we have meaningful content (including spaces and formatting)
    const hasContent = (tempDiv.textContent?.length || 0) > 0 || tempDiv.innerHTML.includes('<');
    
    if (hasContent) {
      // Preserve the original content structure including spaces and formatting
      const wrapper = document.createElement('div');
      wrapper.innerHTML = content;
      wrapper.setAttribute('data-element-id', generateElementId('imported-content'));
      applyBuilderStyling(wrapper, true);
      
      return {
        html: wrapper.outerHTML,
        wasAlreadyProcessed: false,
        elementCount: 1
      };
    }
  }
  
  // Process all child elements
  Array.from(tempDiv.children).forEach(processElementForBuilder);
  
  const elementCount = tempDiv.querySelectorAll('[data-element-id]').length;
  
  return {
    html: tempDiv.innerHTML,
    wasAlreadyProcessed: false,
    elementCount
  };
}

/**
 * Applies visual selection styling to an element
 * @param element - Element to apply selection styling to
 */
export function applySelectionStyling(element: HTMLElement): void {
  element.style.outline = '2px solid #f97316';
  element.style.outlineOffset = '2px';
  element.style.boxShadow = '0 0 0 4px rgba(249, 115, 22, 0.1)';
  
  // Add resize handles for images
  const isImage = element.tagName === 'IMG' || element.querySelector('img') !== null;
  if (isImage) {
    addImageResizeHandles(element);
  }
}

/**
 * Adds resize handles to an image element
 * @param element - Image element or figure containing image
 */
function addImageResizeHandles(element: HTMLElement): void {
  // Remove any existing resize handles first
  removeImageResizeHandles(element);
  
  // Ensure the element has relative positioning for absolute positioned handles
  const originalPosition = element.style.position;
  if (!originalPosition || originalPosition === 'static') {
    element.style.position = 'relative';
  }
  
  // Create resize handles
  const handles = [
    { position: 'nw', cursor: 'nw-resize', top: '-6px', left: '-6px' },
    { position: 'ne', cursor: 'ne-resize', top: '-6px', right: '-6px' },
    { position: 'sw', cursor: 'sw-resize', bottom: '-6px', left: '-6px' },
    { position: 'se', cursor: 'se-resize', bottom: '-6px', right: '-6px' }
  ];
  
  handles.forEach(handle => {
    const handleElement = document.createElement('div');
    handleElement.className = 'image-resize-handle';
    handleElement.dataset.handle = handle.position;
    
    // Style the handle
    handleElement.style.cssText = `
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: #f97316;
      border: 2px solid white;
      border-radius: 50%;
      cursor: ${handle.cursor};
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      pointer-events: auto;
      ${handle.top ? `top: ${handle.top};` : ''}
      ${handle.bottom ? `bottom: ${handle.bottom};` : ''}
      ${handle.left ? `left: ${handle.left};` : ''}
      ${handle.right ? `right: ${handle.right};` : ''}
    `;
    
    // Add mouse down handler for resizing
    handleElement.addEventListener('mousedown', (e) => {
      handleImageResize(e, element, handle.position);
    });
    
    element.appendChild(handleElement);
  });
}

/**
 * Removes resize handles from an image element
 * @param element - Image element or figure containing image
 */
function removeImageResizeHandles(element: HTMLElement): void {
  const handles = element.querySelectorAll('.image-resize-handle');
  handles.forEach(handle => handle.remove());
}

/**
 * Handles image resizing when dragging resize handles
 * @param e - Mouse event
 * @param element - Image element or figure containing image
 * @param handle - Handle position being dragged
 */
function handleImageResize(e: MouseEvent, element: HTMLElement, handle: string): void {
  e.preventDefault();
  e.stopPropagation();
  
  const imgElement = element.tagName === 'IMG' ? element as HTMLImageElement : element.querySelector('img');
  if (!imgElement) return;
  
  const startMousePos = { x: e.clientX, y: e.clientY };
  const startSize = {
    width: imgElement.offsetWidth,
    height: imgElement.offsetHeight
  };
  
  // Prevent text selection during drag
  document.body.style.userSelect = 'none';
  
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startMousePos.x;
    const deltaY = moveEvent.clientY - startMousePos.y;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    
    // Calculate new dimensions based on which handle is being dragged
    switch (handle) {
      case 'se': // Southeast (bottom-right)
        newWidth = startSize.width + deltaX;
        newHeight = startSize.height + deltaY;
        break;
      case 'sw': // Southwest (bottom-left)
        newWidth = startSize.width - deltaX;
        newHeight = startSize.height + deltaY;
        break;
      case 'ne': // Northeast (top-right)
        newWidth = startSize.width + deltaX;
        newHeight = startSize.height - deltaY;
        break;
      case 'nw': // Northwest (top-left)
        newWidth = startSize.width - deltaX;
        newHeight = startSize.height - deltaY;
        break;
    }
    
    // Enforce minimum size
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);
    
    // Apply the new size
    imgElement.style.width = `${newWidth}px`;
    imgElement.style.height = `${newHeight}px`;
    imgElement.style.objectFit = 'cover';
    
    // If it's inside a figure, update the figure too
    if (element.tagName === 'FIGURE') {
      element.style.width = `${newWidth}px`;
    }
  };
  
  const handleMouseUp = () => {
    // Restore text selection
    document.body.style.userSelect = '';
    
    // Remove global listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Trigger a custom event to notify that resizing is complete
    const resizeEvent = new CustomEvent('imageResized', {
      detail: { element, width: imgElement.offsetWidth, height: imgElement.offsetHeight }
    });
    element.dispatchEvent(resizeEvent);
  };
  
  // Add global mouse listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Removes visual selection styling from an element
 * @param element - Element to remove selection styling from
 */
export function removeSelectionStyling(element: HTMLElement): void {
  element.style.outline = 'none';
  element.style.boxShadow = 'none';
  element.style.outlineOffset = '0px';
  
  // Remove resize handles for images
  const isImage = element.tagName === 'IMG' || element.querySelector('img') !== null;
  if (isImage) {
    removeImageResizeHandles(element);
  }
}

/**
 * Removes selection styling from all elements in a container
 * @param container - Container element to clear selections from
 */
export function clearAllSelections(container: HTMLElement): void {
  const allElements = container.querySelectorAll('[data-element-id]');
  allElements.forEach(el => removeSelectionStyling(el as HTMLElement));
}

/**
 * Gets the editable content from an element based on its type
 * @param element - HTML element to get content from
 * @returns Editable content string
 */
export function getElementEditableContent(element: HTMLElement): string {
  if (element.tagName === 'IMG') {
    return element.getAttribute('src') || '';
  }
  
  // For imported elements, handle different content types
  if (element.getAttribute('data-element-id')?.startsWith('imported-')) {
    // Simplified logic: prioritize textContent for simple text elements
    const textContent = element.textContent?.trim() || '';
    const innerHTML = element.innerHTML?.trim() || '';
    
    // If it's simple text content without children, use textContent
    if (element.children.length === 0 && textContent) {
      return textContent;
    }
    
    // If it has simple HTML content (like formatted text), use innerHTML
    if (element.children.length > 0 && innerHTML.length < 500) {
      return innerHTML;
    }
    
    // Fallback to textContent
    return textContent;
  }
  
  // For Builder elements, return text content
  return element.textContent || '';
} 