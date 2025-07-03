'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Book, Page } from '@/types/book';
import { createEmptyBook, countWords, createEmptyPage } from '@/lib/utils';

interface BookImporterProps {
  onImport: (book: Book) => void;
  onClose: () => void;
}

export function BookImporter({ onImport, onClose }: BookImporterProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const text = await file.text();
      const book = createBookFromText(text, file.name);
      onImport(book);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process the file. Please ensure it\'s a valid text file and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const createBookFromText = (text: string, filename: string): Book => {
    const book = createEmptyBook(); // This now includes default settings
    
    // Extract title from filename (remove extension)
    const title = filename.replace(/\.[^/.]+$/, "");
    book.title = title;
    
    // Extract author if present at the beginning of the file
    let contentText = text.trim();
    const authorMatch = contentText.match(/^Author:\s*(.+?)(?:\n|$)/);
    if (authorMatch) {
      book.author = authorMatch[1].trim();
      // Remove the author line from the content
      contentText = contentText.replace(/^Author:\s*.+?(?:\n\n?|$)/, '').trim();
    }
    
    // Check if this is a previously exported book with page markers
    const pageMarkerPattern = /^\s*===== Page \d+ =====\s*$/gm;
    const hasPageMarkers = pageMarkerPattern.test(contentText);
    
    let pages: Page[] = [];
    
    if (hasPageMarkers) {
      // Split by page markers to preserve original pagination
      const pageContents = contentText.split(pageMarkerPattern);
      // Remove empty first element if content starts with a page marker
      if (pageContents[0].trim() === '') {
        pageContents.shift();
      }
      
      pages = pageContents.map((pageContent, index) => {
        const content = pageContent.trim();
        if (content) {
          const page = createEmptyPage(index + 1);
          page.content = content;
          page.wordCount = countWords(content);
          return page;
        }
        return null;
      }).filter((page): page is Page => page !== null);
    } else {
      // Split text into pages (roughly 500 words per page) for new imports
      const words = contentText.split(/\s+/);
      const wordsPerPage = 500;
      
      pages = [];
      for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageWords = words.slice(i, i + wordsPerPage);
        const pageContent = pageWords.join(' ');
        
        const page = createEmptyPage(pages.length + 1);
        page.content = pageContent;
        page.wordCount = countWords(pageContent);
        pages.push(page);
      }
    }
    
    // If no content, create one empty page
    if (pages.length === 0) {
      pages.push(createEmptyPage(1));
    }
    
    book.pages = pages;
    book.metadata.totalPages = pages.length;
    book.metadata.totalWords = pages.reduce((sum, page) => sum + page.wordCount, 0);
    
    return book;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Import Book</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-orange-400 bg-orange-50/50' 
              : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.rtf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Processing file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-3">
                Drop your book file here
              </p>
              <p className="text-gray-600 mb-4">
                or click to browse for files
              </p>
              <p className="text-sm text-gray-500">
                Supports .txt, .md, and .rtf files
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2 text-gray-900">Import Guidelines:</p>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Previously exported books will maintain original pagination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>New text files will be split into pages (~500 words each)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Book title will be extracted from filename</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 