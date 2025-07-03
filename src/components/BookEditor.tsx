'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { createEmptyBook, createEmptyPage, countWords, updateBookMetadata } from '@/lib/utils';
import { Editor } from './Editor';
import { PaginationControls } from './PaginationControls';
import { Save, Clock, BookOpen, Plus, Layout } from 'lucide-react';

interface BookEditorProps {
  initialBook?: Book;
  onSave?: (book: Book) => void;
  onNewBook?: () => void;
  onOpenLayoutBuilder?: (book: Book, pageIndex: number) => void;
}

export function BookEditor({ initialBook, onSave, onNewBook, onOpenLayoutBuilder }: BookEditorProps) {
  const [book, setBook] = useState<Book>(initialBook || createEmptyBook());
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const currentPage = book.pages[currentPageIndex];



  // Update word count when page content changes
  useEffect(() => {
    const updatedPages = book.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          wordCount: countWords(page.content)
        };
      }
      return page;
    });

    if (updatedPages[currentPageIndex].wordCount !== currentPage.wordCount) {
      const updatedBook = updateBookMetadata({
        ...book,
        pages: updatedPages
      });
      setBook(updatedBook);
    }
  }, [currentPage.content, currentPageIndex, book, currentPage.wordCount]);

  const handlePageContentChange = (content: string) => {
    const updatedPages = book.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          content,
          wordCount: countWords(content)
        };
      }
      return page;
    });

    setBook(prev => ({
      ...prev,
      pages: updatedPages
    }));
    setIsDirty(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPageIndex(pageNumber - 1);
  };

  const handleAddPage = () => {
    const newPageNumber = book.pages.length + 1;
    const newPage = createEmptyPage(newPageNumber);
    
    setBook(prev => updateBookMetadata({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setCurrentPageIndex(book.pages.length); // Navigate to new page
    setIsDirty(true);
  };

  const handleRemovePage = () => {
    if (book.pages.length <= 1) return;

    const updatedPages = book.pages
      .filter((_, index) => index !== currentPageIndex)
      .map((page, index) => ({
        ...page,
        number: index + 1
      }));

    const newCurrentPageIndex = Math.min(currentPageIndex, updatedPages.length - 1);
    
    setBook(prev => updateBookMetadata({
      ...prev,
      pages: updatedPages
    }));
    setCurrentPageIndex(newCurrentPageIndex);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(book);
    }
    setIsDirty(false);
  };

  const handleTitleChange = (title: string) => {
    setBook(prev => ({
      ...prev,
      title
    }));
    setIsDirty(true);
  };

  const handleAuthorChange = (author: string) => {
    setBook(prev => ({
      ...prev,
      author
    }));
    setIsDirty(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                  <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <input
                  type="text"
                  value={book.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg px-2 py-1 text-gray-900 placeholder-gray-400 flex-1 min-w-0"
                  placeholder="Book Title"
                />
                <span className="text-gray-300 flex-shrink-0">•</span>
                <input
                  type="text"
                  value={book.author}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  className="text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1 text-gray-600 placeholder-gray-400 w-40"
                  placeholder="Author Name"
                />
              </div>
            </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-4 text-sm text-gray-500 mr-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Last edited: {book.metadata.updatedAt.toLocaleDateString()}</span>
              </div>

            </div>

            <button
              onClick={onNewBook}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              New Book
            </button>

            {onOpenLayoutBuilder && (
              <button
                onClick={() => onOpenLayoutBuilder(book, currentPageIndex)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <Layout className="w-4 h-4" />
                Page Builder
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDirty
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Book
            </button>
          </div>
        </div>
      </header>

      {/* Editor Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-gray-100">
          <div className="max-w-5xl mx-auto p-8 pb-24">
            <Editor
              content={currentPage.content}
              onChange={handlePageContentChange}
              placeholder={`Start writing page ${currentPage.number} of your book...`}
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Pagination */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <PaginationControls
          currentPage={currentPage.number}
          totalPages={book.pages.length}
          currentPageWords={currentPage.wordCount}
          onPageChange={handlePageChange}
          onAddPage={handleAddPage}
          onRemovePage={handleRemovePage}
        />
      </div>


    </div>
  );
} 