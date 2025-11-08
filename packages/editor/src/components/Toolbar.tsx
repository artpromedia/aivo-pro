import React from 'react';
import type { Editor } from '@tiptap/core';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code2,
  Table,
  Undo,
  Redo,
  Type,
  Palette,
} from 'lucide-react';
import type { ToolbarProps, ToolbarConfig } from '../types';

const defaultToolbarConfig: ToolbarConfig = {
  enabled: true,
  position: 'top',
  sticky: false,
  groups: [
    {
      name: 'history',
      items: [
        {
          type: 'button',
          name: 'undo',
          icon: <Undo size={16} />,
          tooltip: 'Undo (Ctrl+Z)',
          isActive: () => false,
          isDisabled: (editor) => !editor.can().undo(),
          action: (editor) => editor.chain().focus().undo().run(),
        },
        {
          type: 'button',
          name: 'redo',
          icon: <Redo size={16} />,
          tooltip: 'Redo (Ctrl+Y)',
          isActive: () => false,
          isDisabled: (editor) => !editor.can().redo(),
          action: (editor) => editor.chain().focus().redo().run(),
        },
      ],
      separator: true,
    },
    {
      name: 'formatting',
      items: [
        {
          type: 'button',
          name: 'bold',
          icon: <Bold size={16} />,
          tooltip: 'Bold (Ctrl+B)',
          isActive: (editor) => editor.isActive('bold'),
          action: (editor) => editor.chain().focus().toggleBold().run(),
        },
        {
          type: 'button',
          name: 'italic',
          icon: <Italic size={16} />,
          tooltip: 'Italic (Ctrl+I)',
          isActive: (editor) => editor.isActive('italic'),
          action: (editor) => editor.chain().focus().toggleItalic().run(),
        },
        {
          type: 'button',
          name: 'underline',
          icon: <Underline size={16} />,
          tooltip: 'Underline (Ctrl+U)',
          isActive: (editor) => editor.isActive('underline'),
          action: (editor) => editor.chain().focus().toggleUnderline().run(),
        },
        {
          type: 'button',
          name: 'strike',
          icon: <Strikethrough size={16} />,
          tooltip: 'Strikethrough',
          isActive: (editor) => editor.isActive('strike'),
          action: (editor) => editor.chain().focus().toggleStrike().run(),
        },
        {
          type: 'button',
          name: 'code',
          icon: <Code size={16} />,
          tooltip: 'Inline Code',
          isActive: (editor) => editor.isActive('code'),
          action: (editor) => editor.chain().focus().toggleCode().run(),
        },
        {
          type: 'button',
          name: 'highlight',
          icon: <Highlighter size={16} />,
          tooltip: 'Highlight',
          isActive: (editor) => editor.isActive('highlight'),
          action: (editor) => editor.chain().focus().toggleHighlight().run(),
        },
      ],
      separator: true,
    },
    {
      name: 'headings',
      items: [
        {
          type: 'dropdown',
          name: 'heading',
          icon: <Type size={16} />,
          tooltip: 'Heading',
          options: [
            {
              label: 'Paragraph',
              value: 'paragraph',
              command: 'setParagraph',
              isActive: (editor) => editor.isActive('paragraph'),
            },
            {
              label: 'Heading 1',
              value: 'h1',
              command: 'setHeading',
              isActive: (editor) => editor.isActive('heading', { level: 1 }),
            },
            {
              label: 'Heading 2',
              value: 'h2',
              command: 'setHeading',
              isActive: (editor) => editor.isActive('heading', { level: 2 }),
            },
            {
              label: 'Heading 3',
              value: 'h3',
              command: 'setHeading',
              isActive: (editor) => editor.isActive('heading', { level: 3 }),
            },
          ],
        },
      ],
      separator: true,
    },
    {
      name: 'alignment',
      items: [
        {
          type: 'button',
          name: 'alignLeft',
          icon: <AlignLeft size={16} />,
          tooltip: 'Align Left',
          isActive: (editor) => editor.isActive({ textAlign: 'left' }),
          action: (editor) => editor.chain().focus().setTextAlign('left').run(),
        },
        {
          type: 'button',
          name: 'alignCenter',
          icon: <AlignCenter size={16} />,
          tooltip: 'Align Center',
          isActive: (editor) => editor.isActive({ textAlign: 'center' }),
          action: (editor) => editor.chain().focus().setTextAlign('center').run(),
        },
        {
          type: 'button',
          name: 'alignRight',
          icon: <AlignRight size={16} />,
          tooltip: 'Align Right',
          isActive: (editor) => editor.isActive({ textAlign: 'right' }),
          action: (editor) => editor.chain().focus().setTextAlign('right').run(),
        },
        {
          type: 'button',
          name: 'alignJustify',
          icon: <AlignJustify size={16} />,
          tooltip: 'Justify',
          isActive: (editor) => editor.isActive({ textAlign: 'justify' }),
          action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
        },
      ],
      separator: true,
    },
    {
      name: 'lists',
      items: [
        {
          type: 'button',
          name: 'bulletList',
          icon: <List size={16} />,
          tooltip: 'Bullet List',
          isActive: (editor) => editor.isActive('bulletList'),
          action: (editor) => editor.chain().focus().toggleBulletList().run(),
        },
        {
          type: 'button',
          name: 'orderedList',
          icon: <ListOrdered size={16} />,
          tooltip: 'Numbered List',
          isActive: (editor) => editor.isActive('orderedList'),
          action: (editor) => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          type: 'button',
          name: 'blockquote',
          icon: <Quote size={16} />,
          tooltip: 'Quote',
          isActive: (editor) => editor.isActive('blockquote'),
          action: (editor) => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          type: 'button',
          name: 'codeBlock',
          icon: <Code2 size={16} />,
          tooltip: 'Code Block',
          isActive: (editor) => editor.isActive('codeBlock'),
          action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
        },
      ],
      separator: true,
    },
    {
      name: 'media',
      items: [
        {
          type: 'button',
          name: 'link',
          icon: <Link size={16} />,
          tooltip: 'Add Link',
          isActive: (editor) => editor.isActive('link'),
          action: (editor) => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          },
        },
        {
          type: 'button',
          name: 'image',
          icon: <Image size={16} />,
          tooltip: 'Add Image',
          isActive: () => false,
          action: (editor) => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          },
        },
        {
          type: 'button',
          name: 'table',
          icon: <Table size={16} />,
          tooltip: 'Insert Table',
          isActive: (editor) => editor.isActive('table'),
          action: (editor) => {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          },
        },
      ],
    },
  ],
};

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  config = defaultToolbarConfig,
  className = '',
  sticky = false,
}) => {
  if (!editor || !config.enabled) {
    return null;
  }

  const mergedConfig = { ...defaultToolbarConfig, ...config };

  const handleButtonClick = (item: any) => {
    if (item.action) {
      item.action(editor);
    }
  };

  const handleDropdownChange = (item: any, option: any) => {
    if (option.command === 'setParagraph') {
      editor.chain().focus().setParagraph().run();
    } else if (option.command === 'setHeading') {
      const level = parseInt(option.value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  const isItemActive = (item: any) => {
    if (item.isActive) {
      return item.isActive(editor);
    }
    return false;
  };

  const isItemDisabled = (item: any) => {
    if (item.isDisabled) {
      return item.isDisabled(editor);
    }
    return false;
  };

  return (
    <motion.div
      className={`editor-toolbar ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? 0 : 'auto',
        zIndex: sticky ? 10 : 'auto',
      }}
    >
      <div className="toolbar-content">
        {mergedConfig.groups?.map((group, groupIndex) => (
          <div key={group.name} className="toolbar-group">
            {group.items.map((item, itemIndex) => {
              if (item.type === 'button') {
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`toolbar-button ${isItemActive(item) ? 'active' : ''} ${
                      isItemDisabled(item) ? 'disabled' : ''
                    }`}
                    title={item.tooltip}
                    disabled={isItemDisabled(item)}
                    onClick={() => handleButtonClick(item)}
                  >
                    {item.icon}
                  </button>
                );
              }

              if (item.type === 'dropdown') {
                return (
                  <div key={item.name} className="toolbar-dropdown">
                    <select
                      className="toolbar-select"
                      title={item.tooltip}
                      onChange={(e) => {
                        const option = item.options?.find(opt => opt.value === e.target.value);
                        if (option) {
                          handleDropdownChange(item, option);
                        }
                      }}
                      value={
                        item.options?.find(opt => opt.isActive && opt.isActive(editor))?.value || 'paragraph'
                      }
                    >
                      {item.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (item.type === 'divider') {
                return <div key={`divider-${itemIndex}`} className="toolbar-divider" />;
              }

              return null;
            })}
            {group.separator && groupIndex < mergedConfig.groups!.length - 1 && (
              <div className="toolbar-separator" />
            )}
          </div>
        ))}

        {/* Custom Buttons */}
        {config.customButtons && config.customButtons.length > 0 && (
          <>
            <div className="toolbar-separator" />
            <div className="toolbar-group">
              {config.customButtons.map((button) => (
                <button
                  key={button.name}
                  type="button"
                  className={`toolbar-button ${button.isActive?.(editor) ? 'active' : ''} ${
                    button.isDisabled?.(editor) ? 'disabled' : ''
                  }`}
                  title={button.tooltip}
                  disabled={button.isDisabled?.(editor)}
                  onClick={() => button.action(editor)}
                >
                  {button.icon}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};