/**
 * Custom hook for Editor functionality
 */

import { useState, useEffect, useCallback, RefObject } from 'react';
import { applyTextStyling, setSafeHTMLContent, executeDocumentCommand } from '@/utils/editorUtils';

interface UseEditorProps {
  /** Initial content */
  content: string;
  /** Callback when content changes */
  onChange: (content: string) => void;
  /** Reference to the editor element */
  editorRef: RefObject<HTMLDivElement | null>;
}

interface UseEditorReturn {
  /** Whether the editor is focused */
  isFocused: boolean;
  /** Execute a formatting command */
  executeCommand: (command: string, value?: string) => void;
  /** Handle input changes */
  handleInput: () => void;
  /** Handle focus events */
  handleFocus: () => void;
  /** Handle blur events */
  handleBlur: () => void;
}

/**
 * Hook for managing Editor state and functionality
 * @param props - Hook configuration
 * @returns Editor state and handlers
 */
export function useEditor({
  content,
  onChange,
  editorRef
}: UseEditorProps): UseEditorReturn {
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Handles focus events
   */
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  /**
   * Handles blur events
   */
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  /**
   * Executes a document command and updates content
   */
  const executeCommand = useCallback((command: string, value?: string) => {
    executeDocumentCommand(command, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [editorRef, onChange]);

  /**
   * Handles input changes and updates content
   */
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [editorRef, onChange]);

  /**
   * Sets up text styling observer and initial content
   */
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // Set initial content safely
    if (editor.innerHTML !== content) {
      setSafeHTMLContent(editor, content);
    }

    // Apply initial text styling
    applyTextStyling(editor);

    // Set up mutation observer to maintain text styling
    const observer = new MutationObserver(() => {
      applyTextStyling(editor);
    });

    observer.observe(editor, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, [content, editorRef]);

  return {
    isFocused,
    executeCommand,
    handleInput,
    handleFocus,
    handleBlur
  };
} 