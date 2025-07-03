export interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  pages: Page[];
  metadata: BookMetadata;
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

export interface BookEditorState {
  currentBook: Book | null;
  currentPage: number;
  isEditing: boolean;
  isDirty: boolean;
} 