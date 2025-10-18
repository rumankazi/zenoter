/**
 * NoteEditor Component
 *
 * Monaco Editor wrapper for markdown note editing with:
 * - Markdown syntax highlighting
 * - IntelliSense/autocomplete
 * - Theme integration (dark/light/auto)
 * - Full keyboard accessibility
 */

import React, { useEffect, useRef } from 'react';
import Editor, { OnMount, loader } from '@monaco-editor/react';
import type { editor as MonacoEditor } from 'monaco-editor';
import { useTheme } from '../../context/ThemeContext';
import type { NoteEditorProps, EditorOptions } from './types';
import styles from './NoteEditor.module.css';

// Configure Monaco to use local files instead of CDN
// This is required for CSP compliance (no external script sources)
// Vite dev server can access node_modules directly
loader.config({
  paths: {
    vs: `${window.location.origin}/node_modules/monaco-editor/min/vs`,
  },
});

/**
 * Default editor options optimized for note-taking
 */
const DEFAULT_OPTIONS: EditorOptions = {
  minimap: { enabled: false }, // Disable minimap for cleaner note editing
  fontSize: 14,
  lineNumbers: 'on',
  wordWrap: 'on', // Enable word wrap for better readability
  automaticLayout: true, // Auto-resize on container changes
  smoothScrolling: true,
  cursorStyle: 'line',
  cursorBlinking: 'smooth',
};

export const NoteEditor: React.FC<NoteEditorProps> = ({
  value,
  onChange,
  onScroll,
  language = 'markdown',
  height = '100%',
  className,
  loading = 'Loading editor...',
}) => {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  /**
   * Map our theme context to Monaco theme names
   */
  const monacoTheme = resolvedTheme === 'light' ? 'vs' : 'vs-dark';

  /**
   * Handle editor mount - store reference and configure
   */
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Configure IntelliSense for markdown
    // Monaco already includes markdown support with:
    // - Syntax highlighting
    // - Basic autocomplete for markdown syntax
    // - Bracket matching
    // - Auto-indent

    // Focus editor on mount for better UX
    editor.focus();

    // Set up scroll synchronization
    if (onScroll) {
      // Track scroll position changes
      editor.onDidScrollChange(() => {
        const model = editor.getModel();
        if (!model) return;

        const visibleRanges = editor.getVisibleRanges();
        if (visibleRanges.length === 0) return;

        const firstVisibleLine = visibleRanges[0].startLineNumber;
        const totalLines = model.getLineCount();
        const scrollPercentage = (firstVisibleLine - 1) / Math.max(totalLines - 1, 1);

        onScroll(scrollPercentage);
      });

      // Track cursor position changes (when user clicks or navigates)
      editor.onDidChangeCursorPosition((e) => {
        const model = editor.getModel();
        if (!model) return;

        const cursorLine = e.position.lineNumber;
        const totalLines = model.getLineCount();
        const scrollPercentage = (cursorLine - 1) / Math.max(totalLines - 1, 1);

        onScroll(scrollPercentage);
      });
    }
  };

  /**
   * Handle content changes from editor
   */
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  return (
    <div
      className={`${styles.editorContainer} ${className || ''}`}
      style={{ height }}
      aria-label="Note editor container"
    >
      <Editor
        className={styles.editor}
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        theme={monacoTheme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={<div className={styles.loadingContainer}>{loading}</div>}
        options={DEFAULT_OPTIONS}
      />
    </div>
  );
};

export default NoteEditor;
