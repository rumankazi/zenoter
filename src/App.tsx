import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NotesList } from './components/NotesList';
import { FeatureFlagDemo } from './components/FeatureFlagDemo';
import { ThemeToggle } from './components/ThemeToggle';
import { PreviewToggle } from './components/PreviewToggle';
import { SaveButton } from './components/SaveButton';
import { NoteEditor } from './components/NoteEditor';
import { MarkdownPreview } from './components/MarkdownPreview';
import { ResizablePane } from './components/ResizablePane';
import { DatabaseTester } from './components/DatabaseTester';
import { Toast } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { databaseClient, type Note } from './services/database.client';
import { useToast, useAutoSave, useKeyboardShortcut } from './hooks';
import styles from './App.module.css';

/**
 * Main App component - Phase 1 MVP
 * VS Code-like interface with resizable sidebar and optional preview
 */
export const App: FC = () => {
  // Use environment variable to enable DatabaseTester in development
  const [testMode, setTestMode] = useState<boolean>(
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_DB_TESTER === 'true'
  );

  // Toast notifications
  const toast = useToast();

  // Database-backed state
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Editor state
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [editorScrollPercentage, setEditorScrollPercentage] = useState<number>(0);

  // Save state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedContent, setLastSavedContent] = useState<string>('');
  const [lastSavedTitle, setLastSavedTitle] = useState<string>('');

  // Load all notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    if (selectedNote) {
      const contentChanged = noteContent !== lastSavedContent;
      const titleChanged = noteTitle !== lastSavedTitle;
      setHasUnsavedChanges(contentChanged || titleChanged);
    }
  }, [noteContent, noteTitle, lastSavedContent, lastSavedTitle, selectedNote]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const allNotes = await databaseClient.getAllNotes();
      setNotes(allNotes);

      // If no note is selected and there are notes, select the first one
      if (!selectedNote && allNotes.length > 0) {
        handleNoteSelect(allNotes[0]);
      } else if (allNotes.length === 0) {
        // Create first note if database is empty
        await handleNoteCreate();
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      toast.error('Failed to load notes. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setLastSavedTitle(note.title);
    setLastSavedContent(note.content);
    setHasUnsavedChanges(false);
    setIsEditingTitle(false);
  };

  const handleSave = async () => {
    if (!selectedNote || !hasUnsavedChanges) return;

    try {
      setIsSaving(true);
      const updated = await databaseClient.updateNote(selectedNote.id, {
        title: noteTitle,
        content: noteContent,
      });

      if (updated) {
        // Update notes list
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setSelectedNote(updated);
        setLastSavedTitle(updated.title);
        setLastSavedContent(updated.content);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut: Ctrl+S to save
  useKeyboardShortcut({
    key: 's',
    ctrlKey: true,
    handler: () => {
      if (hasUnsavedChanges && selectedNote) {
        handleSave();
      }
    },
    enabled: !!selectedNote && hasUnsavedChanges,
  });

  // Auto-save after 500ms of inactivity
  useAutoSave({
    value: noteContent + noteTitle,
    onSave: handleSave,
    delay: 500,
    enabled: hasUnsavedChanges && !!selectedNote,
  });

  const handleNoteCreate = async () => {
    try {
      const newNote = await databaseClient.createNote({
        title: 'Untitled Note',
        content: '# New Note\n\nStart writing...',
      });
      setNotes((prev) => [newNote, ...prev]); // Add to beginning
      handleNoteSelect(newNote);
    } catch (error) {
      console.error('Failed to create note:', error);
      toast.error('Failed to create note. Please try again.');
    }
  };

  const handleNoteDelete = async (id: number) => {
    try {
      const success = await databaseClient.deleteNote(id);
      if (success) {
        setNotes((prev) => prev.filter((n) => n.id !== id));

        // If deleted note was selected, select another note
        if (selectedNote?.id === id) {
          const remaining = notes.filter((n) => n.id !== id);
          if (remaining.length > 0) {
            handleNoteSelect(remaining[0]);
          } else {
            // Create a new note if all were deleted
            await handleNoteCreate();
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note. Please try again.');
    }
  };

  const handleContentChange = (newContent: string) => {
    // Just update the local state - auto-save will handle database updates
    setNoteContent(newContent);
  };

  const handleTitleChange = (newTitle: string) => {
    setNoteTitle(newTitle);
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);

    // Save title to database
    if (selectedNote && noteTitle !== selectedNote.title) {
      try {
        const updated = await databaseClient.updateNote(selectedNote.id, {
          title: noteTitle,
        });

        if (updated) {
          setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
          setSelectedNote(updated);
        }
      } catch (error) {
        console.error('Failed to save title:', error);
        toast.error('Failed to save title. Please try again.');
      }
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Revert to original title
      if (selectedNote) {
        setNoteTitle(selectedNote.title);
      }
      setIsEditingTitle(false);
    }
  };

  const getDisplayTitle = (): string => {
    const title = typeof noteTitle === 'string' ? noteTitle : '';

    if (title.trim()) {
      return title;
    }

    // Extract first line from content
    const content = typeof noteContent === 'string' ? noteContent : '';
    const firstLine = content.split('\n')[0].trim();

    // Remove markdown heading symbols
    const cleanedLine = firstLine.replace(/^#+\s*/, '');

    return cleanedLine || 'Untitled Note';
  };

  return (
    <ThemeProvider>
      {/* Toast Notifications */}
      {toast.toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => toast.hideToast(t.id)} />
      ))}

      {testMode ? (
        <div className={styles.appContainer} data-testid="app-container">
          <div
            style={{
              padding: '10px 20px',
              background: 'var(--color-surface)',
              borderBottom: '2px solid var(--color-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: '18px' }}>
                🧪 Database Test Mode
              </h2>
              <p
                style={{
                  margin: '4px 0 0 0',
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                }}
              >
                Test CRUD operations on SQLite database
              </p>
            </div>
            <button
              onClick={() => setTestMode(false)}
              style={{
                padding: '8px 16px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              ← Back to App
            </button>
          </div>
          <DatabaseTester />
        </div>
      ) : (
        <div className={styles.appContainer} data-testid="app-container">
          <ResizablePane
            left={
              <aside className={styles.sidebar}>
                <NotesList
                  notes={notes}
                  selectedNoteId={selectedNote?.id || null}
                  onNoteSelect={handleNoteSelect}
                  onNoteCreate={handleNoteCreate}
                  onNoteDelete={handleNoteDelete}
                  isLoading={isLoading}
                />
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
                    <SaveButton
                      hasUnsavedChanges={hasUnsavedChanges}
                      onSave={handleSave}
                      isSaving={isSaving}
                    />
                    <PreviewToggle
                      isVisible={showPreview}
                      onToggle={() => setShowPreview(!showPreview)}
                    />
                    <ThemeToggle inline />
                  </div>
                </div>

                {/* Editor and Preview Area */}
                <div className={styles.editorContainer}>
                  {!showPreview ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={styles.editorOnly}
                    >
                      <NoteEditor
                        value={noteContent}
                        onChange={handleContentChange}
                        onScroll={setEditorScrollPercentage}
                      />
                    </motion.div>
                  ) : (
                    <ResizablePane
                      left={
                        <NoteEditor
                          value={noteContent}
                          onChange={handleContentChange}
                          onScroll={setEditorScrollPercentage}
                        />
                      }
                      right={
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          style={{ height: '100%' }}
                        >
                          <MarkdownPreview
                            content={noteContent}
                            scrollPercentage={editorScrollPercentage}
                          />
                        </motion.div>
                      }
                      defaultSize={50}
                      minSize={20}
                      maxSize={80}
                    />
                  )}
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
      )}
    </ThemeProvider>
  );
};
