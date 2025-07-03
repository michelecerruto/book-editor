'use client';

import { useState } from 'react';
import { BookEditor } from '@/components/BookEditor';
import { BookImporter } from '@/components/BookImporter';
import { Builder } from '@/components/Builder';
import { Book } from '@/types/book';
import { createEmptyBook } from '@/lib/utils';
import { Upload, FileText, Plus, BookOpen } from 'lucide-react';

export default function Home() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [showLayoutBuilder, setShowLayoutBuilder] = useState(false);
  const [layoutBuilderPageIndex, setLayoutBuilderPageIndex] = useState(0);

  const handleSave = (book: Book) => {
    console.log('Saving book:', book);
    
    // Save to localStorage as backup
    localStorage.setItem('book', JSON.stringify(book));
    
    // Create and download the book as a text file
    // Include author metadata at the beginning, then the content with page markers
    const bookContent = book.pages.map((page, index) => {
      const pageMarker = `===== Page ${index + 1} =====`;
      return `${pageMarker}\n${page.content}`;
    }).join('\n\n');
    const fullContent = book.author ? `Author: ${book.author}\n\n${bookContent}` : bookContent;
    
    // Generate proper filename with sequential numbering for untitled books
    let filename = book.title || 'Untitled Book';
    
    if (!book.title || book.title === 'Untitled Book') {
      // Get the current counter from localStorage and increment
      const untitledCounter = parseInt(localStorage.getItem('untitledBookCounter') || '0');
      const nextCounter = untitledCounter + 1;
      
      // Save the updated counter
      localStorage.setItem('untitledBookCounter', nextCounter.toString());
      
      // Always use numbering to avoid browser conflicts
      filename = `Untitled Book ${nextCounter}`;
    }
    
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (book: Book) => {
    setCurrentBook(book);
    setShowImporter(false);
  };

  const handleNewBook = () => {
    setCurrentBook(null);
    setShowLayoutBuilder(false);
  };

  const handleOpenLayoutBuilder = (book: Book, pageIndex: number) => {
    setCurrentBook(book);
    setLayoutBuilderPageIndex(pageIndex);
    setShowLayoutBuilder(true);
  };

  const handleLayoutBuilderSave = (updatedBook: Book) => {
    // Just update the book in memory, don't download a file
    setCurrentBook(updatedBook);
    // Also save to localStorage as backup
    localStorage.setItem('book', JSON.stringify(updatedBook));
  };

  const handleLayoutBuilderClose = () => {
    setShowLayoutBuilder(false);
  };

  if (showLayoutBuilder && currentBook) {
  return (
      <main className="h-screen">
        <Builder
          book={currentBook}
          currentPageIndex={layoutBuilderPageIndex}
          onSave={handleLayoutBuilderSave}
          onClose={handleLayoutBuilderClose}
          onSwitchToEditor={handleLayoutBuilderClose}
        />
      </main>
    );
  }

  if (currentBook) {
    return (
      <main className="h-screen">
        <BookEditor 
          initialBook={currentBook} 
          onSave={handleSave} 
          onNewBook={handleNewBook}
          onOpenLayoutBuilder={handleOpenLayoutBuilder}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Book Editor
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              A modern WYSIWYG book editor with pagination controls. 
              Create and edit your books with a beautiful, intuitive interface.
            </p>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Create New Book
                </h3>
                <p className="text-gray-600 mb-6">
                  Start writing a new book from scratch with our WYSIWYG editor
                </p>
                <button
                  onClick={() => setCurrentBook(createEmptyBook())}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600"
                >
                  <Plus className="w-5 h-5" />
                  Start Writing
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Import Existing Book
                </h3>
                <p className="text-gray-600 mb-6">
                  Import a text file and convert it into a paginated book
                </p>
                <button
                  onClick={() => setShowImporter(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 border-2 border-orange-200 rounded-xl transition-all duration-200 font-medium hover:bg-orange-50 hover:border-orange-300"
                >
                  <Upload className="w-5 h-5" />
                  Import File
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-100">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  WYSIWYG Editing
                </h3>
                <p className="text-gray-600 text-sm">
                  Rich text editing with formatting controls
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Page Management
                </h3>
                <p className="text-gray-600 text-sm">
                  Organize content with pagination controls
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  File Import
                </h3>
                <p className="text-gray-600 text-sm">
                  Import text files and convert to books
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImporter && (
        <BookImporter
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}
    </main>
  );
}
