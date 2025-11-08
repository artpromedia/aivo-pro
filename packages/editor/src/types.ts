import { Editor } from '@tiptap/core';
import React from 'react';

// Core Editor Types
export interface EditorConfig {
  placeholder?: string;
  editable?: boolean;
  content?: string;
  autofocus?: boolean;
  spellcheck?: boolean;
  enableCollaboration?: boolean;
  maxLength?: number;
  minHeight?: number;
  maxHeight?: number;
  theme?: 'light' | 'dark' | 'auto';
  toolbar?: ToolbarConfig;
}

export interface ToolbarConfig {
  enabled?: boolean;
  position?: 'top' | 'bottom' | 'floating';
  sticky?: boolean;
  groups?: ToolbarGroup[];
  customButtons?: CustomToolbarButton[];
}

export interface ToolbarGroup {
  name: string;
  items: ToolbarItem[];
  separator?: boolean;
}

export interface ToolbarItem {
  type: 'button' | 'dropdown' | 'color-picker' | 'divider';
  name: string;
  icon?: React.ReactNode;
  tooltip?: string;
  command?: string;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
  action?: (editor: Editor) => void;
  options?: DropdownOption[];
}

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  command?: string;
  isActive?: (editor: Editor) => boolean;
}

export interface CustomToolbarButton {
  name: string;
  icon: React.ReactNode;
  tooltip: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}

// Editor Event Types
export interface EditorEvents {
  onCreate?: (editor: Editor) => void;
  onUpdate?: (editor: Editor) => void;
  onSelectionUpdate?: (editor: Editor) => void;
  onTransaction?: (editor: Editor) => void;
  onFocus?: (editor: Editor) => void;
  onBlur?: (editor: Editor) => void;
  onDestroy?: () => void;
  onChange?: (content: string, editor: Editor) => void;
  onSave?: (content: string, editor: Editor) => void;
}

// Component Props
export interface RichEditorProps extends EditorConfig, EditorEvents {
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  extensions?: any[];
  children?: React.ReactNode;
}

export interface ToolbarProps {
  editor: Editor | null;
  config?: ToolbarConfig;
  className?: string;
  sticky?: boolean;
}

export interface BubbleMenuProps {
  editor: Editor | null;
  tippyOptions?: Record<string, any>;
  className?: string;
  shouldShow?: (props: { editor: Editor; [key: string]: any }) => boolean;
}

export interface FloatingMenuProps {
  editor: Editor | null;
  tippyOptions?: Record<string, any>;
  className?: string;
  shouldShow?: (props: { editor: Editor; [key: string]: any }) => boolean;
}

// Media and File Types
export interface MediaUploadConfig {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  uploadUrl?: string;
  uploadHandler?: (file: File) => Promise<MediaUploadResult>;
  storage?: 'local' | 'cloud' | 'custom';
}

export interface MediaUploadResult {
  url: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
}

export interface ImageOptions {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  alignment?: 'left' | 'center' | 'right';
  caption?: string;
}

export interface VideoOptions {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  caption?: string;
}

export interface AudioOptions {
  src: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  title?: string;
}

export interface FileOptions {
  src: string;
  name: string;
  size?: number;
  type?: string;
  downloadable?: boolean;
}

// Collaboration Types
export interface CollaborationConfig {
  enabled?: boolean;
  provider?: 'websocket' | 'supabase' | 'firebase' | 'custom';
  room?: string;
  user?: CollaborationUser;
  onUserJoin?: (user: CollaborationUser) => void;
  onUserLeave?: (user: CollaborationUser) => void;
  onUserUpdate?: (user: CollaborationUser) => void;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  role?: 'editor' | 'reviewer' | 'viewer';
  permissions?: CollaborationPermissions;
}

export interface CollaborationPermissions {
  canEdit?: boolean;
  canComment?: boolean;
  canSuggest?: boolean;
  canShare?: boolean;
  canDelete?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  position: number;
  timestamp: Date;
  resolved?: boolean;
  replies?: CommentReply[];
  selection?: EditorSelection;
}

export interface CommentReply {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
}

export interface EditorSelection {
  from: number;
  to: number;
  text: string;
}

// Table Types
export interface TableConfig {
  resizable?: boolean;
  cellMinWidth?: number;
  allowTableNodeSelection?: boolean;
  lastColumnResizable?: boolean;
  handleWidth?: number;
  cellClass?: string;
  tableClass?: string;
}

export interface TableCellOptions {
  colspan?: number;
  rowspan?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

// Link Types
export interface LinkOptions {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  title?: string;
  rel?: string;
  class?: string;
}

export interface LinkValidation {
  required?: boolean;
  allowedProtocols?: string[];
  allowedDomains?: string[];
  maxLength?: number;
}

// Code Block Types
export interface CodeBlockOptions {
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxLines?: number;
  wrap?: boolean;
}

export interface CodeLanguage {
  name: string;
  label: string;
  extensions: string[];
  icon?: React.ReactNode;
}

// Formatting Types
export interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  highlight?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface HeadingLevel {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id?: string;
}

export interface ListOptions {
  type: 'bullet' | 'ordered';
  tight?: boolean;
  start?: number;
  markerStyle?: string;
}

// Plugin Types
export interface EditorPlugin {
  name: string;
  priority?: number;
  enabled?: boolean;
  config?: Record<string, any>;
  extension: any;
}

export interface PluginRegistry {
  [key: string]: EditorPlugin;
}

// Content Types
export interface ContentBlock {
  type: string;
  content?: ContentBlock[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: ContentMark[];
}

export interface ContentMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface EditorContent {
  type: 'doc';
  content: ContentBlock[];
}

// Export/Import Types
export interface ExportOptions {
  format: 'html' | 'markdown' | 'json' | 'text' | 'pdf' | 'docx';
  includeStyles?: boolean;
  includeImages?: boolean;
  minify?: boolean;
  sanitize?: boolean;
}

export interface ImportOptions {
  format: 'html' | 'markdown' | 'json' | 'text' | 'docx';
  sanitize?: boolean;
  preserveWhitespace?: boolean;
  convertImages?: boolean;
}

// Accessibility Types
export interface AccessibilityConfig {
  enabled?: boolean;
  announceChanges?: boolean;
  keyboardNavigation?: boolean;
  focusManagement?: boolean;
  ariaLabels?: Record<string, string>;
  altTextRequired?: boolean;
  contrastChecking?: boolean;
}

// Auto-save Types
export interface AutoSaveConfig {
  enabled?: boolean;
  interval?: number; // in milliseconds
  key?: string;
  storage?: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'custom';
  onSave?: (content: string, key: string) => void;
  onRestore?: (key: string) => string | null;
}

// Version Control Types
export interface VersionHistory {
  versions: ContentVersion[];
  currentVersion: number;
  autoSaveInterval?: number;
}

export interface ContentVersion {
  id: string;
  content: EditorContent;
  timestamp: Date;
  authorId?: string;
  description?: string;
  changes?: ContentChange[];
}

export interface ContentChange {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  length?: number;
  content?: string;
  oldContent?: string;
}

// Search and Replace Types
export interface SearchOptions {
  query: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regex?: boolean;
  highlightMatches?: boolean;
}

export interface SearchResult {
  matches: SearchMatch[];
  currentMatch: number;
  total: number;
}

export interface SearchMatch {
  from: number;
  to: number;
  text: string;
  context: string;
}

export interface ReplaceOptions extends SearchOptions {
  replacement: string;
  replaceAll?: boolean;
}

// Utility Types
export type EditorState = 'idle' | 'typing' | 'saving' | 'saved' | 'error';

export interface EditorStats {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
}

export interface EditorTheme {
  name: string;
  colors: {
    background: string;
    text: string;
    border: string;
    toolbar: string;
    button: string;
    buttonHover: string;
    buttonActive: string;
    selection: string;
    focus: string;
  };
  fonts: {
    editor: string;
    mono: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}