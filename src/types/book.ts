export interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  pages: Page[];
  metadata: BookMetadata;
  settings?: BookSettings;
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
  pageNumbers: PageNumberSettings;
  margins: MarginSettings;
  design: DesignSettings;
  uploadedImages?: string[];
}

export interface PageNumberSettings {
  enabled: boolean;
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: 'numeric' | 'roman-lower' | 'roman-upper' | 'alpha-lower' | 'alpha-upper';
  fontSize: number;
  color: string;
  prefix?: string;
  suffix?: string;
}

export interface MarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface DesignSettings {
  typography: TypographySettings;
  layout: LayoutSettings;
  colors: ColorSettings;
  bookStyle: string;
}

export interface TypographySettings {
  fontFamily: string;
  baseFontSize: string;
  lineHeight: string;
  paragraphSpacing: string;
}

export interface LayoutSettings {
  pageWidth: string;
  pageMargins: string;
}

export interface ColorSettings {
  backgroundColor: string;
  textColor: string;
}

export interface BookEditorState {
  currentBook: Book | null;
  currentPage: number;
  isEditing: boolean;
  isDirty: boolean;
} 