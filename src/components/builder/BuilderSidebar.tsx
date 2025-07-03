/**
 * Sidebar component for Builder
 * Contains the element library and properties panel
 */

import React, { useState, useRef, useCallback } from 'react';
import { BuilderElementLibrary } from './BuilderElementLibrary';
import { BuilderPropertiesPanel } from './BuilderPropertiesPanel';
import { BuilderBookSettingsPanel } from './BuilderBookSettingsPanel';
import { BuilderDesignSettingsPanel } from './BuilderDesignSettingsPanel';
import { BuilderImagesPanel } from './BuilderImagesPanel';
import { ElementLibraryItem } from '@/types/builder';
import { BookSettings, DesignSettings } from '@/types/book';
import { Layers, Settings, Palette, BookOpen, ImageIcon } from 'lucide-react';

interface BuilderSidebarProps {
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  /** Available elements for the library */
  elementLibrary: ElementLibraryItem[];
  /** Currently selected element */
  selectedElement: HTMLElement | null;
  /** Current book settings */
  bookSettings: BookSettings;
  /** Current design settings */
  designSettings: DesignSettings;
  /** Callback when drag starts from library */
  onDragStart: (e: React.DragEvent, elementType: string) => void;
  /** Callback when drag ends */
  onDragEnd: () => void;
  /** Callback when element content is updated */
  onContentUpdate: (content: string) => void;
  /** Callback when element style is updated */
  onStyleUpdate: (property: string, value: string) => void;
  /** Callback when element is deleted */
  onElementDelete: () => void;
  /** Callback when book settings are updated */
  onBookSettingsUpdate: (settings: BookSettings) => void;
  /** Callback when design settings are updated */
  onDesignSettingsUpdate: (settings: DesignSettings) => void;
  /** Callback when image drag starts from images panel */
  onImageDragStart: (e: React.DragEvent, imageUrl: string) => void;
}

/**
 * Renders the complete sidebar with element library and properties
 * @param props - Component props
 * @returns Sidebar component
 */
export function BuilderSidebar({
  isPreviewMode,
  elementLibrary,
  selectedElement,
  bookSettings,
  designSettings,
  onDragStart,
  onDragEnd,
  onContentUpdate,
  onStyleUpdate,
  onElementDelete,
  onBookSettingsUpdate,
  onDesignSettingsUpdate,
  onImageDragStart
}: BuilderSidebarProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'images' | 'properties' | 'design' | 'book'>('elements');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Automatically switch to properties tab when an element is selected
  React.useEffect(() => {
    if (selectedElement) {
      setActiveTab('properties');
    }
  }, [selectedElement]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !sidebarRef.current) return;
    
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const newWidth = e.clientX - sidebarRect.left;
    
    // Constrain width between 280px and 600px
    const constrainedWidth = Math.min(Math.max(newWidth, 280), 600);
    setSidebarWidth(constrainedWidth);
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleResize, stopResizing]);

  // Hide sidebar in preview mode
  if (isPreviewMode) {
    return null;
  }

  const tabs = [
    { id: 'elements' as const, label: 'Elements', icon: Layers },
    { id: 'images' as const, label: 'Images', icon: ImageIcon },
    { id: 'properties' as const, label: 'Properties', icon: Settings },
    { id: 'design' as const, label: 'Design', icon: Palette },
    { id: 'book' as const, label: 'Book', icon: BookOpen }
  ];

  return (
    <div 
      ref={sidebarRef}
      className="bg-white border-r border-gray-200 flex flex-col relative h-full"
      style={{ width: sidebarWidth }}
    >
      {/* Resize Handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-orange-300 cursor-col-resize z-10 transition-colors"
        onMouseDown={startResizing}
      />
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        {/* Icons Row */}
        <div className="flex">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={tab.label}
              >
                <IconComponent className="w-5 h-5" />
              </button>
            );
          })}
        </div>
        
        {/* Active Tab Label */}
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <h2 className="text-sm font-medium text-gray-900">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white flex flex-col min-h-0">
        {activeTab === 'elements' && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <BuilderElementLibrary
              elements={elementLibrary}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        )}

        {activeTab === 'images' && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <BuilderImagesPanel
              onImageDragStart={onImageDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        )}

        {activeTab === 'properties' && (
          <BuilderPropertiesPanel
            selectedElement={selectedElement}
            onContentUpdate={onContentUpdate}
            onStyleUpdate={onStyleUpdate}
            onDelete={onElementDelete}
          />
        )}

        {activeTab === 'design' && (
          <BuilderDesignSettingsPanel
            designSettings={designSettings}
            onSettingsUpdate={onDesignSettingsUpdate}
          />
        )}

        {activeTab === 'book' && (
          <BuilderBookSettingsPanel
            bookSettings={bookSettings}
            onSettingsUpdate={onBookSettingsUpdate}
          />
        )}
      </div>
    </div>
  );
} 