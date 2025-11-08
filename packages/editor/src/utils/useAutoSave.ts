import { useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/core';

interface UseAutoSaveOptions {
  editor: Editor | null;
  enabled: boolean;
  delay: number;
  onSave: (content: string) => void;
}

export const useAutoSave = ({ editor, enabled, delay, onSave }: UseAutoSaveOptions) => {
  const timeoutRef = useRef<number>();
  const lastContentRef = useRef<string>('');

  useEffect(() => {
    if (!editor || !enabled) return;

    const handleUpdate = () => {
      const currentContent = editor.getHTML();
      
      // Only auto-save if content has changed
      if (currentContent === lastContentRef.current) return;
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        lastContentRef.current = currentContent;
        onSave(currentContent);
      }, delay);
    };

    // Listen for editor updates
    editor.on('update', handleUpdate);

    // Cleanup
    return () => {
      editor.off('update', handleUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, enabled, delay, onSave]);

  // Manual save function
  const saveNow = () => {
    if (editor && enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const currentContent = editor.getHTML();
      lastContentRef.current = currentContent;
      onSave(currentContent);
    }
  };

  return { saveNow };
};