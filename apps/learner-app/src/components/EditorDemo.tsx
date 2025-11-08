import React, { useState } from 'react';
import { 
  RichEditor, 
  useAutoSave, 
  useEditorStats, 
  useEditorTheme,
  type RichEditorProps 
} from '@aivo/editor';
import { Card, CardHeader, CardTitle, CardContent } from '@aivo/ui';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  Eye,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface EditorDemoProps {
  className?: string;
}

export function EditorDemo({ className }: EditorDemoProps) {
  const [content, setContent] = useState(`
    <h1>Welcome to the Rich Content Editor Demo</h1>
    <p>This powerful editor provides comprehensive text editing capabilities for the AIVO Learning Platform.</p>
    
    <h2>Key Features</h2>
    <ul>
      <li><strong>Rich Text Formatting</strong> - Bold, italic, underline, and more</li>
      <li><strong>Multimedia Support</strong> - Images, videos, and file attachments</li>
      <li><strong>Collaborative Editing</strong> - Real-time collaboration features</li>
      <li><strong>Auto-save</strong> - Never lose your work</li>
      <li><strong>Accessibility</strong> - Full keyboard navigation and screen reader support</li>
    </ul>
    
    <blockquote>
      <p>"The best way to learn is by doing. Start creating amazing content today!"</p>
    </blockquote>
    
    <h3>Try These Features:</h3>
    <ol>
      <li>Select text to see the bubble menu</li>
      <li>Create an empty line to see the floating menu</li>
      <li>Insert tables, links, and formatted code blocks</li>
      <li>Watch the statistics update in real-time</li>
    </ol>
    
    <p>Happy writing! 🚀</p>
  `);
  
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { theme, mode, setTheme, toggleTheme, isLight } = useEditorTheme('auto');

  const editorConfig: RichEditorProps = {
    content,
    placeholder: 'Start writing your amazing content...',
    editable: !isDemoMode,
    autofocus: true,
    spellcheck: true,
    theme: mode,
    enableCollaboration: false,
    maxLength: 50000,
    minHeight: 400,
    toolbar: {
      enabled: true,
      position: 'top',
      sticky: true
    },
    onChange: (newContent) => {
      setContent(newContent);
    },
    onSave: async (content) => {
      console.log('Content saved:', content);
      // In a real app, you would save to your backend here
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor }
  ] as const;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rich Content Editor</h1>
            <p className="text-gray-600">Professional WYSIWYG editor with multimedia support</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`p-2 rounded-md transition-colors ${
                  mode === value
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={`${label} theme`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isDemoMode
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            {isDemoMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <RichEditor {...editorConfig} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Statistics */}
          <EditorStats content={content} />
          
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export as HTML
              </button>
              <button className="w-full px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export as Markdown
              </button>
              <button className="w-full px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Document
              </button>
            </CardContent>
          </Card>
          
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Features Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Rich text formatting
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Tables & lists
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Image & media support
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Auto-save functionality
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Collaboration ready
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Accessibility compliant
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Theme support
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Editor Statistics Component
function EditorStats({ content }: { content: string }) {
  // Simple stats calculation for demo
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const stats = {
    characters: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    paragraphs: Math.max(1, content.split(/<\/p>/i).length - 1),
    readingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Document Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-600">Characters</div>
            <div className="font-mono font-medium">{stats.characters.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600">Words</div>
            <div className="font-mono font-medium">{stats.words.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600">Sentences</div>
            <div className="font-mono font-medium">{stats.sentences}</div>
          </div>
          <div>
            <div className="text-gray-600">Paragraphs</div>
            <div className="font-mono font-medium">{stats.paragraphs}</div>
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Reading time</span>
            <span className="font-medium">{stats.readingTime} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}