// Main exports for the Rich Content Editor package
export { RichEditor } from './components/RichEditor';
export { Toolbar } from './components/Toolbar';
export { BubbleMenu } from './components/BubbleMenu';
export { FloatingMenu } from './components/FloatingMenu';
export { StatusBar } from './components/StatusBar';

// Hooks
export { useAutoSave } from './hooks/useAutoSave';
export { useEditorStats } from './hooks/useEditorStats';
export { useEditorTheme } from './hooks/useEditorTheme';

// Core Types
export type {
  EditorConfig,
  EditorEvents,
  EditorStats,
  EditorTheme,
  EditorState,
  EditorContent,
  EditorSelection,
  EditorPlugin,
  PluginRegistry
} from './types';

// Component Props Types
export type {
  RichEditorProps,
  ToolbarProps,
  BubbleMenuProps,
  FloatingMenuProps
} from './types';

// Configuration Types
export type {
  ToolbarConfig,
  ToolbarGroup,
  ToolbarItem,
  DropdownOption,
  CustomToolbarButton,
  AutoSaveConfig,
  CollaborationConfig,
  AccessibilityConfig
} from './types';

// Media and Content Types
export type {
  MediaUploadConfig,
  MediaUploadResult,
  ImageOptions,
  VideoOptions,
  AudioOptions,
  FileOptions,
  LinkOptions,
  TableConfig,
  CodeBlockOptions
} from './types';

// Collaboration Types
export type {
  CollaborationUser,
  CollaborationPermissions,
  Comment,
  CommentReply
} from './types';

// Formatting Types
export type {
  TextFormatting,
  HeadingLevel,
  ListOptions,
  CodeLanguage
} from './types';

// Content Types
export type {
  ContentBlock,
  ContentMark,
  ContentVersion,
  ContentChange,
  VersionHistory
} from './types';

// Import/Export Types
export type {
  ExportOptions,
  ImportOptions,
  SearchOptions,
  SearchResult,
  SearchMatch,
  ReplaceOptions
} from './types';