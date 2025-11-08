import { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { AutoSaveConfig } from '../types';

export interface UseAutoSaveOptions extends AutoSaveConfig {
  editor?: Editor;
}

export function useAutoSave(options: UseAutoSaveOptions) {
  const {
    enabled = true,
    interval = 5000,
    key = 'editor-content',
    storage = 'localStorage',
    onSave,
    onRestore,
    editor
  } = options;

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<number>();
  const lastContentRef = useRef<string>('');

  // Save function
  const save = useCallback(async (content: string) => {
    if (!enabled) return;

    setSaveStatus('saving');
    
    try {
      if (onSave) {
        await onSave(content, key);
      } else {
        // Default storage implementation
        switch (storage) {
          case 'localStorage':
            localStorage.setItem(key, content);
            break;
          case 'sessionStorage':
            sessionStorage.setItem(key, content);
            break;
          default:
            // For indexedDB or custom storage, onSave is required
            break;
        }
      }
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      lastContentRef.current = content;
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
    }
  }, [enabled, key, storage, onSave]);

  // Restore function
  const restore = useCallback((): string | null => {
    if (!enabled) return null;

    try {
      if (onRestore) {
        return onRestore(key);
      } else {
        // Default storage implementation
        switch (storage) {
          case 'localStorage':
            return localStorage.getItem(key);
          case 'sessionStorage':
            return sessionStorage.getItem(key);
          default:
            return null;
        }
      }
    } catch (error) {
      console.error('Restore failed:', error);
      return null;
    }
  }, [enabled, key, storage, onRestore]);

  // Clear saved content
  const clear = useCallback(() => {
    try {
      switch (storage) {
        case 'localStorage':
          localStorage.removeItem(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
      }
      setLastSaved(null);
      lastContentRef.current = '';
    } catch (error) {
      console.error('Clear failed:', error);
    }
  }, [key, storage]);

  // Debounced save
  const debouncedSave = useCallback((content: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (content !== lastContentRef.current) {
      setSaveStatus('idle');
      saveTimeoutRef.current = window.setTimeout(() => {
        save(content);
      }, interval);
    }
  }, [save, interval]);

  // Effect to handle editor content changes
  useEffect(() => {
    if (!editor || !enabled) return;

    const handleUpdate = () => {
      const content = editor.getHTML();
      debouncedSave(content);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editor, enabled, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    lastSaved,
    save,
    restore,
    clear,
    isAutoSaving: saveStatus === 'saving'
  };
}