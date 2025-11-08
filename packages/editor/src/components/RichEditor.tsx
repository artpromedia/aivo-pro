import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import { motion } from 'framer-motion';
import type { RichEditorProps, EditorState, EditorStats } from '../types';
import { Toolbar } from './Toolbar';
import { BubbleMenu } from './BubbleMenu';
import { FloatingMenu } from './FloatingMenu';
import { StatusBar } from './StatusBar';
import { useAutoSave } from '../utils/useAutoSave';
import { useEditorStats } from '../utils/useEditorStats';
import { useEditorTheme } from '../utils/useEditorTheme';

export const RichEditor: React.FC<RichEditorProps> = ({
  content = '',
  placeholder = 'Start writing...',
  editable = true,
  autofocus = false,
  spellcheck = true,
  minHeight = 200,
  maxHeight,
  theme = 'light',
  toolbar,
  className = '',
  style,
  disabled = false,
  readOnly = false,
  autoSave = false,
  autoSaveDelay = 2000,
  extensions = [],
  children,
  onCreate,
  onUpdate,
  onSelectionUpdate,
  onTransaction,
  onFocus,
  onBlur,
  onDestroy,
  onChange,
  onSave,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>('idle');
  const [isLoading, setIsLoading] = useState(true);
  
  const { themeClasses, themeStyles } = useEditorTheme(theme);

  // Configure extensions
  const editorExtensions = [
    StarterKit.configure({
      history: {
        depth: 100,
        newGroupDelay: 500,
      },
      codeBlock: false, // We'll use our custom CodeBlock
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'editor-link',
        rel: 'noopener noreferrer',
      },
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Color.configure({
      types: ['textStyle'],
    }),
    TextStyle,
    Table.configure({
      resizable: true,
      cellMinWidth: 50,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    CodeBlock.configure({
      HTMLAttributes: {
        class: 'editor-code-block',
      },
    }),
    Placeholder.configure({
      placeholder,
      considerAnyAsEmpty: true,
    }),
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),
    ...extensions,
  ];

  // Initialize editor
  const editor = useEditor({
    extensions: editorExtensions,
    content,
    editable: editable && !disabled && !readOnly,
    autofocus,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onCreate: ({ editor }) => {
      setIsLoading(false);
      setEditorState('idle');
      onCreate?.(editor);
    },
    onUpdate: ({ editor }) => {
      setEditorState('typing');
      onChange?.(editor.getHTML(), editor);
      onUpdate?.(editor);
      
      // Auto-save timer
      if (autoSave) {
        setTimeout(() => {
          setEditorState('saved');
          onSave?.(editor.getHTML(), editor);
        }, autoSaveDelay);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      onSelectionUpdate?.(editor);
    },
    onTransaction: ({ editor }) => {
      onTransaction?.(editor);
    },
    onFocus: ({ editor }) => {
      onFocus?.(editor);
    },
    onBlur: ({ editor }) => {
      setEditorState('idle');
      onBlur?.(editor);
    },
    onDestroy: () => {
      onDestroy?.();
    },
  });

  // Auto-save hook
  useAutoSave({
    editor,
    enabled: autoSave,
    delay: autoSaveDelay,
    onSave: (content: string) => {
      setEditorState('saving');
      onSave?.(content, editor!);
      setTimeout(() => setEditorState('saved'), 500);
    },
  });

  // Editor stats hook
  const stats = useEditorStats(editor);

  // Update editor when props change
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable && !disabled && !readOnly);
    }
  }, [editable, disabled, readOnly, editor]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Save shortcut (Ctrl+S / Cmd+S)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        setEditorState('saving');
        onSave?.(editor.getHTML(), editor);
        setTimeout(() => setEditorState('saved'), 500);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, onSave]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`editor-loading ${className}`} style={style}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <span className="ml-3 text-gray-600">Loading editor...</span>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className={`editor-error ${className}`} style={style}>
        <div className="flex items-center justify-center h-32 text-red-600">
          <span>Failed to initialize editor</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`rich-editor ${themeClasses} ${className}`}
      style={{ ...themeStyles, ...style }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Toolbar */}
      {toolbar?.enabled !== false && (
        <Toolbar
          editor={editor}
          config={toolbar}
          className="editor-toolbar"
          sticky={toolbar?.sticky}
        />
      )}

      {/* Editor Content */}
      <div 
        className="editor-content-wrapper"
        style={{
          minHeight,
          maxHeight,
          overflowY: maxHeight ? 'auto' : 'visible',
        }}
      >
        <EditorContent 
          editor={editor}
          className="editor-content"
          spellCheck={spellcheck}
        />

        {/* Bubble Menu */}
        <BubbleMenu
          editor={editor}
          className="editor-bubble-menu"
        />

        {/* Floating Menu */}
        <FloatingMenu
          editor={editor}
          className="editor-floating-menu"
        />
      </div>

      {/* Status Bar */}
      <StatusBar
        editor={editor}
        stats={stats}
        state={editorState}
        className="editor-status-bar"
      />

      {/* Custom children */}
      {children}
    </motion.div>
  );
};