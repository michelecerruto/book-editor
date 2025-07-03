/**
 * Main Builder component
 * Orchestrates the entire page building experience using modular components
 */

'use client';

import React, { useRef, useState } from 'react';
import { 
  Type, 
  Heading1, 
  Heading2,
  Quote,
  List,
  Table2,
  Columns,
  Minus,
  SeparatorHorizontal,
  AlignLeft,
  BookOpen,
  Hash
} from 'lucide-react';

import { BuilderProps, ElementLibraryItem } from '@/types/builder';
import { BookSettings, DesignSettings } from '@/types/book';
import { useBuilderSelection } from '@/hooks/useBuilderSelection';
import { useBuilderDragDrop } from '@/hooks/useBuilderDragDrop';
import { useBuilderContent } from '@/hooks/useBuilderContent';
import { BuilderToolbar } from './BuilderToolbar';
import { BuilderSidebar } from './BuilderSidebar';
import { BuilderCanvas } from './BuilderCanvas';

/**
 * Element library configuration organized by sections
 */
const ELEMENT_LIBRARY: ElementLibraryItem[] = [
  // Typography Section
  {
    id: 'chapter-title',
    title: 'Chapter Title',
    icon: BookOpen,
    template: '<h1 style="color: #111827; font-weight: 800; font-size: 32px; margin: 32px 0 24px 0; line-height: 1.2; text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px;">Chapter Title</h1>'
  },
  {
    id: 'section-heading',
    title: 'Section Heading',
    icon: Heading1,
    template: '<h2 style="color: #1f2937; font-weight: 700; font-size: 24px; margin: 24px 0 16px 0; line-height: 1.3;">Section Heading</h2>'
  },
  {
    id: 'sub-heading',
    title: 'Sub Heading',
    icon: Heading2,
    template: '<h3 style="color: #374151; font-weight: 600; font-size: 20px; margin: 20px 0 12px 0; line-height: 1.4;">Sub Heading</h3>'
  },
  {
    id: 'paragraph',
    title: 'Paragraph',
    icon: Type,
    template: '<p style="color: #374151; line-height: 1.7; margin-bottom: 16px; font-size: 16px; text-align: justify;">Write your paragraph content here. This is the main body text for your book content with proper spacing and readability.</p>'
  },
  {
    id: 'quote',
    title: 'Quote',
    icon: Quote,
    template: '<blockquote style="border-left: 4px solid #f97316; padding: 20px 24px; margin: 24px 0; background: #f8fafc; font-style: italic; color: #475569; font-size: 18px; line-height: 1.6;">"Your inspiring quote or important excerpt goes here."<cite style="display: block; margin-top: 12px; font-style: normal; font-size: 14px; color: #64748b;">— Author Name</cite></blockquote>'
  },
  
  // Content Section
  {
    id: 'table',
    title: 'Table',
    icon: Table2,
    template: '<table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;"><thead><tr style="background: #f1f5f9;"><th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: 600;">Header 1</th><th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: 600;">Header 2</th></tr></thead><tbody><tr><td style="border: 1px solid #cbd5e1; padding: 12px;">Data 1</td><td style="border: 1px solid #cbd5e1; padding: 12px;">Data 2</td></tr><tr style="background: #f8fafc;"><td style="border: 1px solid #cbd5e1; padding: 12px;">Data 3</td><td style="border: 1px solid #cbd5e1; padding: 12px;">Data 4</td></tr></tbody></table>'
  },
  {
    id: 'list',
    title: 'List',
    icon: List,
    template: '<ul style="color: #374151; line-height: 1.6; margin: 16px 0; padding-left: 24px;"><li style="margin-bottom: 8px;">First important point</li><li style="margin-bottom: 8px;">Second key information</li><li style="margin-bottom: 8px;">Third essential detail</li></ul>'
  },
  {
    id: 'numbered-list',
    title: 'Numbered List',
    icon: Hash,
    template: '<ol style="color: #374151; line-height: 1.6; margin: 16px 0; padding-left: 24px;"><li style="margin-bottom: 8px;">First step or point</li><li style="margin-bottom: 8px;">Second step or point</li><li style="margin-bottom: 8px;">Third step or point</li></ol>'
  },
  
  // Layout Section
  {
    id: 'two-columns',
    title: 'Two Columns',
    icon: Columns,
    template: '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 24px 0; width: 100%;"><div style="padding: 16px; color: #374151; line-height: 1.6;">Left column content. This text will flow in the left column with proper spacing and formatting.</div><div style="padding: 16px; color: #374151; line-height: 1.6;">Right column content. This text will flow in the right column with matching formatting.</div></div>'
  },
  {
    id: 'page-break',
    title: 'Page Break',
    icon: SeparatorHorizontal,
    template: '<div style="page-break-after: always; border-top: 2px dashed #cbd5e1; margin: 48px 0; padding: 16px 0; text-align: center; color: #9ca3af; font-size: 14px;">• Page Break •</div>'
  },
  {
    id: 'section-break',
    title: 'Section Break',
    icon: Minus,
    template: '<div style="margin: 32px 0; text-align: center;"><hr style="border: none; border-top: 1px solid #d1d5db; width: 50%; margin: 0 auto;" /><div style="margin: 16px 0; color: #9ca3af; font-size: 24px;">• • •</div><hr style="border: none; border-top: 1px solid #d1d5db; width: 50%; margin: 0 auto;" /></div>'
  },
  {
    id: 'spacer',
    title: 'Spacer',
    icon: AlignLeft,
    template: '<div style="height: 48px; margin: 16px 0; background: transparent;"></div>'
  }
];

/**
 * Main Builder component
 * @param props - Component props
 * @returns Builder interface
 */
export function Builder({ 
  book, 
  currentPageIndex, 
  onSave, 
  onClose,
  onSwitchToEditor 
}: BuilderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const dragHandlerRef = useRef<((e: DragEvent, elementId: string) => void) | null>(null);

  // Default book settings if none exist
  const defaultBookSettings: BookSettings = {
    pageNumbers: {
      enabled: true,
      position: 'bottom-center',
      format: 'numeric',
      fontSize: 12,
      color: '#6b7280',
      prefix: '',
      suffix: ''
    },
    margins: {
      top: 32,
      bottom: 32,
      left: 32,
      right: 32
    },
    design: {
      typography: {
        fontFamily: 'system',
        baseFontSize: '16px',
        lineHeight: '1.6',
        paragraphSpacing: '16px'
      },
      layout: {
        pageWidth: '800px',
        pageMargins: '32px'
      },
      colors: {
        backgroundColor: '#ffffff',
        textColor: '#374151'
      },
      bookStyle: 'Academic'
    }
  };

  const [bookSettings, setBookSettings] = useState<BookSettings>(
    book.settings || defaultBookSettings
  );

  // Extract design settings from book settings
  const [designSettings, setDesignSettings] = useState<DesignSettings>(
    book.settings?.design || defaultBookSettings.design
  );

  // Custom hooks for state management
  const { selection, selectElement, clearSelection } = useBuilderSelection({
    contentRef
  });

  const { 
    updateContent,
    refreshListeners,
    updateElementStyle,
    updateElementContent,
    deleteElement
  } = useBuilderContent({
    book,
    currentPageIndex,
    contentRef,
    onSave,
    onElementSelect: selectElement,
    onExistingElementDragStart: (e, elementId) => {
      dragHandlerRef.current?.(e, elementId);
    }
  });

  const {
    dragState,
    handleDragStart,
    handleExistingElementDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnd
  } = useBuilderDragDrop({
    contentRef,
    elementLibrary: ELEMENT_LIBRARY,
    onContentUpdate: updateContent,
    onElementSelect: selectElement,
    onRefreshListeners: refreshListeners
  });

  // Store drag handler in ref
  dragHandlerRef.current = handleExistingElementDragStart;

  /**
   * Handles image drag start from images panel
   */
  const handleImageDragStart = (e: React.DragEvent, imageUrl: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'image',
      imageUrl: imageUrl
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  /**
   * Handles canvas click events - only for clearing selection when clicking empty space
   */
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    const target = e.target as HTMLElement;
    const elementWithId = target.closest('[data-element-id]') as HTMLElement;
    
    // Only clear selection if clicking on empty space (the canvas container itself)
    if (!elementWithId) {
      clearSelection();
    }
    // If clicking on an element, let the element's event listener handle it
  };

  /**
   * Toggles preview mode
   */
  const togglePreviewMode = () => {
    setIsPreviewMode(prev => !prev);
    clearSelection();
  };

  /**
   * Handles element deletion
   */
  const handleElementDelete = () => {
    deleteElement(selection.selectedElementId || undefined);
    clearSelection();
  };

  /**
   * Handles switching to editor mode
   */
  const handleSwitchToEditor = () => {
    clearSelection();
    onSwitchToEditor?.();
  };

  /**
   * Handles book settings updates
   */
  const handleBookSettingsUpdate = (newSettings: BookSettings) => {
    setBookSettings(newSettings);
    // Update the book object with new settings and save
    const updatedBook = {
      ...book,
      settings: newSettings
    };
    onSave(updatedBook);
  };

  /**
   * Handles design settings updates
   */
  const handleDesignSettingsUpdate = (newDesignSettings: DesignSettings) => {
    setDesignSettings(newDesignSettings);
    // Update book settings with new design settings
    const updatedBookSettings = {
      ...bookSettings,
      design: newDesignSettings
    };
    setBookSettings(updatedBookSettings);
    // Update the book object with new settings and save
    const updatedBook = {
      ...book,
      settings: updatedBookSettings
    };
    onSave(updatedBook);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Toolbar */}
      <BuilderToolbar
        isPreviewMode={isPreviewMode}
        currentPageIndex={currentPageIndex}
        totalPages={book.pages.length}
        onTogglePreview={togglePreviewMode}
        onSwitchToEditor={handleSwitchToEditor}
        onClose={onClose}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <BuilderSidebar
          isPreviewMode={isPreviewMode}
          elementLibrary={ELEMENT_LIBRARY}
          selectedElement={selection.selectedElement}
          bookSettings={bookSettings}
          designSettings={designSettings}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onContentUpdate={(content: string) => {
            updateElementContent(content, selection.selectedElementId || undefined);
          }}
          onStyleUpdate={(property: string, value: string) => {
            updateElementStyle(property, value, selection.selectedElementId || undefined);
          }}
          onElementDelete={handleElementDelete}
          onBookSettingsUpdate={handleBookSettingsUpdate}
          onDesignSettingsUpdate={handleDesignSettingsUpdate}
          onImageDragStart={handleImageDragStart}
        />

        {/* Canvas */}
        <BuilderCanvas
          contentRef={contentRef}
          isPreviewMode={isPreviewMode}
          dragState={dragState}
          elementLibrary={ELEMENT_LIBRARY}
          bookSettings={bookSettings}
          designSettings={designSettings}
          currentPageNumber={currentPageIndex + 1}
          selectedElement={selection.selectedElement}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          onContentUpdate={() => {
            // Update content from DOM after image resize
            if (contentRef.current) {
              updateContent(contentRef.current.innerHTML);
            }
          }}
        />
      </div>
    </div>
  );
} 