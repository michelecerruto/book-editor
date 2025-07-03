import { type ClassValue, clsx } from "clsx";
import { Book, Page, BookSettings } from "@/types/book";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createEmptyBook(): Book {
  const now = new Date();
  
  // Default book settings
  const defaultSettings: BookSettings = {
    pageNumbering: {
      enabled: false,
      position: 'bottom-center',
      format: 'number',
      prefix: '',
      suffix: '',
      fontSize: 12,
      color: '#666666',
      fontWeight: 'normal'
    },
    margins: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
      unit: 'px'
    }
  };
  
  return {
    id: generateId(),
    title: "Untitled Book",
    author: "Unknown Author",
    content: "",
    pages: [createEmptyPage(1)],
    metadata: {
      createdAt: now,
      updatedAt: now,
      totalPages: 1,
      totalWords: 0,
      language: "en",
    },
    settings: defaultSettings
  };
}

export function createEmptyPage(pageNumber: number): Page {
  return {
    id: generateId(),
    number: pageNumber,
    content: "",
    wordCount: 0,
  };
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function updateBookMetadata(book: Book): Book {
  const totalWords = book.pages.reduce((sum, page) => sum + page.wordCount, 0);
  return {
    ...book,
    metadata: {
      ...book.metadata,
      updatedAt: new Date(),
      totalPages: book.pages.length,
      totalWords,
    }
  };
} 