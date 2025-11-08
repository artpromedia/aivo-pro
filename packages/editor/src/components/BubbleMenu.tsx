import React from 'react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, Link, Code } from 'lucide-react';
import type { BubbleMenuProps } from '../types';

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  editor,
  className = '',
  shouldShow,
  tippyOptions = {},
}) => {
  if (!editor) {
    return null;
  }

  const defaultShouldShow = ({ editor }: { editor: Editor; [key: string]: any }) => {
    return editor.view.state.selection.empty === false;
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={shouldShow ?? defaultShouldShow}
      tippyOptions={{
        duration: 100,
        animation: 'fade',
        theme: 'light-border',
        ...tippyOptions,
      }}
    >
      <motion.div
        className={`bubble-menu ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
      >
        <div className="bubble-menu-content">
          <button
            type="button"
            className={`bubble-button ${editor.isActive('bold') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={14} />
          </button>

          <button
            type="button"
            className={`bubble-button ${editor.isActive('italic') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={14} />
          </button>

          <button
            type="button"
            className={`bubble-button ${editor.isActive('underline') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <Underline size={14} />
          </button>

          <button
            type="button"
            className={`bubble-button ${editor.isActive('code') ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Code"
          >
            <Code size={14} />
          </button>

          <div className="bubble-separator" />

          <button
            type="button"
            className={`bubble-button ${editor.isActive('link') ? 'active' : ''}`}
            onClick={setLink}
            title="Link"
          >
            <Link size={14} />
          </button>
        </div>
      </motion.div>
    </TiptapBubbleMenu>
  );
};