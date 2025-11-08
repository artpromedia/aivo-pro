import React from 'react';
import { FloatingMenu as TiptapFloatingMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { motion } from 'framer-motion';
import { Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code2 } from 'lucide-react';
import type { FloatingMenuProps } from '../types';

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  editor,
  className = '',
  shouldShow,
  tippyOptions = {},
}) => {
  if (!editor) {
    return null;
  }

  const defaultShouldShow = ({ editor }: { editor: Editor; [key: string]: any }) => {
    return editor.isEditable && editor.isEmpty;
  };

  return (
    <TiptapFloatingMenu
      editor={editor}
      shouldShow={shouldShow ?? defaultShouldShow}
      tippyOptions={{
        duration: 100,
        animation: 'fade',
        placement: 'top-start',
        ...tippyOptions,
      }}
    >
      <motion.div
        className={`floating-menu ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
      >
        <div className="floating-menu-content">
          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>

          <div className="floating-separator" />

          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <div className="floating-separator" />

          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <Quote size={16} />
          </button>

          <button
            type="button"
            className="floating-button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code2 size={16} />
          </button>
        </div>
      </motion.div>
    </TiptapFloatingMenu>
  );
};