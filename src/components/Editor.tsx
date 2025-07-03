/**
 * Editor Component
 * A rich text editor with formatting tools and support for Builder content
 */

'use client';

import { useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from '@/hooks/useEditor';

interface EditorProps {
  /** HTML content to display and edit */
  content: string;
  /** Callback when content changes */
  onChange: (content: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder text when editor is empty */
  placeholder?: string;
}

interface ToolbarButton {
  icon: LucideIcon;
  command: string;
  title: string;
}

/**
 * Toolbar button configuration
 */
const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { icon: Bold, command: 'bold', title: 'Bold' },
  { icon: Italic, command: 'italic', title: 'Italic' },
  { icon: Underline, command: 'underline', title: 'Underline' },
  { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
  { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
  { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
  { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
];

/**
 * Editor with rich text formatting capabilities
 * @param props - Component props
 * @returns Editor component
 */
export function Editor({
  content,
  onChange,
  className,
  placeholder = "Start writing your book..."
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const {
    isFocused,
    executeCommand,
    handleInput,
    handleFocus,
    handleBlur
  } = useEditor({
    content,
    onChange,
    editorRef
  });

  /**
   * Renders a toolbar button
   */
  const renderToolbarButton = (button: ToolbarButton, index: number) => (
    <button
      key={index}
      onClick={() => executeCommand(button.command)}
      className="p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900"
      title={button.title}
      type="button"
    >
      <button.icon className="w-4 h-4" />
    </button>
  );

  /**
   * Renders the formatting toolbar
   */
  const renderToolbar = () => (
    <div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
      {TOOLBAR_BUTTONS.map(renderToolbarButton)}
      
      <div className="w-px h-6 bg-gray-300 mx-3" />
      
      {/* Font Size Selector */}
      <select
        onChange={(e) => executeCommand('fontSize', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Extra Large</option>
      </select>
      
      {/* Heading Selector */}
      <select
        onChange={(e) => executeCommand('formatBlock', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none ml-2"
        defaultValue="div"
      >
        <option value="div">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="p">Paragraph</option>
      </select>
    </div>
  );

  return (
    <div className={cn("bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200", className)}>
      {/* Toolbar - Always available for editing */}
      {renderToolbar()}

      {/* Editor Container */}
      <div className="relative bg-white">
        {/* Placeholder */}
        {!content && !isFocused && (
          <div className="absolute inset-0 p-12 pointer-events-none text-gray-400 text-lg flex items-start justify-center">
            <span className="mt-8">{placeholder}</span>
          </div>
        )}
        
        {/* Main Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="min-h-[700px] p-12 focus:outline-none bg-white text-gray-900 leading-relaxed"
          style={{
            lineHeight: '1.8',
            fontSize: '18px',
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            color: '#111827'
          }}
          suppressContentEditableWarning={true}
        />
      </div>
      
      {/* Global styles for proper text rendering */}
      <style jsx>{`
        [contenteditable="true"] * {
          color: #111827 !important;
          opacity: 1 !important;
        }
        
        [contenteditable="true"] h1,
        [contenteditable="true"] h2,
        [contenteditable="true"] h3,
        [contenteditable="true"] h4,
        [contenteditable="true"] h5,
        [contenteditable="true"] h6 {
          color: #111827 !important;
          font-weight: bold;
        }
        
        [contenteditable="true"] p,
        [contenteditable="true"] div,
        [contenteditable="true"] span,
        [contenteditable="true"] li {
          color: #111827 !important;
        }
        
        [contenteditable="true"] ul,
        [contenteditable="true"] ol {
          color: #111827 !important;
          padding-left: 2rem;
        }
        
        [contenteditable="true"] ul li {
          list-style-type: disc;
          color: #111827 !important;
        }
        
        [contenteditable="true"] ol li {
          list-style-type: decimal;
          color: #111827 !important;
        }
        
        /* Ensure all text elements override any gray colors */
        [contenteditable="true"] .text-gray-500,
        [contenteditable="true"] .text-gray-600,
        [contenteditable="true"] .text-gray-700,
        [contenteditable="true"] .text-gray-400 {
          color: #111827 !important;
        }
        
        /* Force override for any inline styles that might set gray colors */
        [contenteditable="true"] [style*="color: gray"],
        [contenteditable="true"] [style*="color: #6b7280"],
        [contenteditable="true"] [style*="color: #9ca3af"],
        [contenteditable="true"] [style*="color: #d1d5db"] {
          color: #111827 !important;
        }
      `}</style>
    </div>
  );
} 