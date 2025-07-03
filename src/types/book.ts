export interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  pages: Page[];
  metadata: BookMetadata;
  settings: BookSettings;
}

export interface Page {
  id: string;
  number: number;
  content: string;
  wordCount: number;
}

export interface BookMetadata {
  createdAt: Date;
  updatedAt: Date;
  totalPages: number;
  totalWords: number;
  language: string;
  genre?: string;
}

export interface BookSettings {
  pageNumbering: PageNumberingSettings;
  margins: BookMarginsSettings;
}

export interface PageNumberingSettings {
  enabled: boolean;
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: 'number' | 'roman' | 'text';
  prefix: string;
  suffix: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
}

export interface BookMarginsSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
  unit: 'px' | 'mm' | 'in';
}

export interface BookEditorState {
  currentBook: Book | null;
  currentPage: number;
  isEditing: boolean;
  isDirty: boolean;
} 