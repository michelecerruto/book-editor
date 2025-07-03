/**
 * Builder-specific TypeScript types for the book editor
 */

import { LucideIcon } from 'lucide-react';

/**
 * Represents an element in the Builder element library
 */
export interface ElementLibraryItem {
  /** Unique identifier for the element type */
  id: string;
  /** Display name for the element */
  title: string;
  /** Icon component from Lucide React */
  icon: LucideIcon;
  /** HTML template for the element */
  template: string;
}

/**
 * Element selection state and management
 */
export interface ElementSelection {
  /** Currently selected element ID */
  selectedElementId: string | null;
  /** DOM element that is currently selected */
  selectedElement: HTMLElement | null;
}

/**
 * Drag and drop state for elements
 */
export interface DragDropState {
  /** Element type being dragged from library */
  draggedElementType: string | null;
  /** Existing element ID being dragged for reordering */
  draggedElementId: string | null;
}

/**
 * Element style properties that can be updated
 */
export interface ElementStyleUpdate {
  property: string;
  value: string;
}

/**
 * Builder configuration
 */
export interface BuilderConfig {
  /** Whether the builder is in preview mode */
  isPreviewMode: boolean;
  /** Whether to show debug information */
  debugMode: boolean;
}

/**
 * Props for the main Builder component
 */
export interface BuilderProps {
  /** The book being edited */
  book: import('@/types/book').Book;
  /** Index of the current page being edited */
  currentPageIndex: number;
  /** Callback when book is saved */
  onSave: (book: import('@/types/book').Book) => void;
  /** Callback when closing the builder */
  onClose: () => void;
  /** Callback when switching to editor mode */
  onSwitchToEditor?: () => void;
}

/**
 * Content processing result
 */
export interface ProcessedContent {
  /** The processed HTML content */
  html: string;
  /** Whether the content was already processed */
  wasAlreadyProcessed: boolean;
  /** Number of elements found/created */
  elementCount: number;
} 