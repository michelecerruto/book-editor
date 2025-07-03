/**
 * Element library component for Builder
 * Displays available elements that can be dragged onto the canvas
 */

import React from 'react';
import { ElementLibraryItem } from '@/types/builder';

interface BuilderElementLibraryProps {
  /** Array of available elements */
  elements: ElementLibraryItem[];
  /** Callback when drag starts */
  onDragStart: (e: React.DragEvent, elementType: string) => void;
  /** Callback when drag ends */
  onDragEnd: () => void;
}

/**
 * Renders the element library with draggable items
 * @param props - Component props
 * @returns Element library component
 */
export function BuilderElementLibrary({
  elements,
  onDragStart,
  onDragEnd
}: BuilderElementLibraryProps) {
  // Group elements by section
  const elementSections = [
    {
      title: 'Typography',
      elements: elements.filter(el => ['chapter-title', 'section-heading', 'sub-heading', 'paragraph', 'quote'].includes(el.id))
    },
    {
      title: 'Content',
      elements: elements.filter(el => ['table', 'list', 'numbered-list'].includes(el.id))
    },
    {
      title: 'Layout',
      elements: elements.filter(el => ['two-columns', 'page-break', 'section-break', 'spacer'].includes(el.id))
    }
  ];

  return (
    <div className="p-4">
      <div className="space-y-6">
        {elementSections.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              {section.title}
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {section.elements.map((element) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, element.id)}
                  onDragEnd={onDragEnd}
                  className="flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors cursor-move group"
                  title={`Drag to add ${element.title}`}
                >
                  <element.icon className="w-5 h-5 text-gray-800 group-hover:text-orange-600 transition-colors flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-700 transition-colors">
                    {element.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 