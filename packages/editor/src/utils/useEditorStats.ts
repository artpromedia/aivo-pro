import { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import type { EditorStats } from '../types';

export const useEditorStats = (editor: Editor | null): EditorStats => {
  const [stats, setStats] = useState<EditorStats>({
    characters: 0,
    charactersWithoutSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    if (!editor) return;

    const updateStats = () => {
      const text = editor.getText();
      const html = editor.getHTML();
      
      // Character counts
      const characters = text.length;
      const charactersWithoutSpaces = text.replace(/\s/g, '').length;
      
      // Word count (split by whitespace and filter empty strings)
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      
      // Sentence count (rough estimation by counting sentence-ending punctuation)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      // Paragraph count (count <p> tags in HTML)
      const paragraphMatches = html.match(/<p[^>]*>/g);
      const paragraphs = paragraphMatches ? paragraphMatches.length : 0;
      
      // Reading time (average 200 words per minute)
      const readingTime = Math.ceil(words / 200);

      setStats({
        characters,
        charactersWithoutSpaces,
        words,
        sentences,
        paragraphs,
        readingTime,
      });
    };

    // Update stats initially
    updateStats();

    // Update stats on content change
    editor.on('update', updateStats);
    editor.on('transaction', updateStats);

    return () => {
      editor.off('update', updateStats);
      editor.off('transaction', updateStats);
    };
  }, [editor]);

  return stats;
};