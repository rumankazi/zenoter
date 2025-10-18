import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileTree } from './components/FileTree/FileTree';
import { FeatureFlagDemo } from './components/FeatureFlagDemo';
import { ThemeToggle } from './components/ThemeToggle';
import { PreviewToggle } from './components/PreviewToggle';
import { NoteEditor } from './components/NoteEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { ResizablePane } from './components/ResizablePane';
import { ThemeProvider } from './context/ThemeContext';
import styles from './App.module.css';

/**
 * Main App component - Phase 1 MVP
 * VS Code-like interface with resizable sidebar and optional preview
 */
export const App: FC = () => {
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>(
    '# Welcome to Zenoter\n\nA modern, animated note-taking app for developers.\n\n## Features\n\n- **Monaco Editor** - VS Code-like editing experience\n- **Markdown Support** - Full syntax highlighting\n- **IntelliSense** - Smart autocomplete\n- **Dark/Light Themes** - Toggle anytime\n- **Split View** - Live preview with resizable panes\n\n## Try It Out\n\nStart typing markdown here! Try:\n- Headings with `#`\n- **Bold** with `**text**`\n- *Italic* with `*text*`\n- Code blocks with triple backticks\n\n```javascript\nconst greeting = () => {\n  console.log("Hello, Zenoter!");\n};\n```\n\n---\n\n**Sprint 1 Progress**: 98% Complete ✅'
  );
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [editorScrollPercentage, setEditorScrollPercentage] = useState<number>(0);

  // Extract title from first line of content if title is empty
  const getDisplayTitle = (): string => {
    if (noteTitle.trim()) {
      return noteTitle;
    }

    // Extract first line from content
    const firstLine = noteContent.split('\n')[0].trim();

    // Remove markdown heading symbols
    const cleanedLine = firstLine.replace(/^#+\s*/, '');

    return cleanedLine || 'Untitled Note';
  };

  const handleTitleChange = (newTitle: string) => {
    setNoteTitle(newTitle);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    // If title is empty after editing, it will fall back to first line automatically
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Revert to previous title (empty string will fallback to first line)
      setNoteTitle('');
      setIsEditingTitle(false);
    }
  };

  return (
    <ThemeProvider>
      <div className={styles.appContainer} data-testid="app-container">
        <ResizablePane
          left={
            <aside className={styles.sidebar}>
              <FileTree />
            </aside>
          }
          right={
            <main className={styles.mainContent}>
              {/* Toolbar with note title and toggle buttons */}
              <div className={styles.toolbar}>
                {isEditingTitle ? (
                  <input
                    type="text"
                    className={styles.noteTitleInput}
                    value={noteTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    placeholder="Enter note title..."
                    autoFocus
                    aria-label="Edit note title"
                  />
                ) : (
                  <h1
                    className={styles.noteTitle}
                    onClick={() => setIsEditingTitle(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsEditingTitle(true);
                      }
                    }}
                    aria-label="Note title - click to edit"
                  >
                    {getDisplayTitle()}
                  </h1>
                )}
                <div className={styles.toolbarActions}>
                  <PreviewToggle
                    isVisible={showPreview}
                    onToggle={() => setShowPreview(!showPreview)}
                  />
                  <ThemeToggle inline />
                </div>
              </div>

              {/* Editor and Preview Area */}
              <div className={styles.editorContainer}>
                <motion.div
                  className={styles.editorPane}
                  layout
                  transition={{
                    layout: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                  }}
                  style={{ width: showPreview ? '50%' : '100%' }}
                >
                  <NoteEditor
                    value={noteContent}
                    onChange={setNoteContent}
                    onScroll={setEditorScrollPercentage}
                  />
                </motion.div>

                <AnimatePresence mode="wait">
                  {showPreview && (
                    <motion.div
                      className={styles.previewPane}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0.0, 0.2, 1],
                      }}
                      style={{ width: '50%' }}
                    >
                      <MarkdownPreview
                        content={noteContent}
                        scrollPercentage={editorScrollPercentage}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Demo Section */}
              <div className={styles.demoSection}>
                <FeatureFlagDemo />
              </div>
            </main>
          }
          defaultSize={20}
          minSize={15}
          maxSize={40}
        />
      </div>
    </ThemeProvider>
  );
};
