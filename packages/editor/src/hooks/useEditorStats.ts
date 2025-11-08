import { useState, useEffect, useMemo } from 'react';
import { Editor } from '@tiptap/core';
import { EditorStats } from '../types';

export function useEditorStats(editor?: Editor) {
  const [stats, setStats] = useState<EditorStats>({
    characters: 0,
    charactersWithoutSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  // Calculate statistics from text
  const calculateStats = useMemo(() => {
    return (text: string): EditorStats => {
      const characters = text.length;
      const charactersWithoutSpaces = text.replace(/\s/g, '').length;
      
      // Count words (split by whitespace and filter empty strings)
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      
      // Count sentences (split by sentence terminators)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      // Count paragraphs (split by double line breaks or HTML paragraph tags)
      const paragraphs = Math.max(
        text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
        text.split(/<\/p>/i).filter(p => p.trim().length > 0).length
      );
      
      // Calculate reading time (average 200 words per minute)
      const readingTime = Math.ceil(words / 200);

      return {
        characters,
        charactersWithoutSpaces,
        words,
        sentences,
        paragraphs,
        readingTime
      };
    };
  }, []);

  // Update stats when editor content changes
  useEffect(() => {
    if (!editor) {
      setStats({
        characters: 0,
        charactersWithoutSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
      });
      return;
    }

    const updateStats = () => {
      const text = editor.getText();
      const newStats = calculateStats(text);
      setStats(newStats);
    };

    // Calculate initial stats
    updateStats();

    // Listen for content changes
    editor.on('update', updateStats);

    return () => {
      editor.off('update', updateStats);
    };
  }, [editor, calculateStats]);

  return stats;
}