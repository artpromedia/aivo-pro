import React from 'react';
import type { Editor } from '@tiptap/core';
import { Clock, Type, BookOpen, Save, CheckCircle, AlertCircle } from 'lucide-react';
import type { EditorStats, EditorState } from '../types';

interface StatusBarProps {
  editor: Editor | null;
  stats: EditorStats;
  state: EditorState;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  editor,
  stats,
  state,
  className = '',
}) => {
  if (!editor) {
    return null;
  }

  const getStateIcon = () => {
    switch (state) {
      case 'saving':
        return <Save size={14} className="animate-pulse text-blue-500" />;
      case 'saved':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStateText = () => {
    switch (state) {
      case 'typing':
        return 'Typing...';
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Error saving';
      default:
        return '';
    }
  };

  return (
    <div className={`status-bar ${className}`}>
      <div className="status-left">
        {/* Document Stats */}
        <div className="status-item">
          <Type size={14} />
          <span>{stats.words} words</span>
        </div>
        
        <div className="status-item">
          <span>{stats.characters} characters</span>
        </div>

        <div className="status-item">
          <BookOpen size={14} />
          <span>{stats.paragraphs} paragraphs</span>
        </div>

        {stats.readingTime > 0 && (
          <div className="status-item">
            <Clock size={14} />
            <span>{stats.readingTime} min read</span>
          </div>
        )}
      </div>

      <div className="status-right">
        {/* Save Status */}
        {state !== 'idle' && (
          <div className="status-item">
            {getStateIcon()}
            <span>{getStateText()}</span>
          </div>
        )}

        {/* Position Info */}
        {editor.state.selection && (
          <div className="status-item">
            <span>
              Line {Math.floor(editor.state.selection.from / 80) + 1}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};