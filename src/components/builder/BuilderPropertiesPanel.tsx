/**
 * Properties panel component for editing selected elements
 */

import React from 'react';
import { Settings, AlignLeft, AlignCenter, AlignRight, Trash2, Bold, Italic, Underline } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuilderPropertiesPanelProps {
  /** Currently selected element */
  selectedElement: HTMLElement | null;
  /** Callback when element content is updated */
  onContentUpdate: (content: string) => void;
  /** Callback when element style is updated */
  onStyleUpdate: (property: string, value: string) => void;
  /** Callback when element is deleted */
  onDelete: () => void;
}

/**
 * Renders the properties panel for editing selected elements
 * @param props - Component props
 * @returns Properties panel component
 */
export function BuilderPropertiesPanel({
  selectedElement,
  onContentUpdate,
  onStyleUpdate,
  onDelete
}: BuilderPropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
              <Settings className="w-10 h-10 text-orange-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              No Element Selected
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Click on any element in the canvas to start editing its properties and content
            </p>
          </div>
          <div className="mt-6 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-700 font-medium">
              💡 Tip: Try selecting text, images, or other elements
            </p>
          </div>
        </div>
      </div>
    );
  }

  const elementId = selectedElement.getAttribute('data-element-id');
  const isImported = elementId?.startsWith('imported-');
  const isImage = selectedElement.tagName === 'IMG' || selectedElement.querySelector('img') !== null;
  
  // Get computed styles to read actual rendered values
  const computedStyle = window.getComputedStyle(selectedElement);
  
  // Helper function to get current style value (inline or computed)
  const getCurrentStyleValue = (property: string): string => {
    return selectedElement.style.getPropertyValue(property) || computedStyle.getPropertyValue(property);
  };

  // Helper functions for rich text formatting
  const getTextContent = (): string => {
    // For rich text elements, return the text content without HTML tags
    return selectedElement.textContent || '';
  };

  const hasFormatting = (tag: string): boolean => {
    const content = selectedElement.innerHTML;
    const lowerTag = tag.toLowerCase();
    // Check for the tag in any form (standalone or nested)
    return content.includes(`<${lowerTag}>`) || content.includes(`<${lowerTag.toUpperCase()}>`);
  };

  const getCurrentFormattingState = () => {
    const content = selectedElement.innerHTML;
    return {
      bold: content.includes('<b>') || content.includes('<B>') || content.includes('<strong>'),
      italic: content.includes('<i>') || content.includes('<I>') || content.includes('<em>'),
      underline: content.includes('<u>') || content.includes('<U>')
    };
  };

  const applyFormattingToText = (text: string, formatting: { bold: boolean; italic: boolean; underline: boolean }) => {
    let result = text;
    
    if (formatting.bold) {
      result = `<b>${result}</b>`;
    }
    if (formatting.italic) {
      result = `<i>${result}</i>`;
    }
    if (formatting.underline) {
      result = `<u>${result}</u>`;
    }
    
    return result;
  };

  const toggleFormatting = (tag: string) => {
    const textContent = getTextContent();
    const currentFormatting = getCurrentFormattingState();
    const lowerTag = tag.toLowerCase();
    
    // Toggle the specific formatting
    if (lowerTag === 'b') {
      currentFormatting.bold = !currentFormatting.bold;
    } else if (lowerTag === 'i') {
      currentFormatting.italic = !currentFormatting.italic;
    } else if (lowerTag === 'u') {
      currentFormatting.underline = !currentFormatting.underline;
    }
    
    // Apply all active formatting to the clean text
    const newContent = applyFormattingToText(textContent, currentFormatting);
    
    // Call onContentUpdate to notify parent (which will handle innerHTML)
    onContentUpdate(newContent);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Element Properties
          {isImported && (
            <span className="text-xs text-blue-600 ml-2 bg-blue-50 px-2 py-1 rounded">
              Imported
            </span>
          )}
          {isImage && (
            <span className="text-xs text-green-600 ml-2 bg-green-50 px-2 py-1 rounded">
              Image
            </span>
          )}
        </h3>
        
        <div className="space-y-4">
          {/* Content Editor for Text Elements */}
          {!isImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={getTextContent()}
                onChange={(e) => {
                  // Get the plain text content
                  const newText = e.target.value;
                  
                  // Preserve existing formatting when text content changes
                  const currentFormatting = getCurrentFormattingState();
                  const formattedContent = applyFormattingToText(newText, currentFormatting);
                  
                  // Call onContentUpdate to notify parent (which will handle innerHTML)
                  onContentUpdate(formattedContent);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 resize-none"
                rows={3}
                placeholder={
                  selectedElement.tagName === 'DIV' 
                    ? 'Edit your text content here...' 
                    : 'Enter content...'
                }
              />
            </div>
          )}

          {/* Rich Text Formatting Controls */}
          {!isImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Formatting
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleFormatting('b')}
                  className={cn(
                    "flex-1 p-2 rounded-lg border transition-colors",
                    hasFormatting('b')
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  )}
                  title="Bold"
                >
                  <Bold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => toggleFormatting('i')}
                  className={cn(
                    "flex-1 p-2 rounded-lg border transition-colors",
                    hasFormatting('i')
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  )}
                  title="Italic"
                >
                  <Italic className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => toggleFormatting('u')}
                  className={cn(
                    "flex-1 p-2 rounded-lg border transition-colors",
                    hasFormatting('u')
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  )}
                  title="Underline"
                >
                  <Underline className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          )}

          {/* Image URL Editor for Image Elements */}
          {isImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={(() => {
                  // Get src from img element, whether it's the selected element or inside a figure
                  const imgElement = selectedElement.tagName === 'IMG' 
                    ? selectedElement 
                    : selectedElement.querySelector('img');
                  return imgElement?.getAttribute('src') || '';
                })()}
                onChange={(e) => {
                  // Update the src attribute of the img element
                  const imgElement = selectedElement.tagName === 'IMG' 
                    ? selectedElement 
                    : selectedElement.querySelector('img');
                  if (imgElement) {
                    imgElement.setAttribute('src', e.target.value);
                    // Trigger a content update to save changes
                    onContentUpdate(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {/* Image Caption Editor for Figure Elements */}
          {isImage && selectedElement.querySelector('figcaption') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Caption
              </label>
              <input
                type="text"
                value={(() => {
                  const figcaption = selectedElement.querySelector('figcaption');
                  return figcaption?.textContent || '';
                })()}
                onChange={(e) => {
                  const figcaption = selectedElement.querySelector('figcaption');
                  if (figcaption) {
                    figcaption.textContent = e.target.value;
                    // Trigger a content update to save changes
                    onContentUpdate(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                placeholder="Enter image caption..."
              />
            </div>
          )}

          {/* Font Size for Text Elements */}
          {!isImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size (px)
              </label>
              <input
                type="number"
                value={parseInt(getCurrentStyleValue('font-size')) || 16}
                onChange={(e) => onStyleUpdate('fontSize', `${e.target.value}px`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                min="8"
                max="72"
              />
            </div>
          )}

          {/* Text Alignment for Text Elements */}
          {!isImage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => {
                  const currentAlignment = getCurrentStyleValue('text-align') || 'left';
                  const isActive = currentAlignment === align || (currentAlignment === 'start' && align === 'left');
                  
                  return (
                    <button
                      key={align}
                      onClick={() => onStyleUpdate('textAlign', align)}
                      className={cn(
                        "flex-1 p-2 rounded-lg border transition-colors",
                        isActive
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      )}
                      title={`Align ${align}`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4 mx-auto" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4 mx-auto" />}
                      {align === 'right' && <AlignRight className="w-4 h-4 mx-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Margin/Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin (px)
            </label>
                          <input
              type="number"
              value={parseInt(getCurrentStyleValue('margin-top')) || 0}
              onChange={(e) => {
                const value = `${e.target.value}px`;
                onStyleUpdate('marginTop', value);
                onStyleUpdate('marginBottom', value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              min="0"
              max="100"
            />
          </div>

          {/* Padding for Elements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding (px)
            </label>
                          <input
              type="number"
              value={parseInt(getCurrentStyleValue('padding')) || 0}
              onChange={(e) => onStyleUpdate('padding', `${e.target.value}px`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              min="0"
              max="50"
            />
          </div>

          {/* Delete Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete selected element"
            >
              <Trash2 className="w-4 h-4" />
              Delete Element
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 