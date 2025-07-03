/**
 * Sidebar component for Builder
 * Contains the element library and properties panel
 */

import React, { useState, useRef, useCallback } from 'react';
import { BuilderElementLibrary } from './BuilderElementLibrary';
import { BuilderPropertiesPanel } from './BuilderPropertiesPanel';
import { BuilderBookPanel } from './BuilderBookPanel';
import { ElementLibraryItem } from '@/types/builder';
import { BookSettings } from '@/types/book';
import { Layers, Settings, Palette, BookOpen } from 'lucide-react';

interface BuilderSidebarProps {
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  /** Available elements for the library */
  elementLibrary: ElementLibraryItem[];
  /** Currently selected element */
  selectedElement: HTMLElement | null;
  /** Current book settings */
  bookSettings: BookSettings;
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
  onDragStart,
  onDragEnd,
  onContentUpdate,
  onStyleUpdate,
  onElementDelete,
  onBookSettingsUpdate
}: BuilderSidebarProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'properties' | 'design' | 'book'>('elements');
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

        {activeTab === 'properties' && (
          <BuilderPropertiesPanel
            selectedElement={selectedElement}
            onContentUpdate={onContentUpdate}
            onStyleUpdate={onStyleUpdate}
            onDelete={onElementDelete}
          />
        )}

        {activeTab === 'book' && (
          <BuilderBookPanel
            bookSettings={bookSettings}
            onSettingsUpdate={onBookSettingsUpdate}
          />
        )}

        {activeTab === 'design' && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4">
              <div className="space-y-6">
                {/* Typography Section */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Typography</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Font Family
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="system">System Default</option>
                        <option value="serif">Serif (Times, Georgia)</option>
                        <option value="sans">Sans Serif (Arial, Helvetica)</option>
                        <option value="crimson">Crimson Text (Book Serif)</option>
                        <option value="libre">Libre Baskerville</option>
                        <option value="playfair">Playfair Display</option>
                        <option value="inter">Inter (Modern Sans)</option>
                        <option value="lora">Lora (Reading Font)</option>
                        <option value="merriweather">Merriweather</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Font Size
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="14px">Small (14px)</option>
                        <option value="16px">Medium (16px)</option>
                        <option value="18px">Large (18px)</option>
                        <option value="20px">Extra Large (20px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Line Height
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="1.4">Tight (1.4)</option>
                        <option value="1.6">Normal (1.6)</option>
                        <option value="1.7">Relaxed (1.7)</option>
                        <option value="1.8">Loose (1.8)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paragraph Spacing
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="12px">Tight (12px)</option>
                        <option value="16px">Normal (16px)</option>
                        <option value="20px">Relaxed (20px)</option>
                        <option value="24px">Wide (24px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Layout Section */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Layout</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Width
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="full">Full Width</option>
                        <option value="1200px">Standard (1200px)</option>
                        <option value="800px">Book Width (800px)</option>
                        <option value="600px">Narrow (600px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Margins
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option value="32px">Narrow (32px)</option>
                        <option value="48px">Normal (48px)</option>
                        <option value="64px">Wide (64px)</option>
                        <option value="80px">Extra Wide (80px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Colors</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { color: '#ffffff', name: 'White' },
                          { color: '#fefefe', name: 'Off White' },
                          { color: '#f9fafb', name: 'Light Gray' },
                          { color: '#f3f4f6', name: 'Gray' }
                        ].map((bg) => (
                          <button
                            key={bg.color}
                            className="w-12 h-8 rounded border-2 border-gray-300 hover:border-orange-400 transition-colors"
                            style={{ backgroundColor: bg.color }}
                            title={bg.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { color: '#111827', name: 'Black' },
                          { color: '#1f2937', name: 'Dark Gray' },
                          { color: '#374151', name: 'Medium Gray' },
                          { color: '#4b5563', name: 'Light Gray' }
                        ].map((text) => (
                          <button
                            key={text.color}
                            className="w-12 h-8 rounded border-2 border-gray-300 hover:border-orange-400 transition-colors"
                            style={{ backgroundColor: text.color }}
                            title={text.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Styles */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Book Styles</h4>
                  
                  <div className="space-y-2">
                    {[
                      'Academic',
                      'Fiction Novel',
                      'Technical Manual',
                      'Poetry Collection',
                      'Children\'s Book',
                      'Magazine Layout'
                    ].map((style) => (
                      <button
                        key={style}
                        className="w-full px-3 py-2 text-left text-sm border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 