/**
 * Utility functions for Editor functionality
 */

/**
 * Checks if content contains Builder elements
 * @param content - HTML content to check
 * @returns True if content has Builder elements
 */
export function hasBuilderContent(content: string): boolean {
  return content.includes('data-element-id');
}

/**
 * Applies consistent text styling to all elements in a container
 * Ensures all text is properly visible and editable
 * @param container - The container element to style
 */
export function applyTextStyling(container: HTMLElement): void {
  const allElements = container.querySelectorAll('*');
  
  allElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      // Ensure all text is dark and visible
      element.style.color = '#111827';
      element.style.opacity = '1';
      
      // Remove problematic gray colors
      const grayColors = ['gray', '#6b7280', '#9ca3af', '#d1d5db'];
      if (grayColors.includes(element.style.color)) {
        element.style.color = '#111827';
      }
      
      // Ensure the element is editable (except the main container)
      if (element !== container) {
        element.setAttribute('contenteditable', 'true');
      }
    }
  });
}

/**
 * Safely sets HTML content while preserving Builder attributes
 * @param container - Target container element
 * @param content - HTML content to set
 */
export function setSafeHTMLContent(container: HTMLElement, content: string): void {
  if (hasBuilderContent(content)) {
    // For Builder content, preserve all attributes and structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Clear and rebuild to preserve structure
    container.innerHTML = '';
    while (tempDiv.firstChild) {
      container.appendChild(tempDiv.firstChild);
    }
  } else {
    // For regular content, simple innerHTML is sufficient
    container.innerHTML = content;
  }
}

/**
 * Executes a document command and returns the result
 * @param command - The command to execute
 * @param value - Optional value for the command
 * @returns The result of the command execution
 */
export function executeDocumentCommand(command: string, value?: string): boolean {
  return document.execCommand(command, false, value);
} 